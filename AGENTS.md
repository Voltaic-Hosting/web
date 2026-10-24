# Voltaic Hosting Website

Guidelines for AI agents working in this repository.

## Project

Public marketing site for Voltaic Hosting.

Stack: Astro 7 static output + Svelte 5 islands + TypeScript 6 + Tailwind CSS 4 + Vite 8. No server-side runtime, no PHP anywhere.

### Surfaces

| Surface | Route(s) | Notes |
| --- | --- | --- |
| Home | `/` | Services, panel showcase, values from `src/data` |
| About | `/about` | Company and operating principles |
| FAQ | `/faq` | Billing, panel, privacy, hosting, and support answers |
| Contact | `/contact` | Email and service list, no form yet |
| Branding | `/branding` | Logo downloads and usage notes |
| Panel | `/panel` | Voltaic Panel concept UI (noindex, Svelte island) |
| Privacy | `/privacy` | No ads, tracking, or telemetry |
| Terms | `/terms` | Website and service terms |
| Sitemap | `/sitemap.xml` | Public URL list for crawlers |
| Errors | unmatched routes | `404.html` and `/errors/NNN.html` for 401, 403, 419, 429, 500, 503, wired via nginx `error_page` |

### Layout

- `src/data` typed content modules (nav, services, values, legal, panel data) and `types.ts`
- `src/components` shared Astro components
- `src/layouts/BaseLayout.astro` document shell: SEO meta, JSON-LD, theme init script
- `src/pages` routes plus `sitemap.xml.ts` and `errors/[status].astro`
- `src/panel` Svelte 5 panel island (runes only: `$state`, `$derived`, `$effect`, `$props`)
- `src/styles/app.css` theme tokens and BEM-style components, `src/styles/panel.css` panel styles
- `public` static assets
- `tests` Vitest data integrity and `dist` smoke tests
- `docker/nginx/default.conf` static site config for the container image

## Commands

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run preview
pnpm run format
pnpm run lint
pnpm test
pnpm run lighthouse:ci
```

`pnpm run lint` is Prettier check + `astro check` + ESLint. `pnpm test` is `astro build` + Vitest against `dist`.

## Writing rules for site copy

When writing or editing user-facing prose, keep it direct and specific.

- Say what the thing is. Do not use "It is not X, it is Y" framing.
- No filler transitions ("Let's dive in", "Here is the thing", "In a world where").
- Headings should describe the section, not tease it like a movie poster.
- No emdashes. No fabricated facts.
- Prefer short factual sentences mixed with longer ones when needed.

Reference: [no_ai_slop_writing_rules](https://github.com/realrossmanngroup/no_ai_slop_writing_rules).

## Code changes

- Match existing Astro and Svelte 5 conventions in the repo
- Content lives in `src/data`. Keep page components thin
- The site is fully static: no server runtime, no SSR routes, no API endpoints
- Panel code uses Svelte 5 runes only, no stores, no legacy directives
- Run `pnpm run lint` and `pnpm test` after changes
- Do not weaken the pnpm supply chain settings in `pnpm-workspace.yaml` and do not add `minimumReleaseAgeExclude` entries to work around failures; pick older versions instead
- Do not commit `.env`, credentials, or build artifacts ignored by `.gitignore`

## CI/CD

GitHub Actions workflows live in `.github/workflows/`. Actions are pinned to full commit SHAs. Dependabot opens update PRs for npm (pnpm lockfile), Docker base images, and Actions.

| Workflow | Purpose |
| --- | --- |
| `ci.yml` | pnpm install, audit, lint, build, Vitest, dist artifact |
| `lighthouse.yml` | Lighthouse CI (performance, accessibility, best practices, SEO) on public pages |
| `codeql.yml` | CodeQL for JavaScript/TypeScript and workflow files (advanced setup) |
| `dependency-review.yml` | Blocks PRs that add moderate+ severity dependency issues |

Workflow defaults follow GitHub's [secure use](https://docs.github.com/en/actions/reference/security/secure-use) guidance: least-privilege `permissions`, concurrency groups, and pinned third-party actions.

Do not enable GitHub CodeQL default setup on this repo while `codeql.yml` is present. Default setup blocks SARIF uploads from the advanced workflow.
