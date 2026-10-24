# syntax=docker/dockerfile:1.7

# Voltaic Hosting website
# Multi-stage, rootless, digest-pinned images

ARG NODE_IMAGE=node:22-alpine@sha256:ce8d97f7cfc7c5386421eb932df20a29df99b1a7f469f6157d5c9956702ffadc
ARG NGINX_IMAGE=docker.io/nginxinc/nginx-unprivileged:1.29-alpine@sha256:0c79d56aee561a1d81c63f00eee5fb5fe29279560cdc55e91425133104c7fbe6

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
    && corepack prepare pnpm@12.14.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN pnpm install --frozen-lockfile

COPY tsconfig.json astro.config.mjs ./
COPY src ./src
COPY public ./public

ENV NODE_ENV=production

RUN pnpm run build

# -----------------------------------------------------------------------------
# Web runtime (nginx, rootless)
# -----------------------------------------------------------------------------
FROM ${NGINX_IMAGE} AS web

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

LABEL org.opencontainers.image.title="Voltaic Hosting Website" \
      org.opencontainers.image.description="Static Astro marketing site for Voltaic Hosting served by rootless nginx" \
      org.opencontainers.image.url="https://voltaic.host" \
      org.opencontainers.image.source="https://github.com/Voltaic-Hosting/website" \
      org.opencontainers.image.vendor="Voltaic Hosting" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.base.name="nginxinc/nginx-unprivileged:1.29-alpine" \
      org.opencontainers.image.base.digest="sha256:0c79d56aee561a1d81c63f00eee5fb5fe29279560cdc55e91425133104c7fbe6"

USER root

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R a=rX /usr/share/nginx/html

USER nginx

EXPOSE 8080

STOPSIGNAL SIGQUIT

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
