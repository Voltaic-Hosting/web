# Voltaic Hosting Website

Public marketing site for [Voltaic Hosting](https://voltaic.host).

Stack: Astro 7 (static output), Svelte 5 islands, Vite 8, TypeScript 6, Tailwind CSS 4, pnpm 12.

The site has no server-side runtime. Pages are rendered to static HTML at build time and served as files by a rootless nginx container. The only client-side JavaScript is the panel concept island and two small inline scripts (theme toggle, mobile menu).

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home, panel showcase, services, operating principles |
| `/about` | Company background and contact details |
| `/faq` | Billing, panel, privacy, hosting, and support answers |
| `/contact` | Email and service list |
| `/branding` | Logo downloads and usage notes |
| `/panel` | Voltaic Panel concept UI (noindex) |
| `/privacy` | Privacy policy |
| `/terms` | Terms of use |
| `/sitemap.xml` | Sitemap for crawlers |
| unmatched URLs | `404.html` plus `/errors/NNN.html` pages (401, 403, 419, 429, 500, 503) wired via nginx `error_page` |

Site copy and navigation live in `src/data`. Pages live under `src/pages`.

## Setup

```bash
pnpm install
pnpm run dev
```

Open http://localhost:4321 in your browser.

Requires Node.js 22.23.4+ and pnpm 12 (`packageManager` in `package.json`).

## Commands

```bash
pnpm run dev            # Dev server
pnpm run build          # Static build to dist/
pnpm run preview        # Serve dist locally
pnpm run format         # Prettier write
pnpm run format:check   # Prettier check
pnpm run typecheck      # astro check
pnpm run lint           # Prettier check + astro check + ESLint
pnpm test               # astro build + vitest
pnpm run lighthouse:ci  # Lighthouse CI against dist via astro preview
pnpm run audit          # Production dependency audit
```

## Layout

- `src/data` site content and typed interfaces (`types.ts`)
- `src/components` shared Astro UI
- `src/layouts/BaseLayout.astro` document shell, SEO head, theme init script
- `src/pages` routes, sitemap endpoint, error pages
- `src/panel` Svelte 5 panel concept island (runes only)
- `src/styles` Tailwind and component styles
- `public` static assets (brand, images, icons, robots.txt, site.webmanifest)
- `tests` Vitest data integrity and build smoke tests
- `docker` nginx config for the static container

## Deployment

The `Dockerfile` builds `dist` in a Node stage and serves it with `nginxinc/nginx-unprivileged` on port 8080 as a read-only, non-root container. `docker-compose.yml` runs it locally. `docker-compose.coolify.yml` is the Coolify build pack.

CI runs on push and pull requests via GitHub Actions (install, audit, lint, test, Lighthouse, CodeQL, dependency review). See `AGENTS.md` for workflow details.

## License

MIT. See `LICENSE`.

Security reports: see `SECURITY.md`.
