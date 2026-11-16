# syntax=docker/dockerfile:1.7

# Voltaic Hosting website
# Multi-stage, rootless, minimal Chainguard images

ARG NODE_IMAGE=cgr.dev/chainguard/node:latest-dev
ARG NGINX_IMAGE=cgr.dev/chainguard/nginx:latest

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION=0.1.0

# -----------------------------------------------------------------------------
# Static site build
# -----------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS build

WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    PNPM_HOME=/pnpm \
    PATH="/pnpm:$PATH"

RUN corepack enable \
    && corepack prepare pnpm@12.15.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN pnpm install --frozen-lockfile

COPY tsconfig.json astro.config.mjs ./
COPY src ./src
COPY public ./public

ENV NODE_ENV=production

RUN pnpm run build

# -----------------------------------------------------------------------------
# Web runtime (Chainguard nginx, distroless, non-root uid 65532)
# -----------------------------------------------------------------------------
FROM ${NGINX_IMAGE} AS web

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

LABEL org.opencontainers.image.title="Voltaic Hosting Website" \
      org.opencontainers.image.description="Static Astro marketing site for Voltaic Hosting served by Chainguard nginx" \
      org.opencontainers.image.url="https://voltaic.host" \
      org.opencontainers.image.source="https://github.com/Voltaic-Hosting/website" \
      org.opencontainers.image.vendor="Voltaic Hosting" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.base.name="cgr.dev/chainguard/nginx:latest"

# Chainguard images are distroless: no shell, no package manager, no RUN.
# The image already runs as uid 65532 with entrypoint /usr/sbin/nginx and
# default args "-c /etc/nginx/nginx.conf -e /dev/stderr -g daemon off;".
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

USER 65532

EXPOSE 8080

STOPSIGNAL SIGQUIT
