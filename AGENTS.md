# Voltaic Hosting Website

Guidelines for AI agents working in this repository.

## Project

Public marketing site for Voltaic Hosting.

Stack: Laravel 13 + Inertia.js + React + TypeScript + Tailwind CSS 4 + Vite.

### Surfaces

| Surface | Route(s) | Notes |
| --- | --- | --- |
| Home | `/` | Services, panel showcase, values from config |
| About | `/about` | Company and operating principles |
| Contact | `/contact` | Email and service list, no form yet |
| Branding | `/branding` | Logo downloads and usage notes |
| Panel | `/panel` | Voltaic Panel concept UI (noindex) |
| Privacy | `/privacy` | No ads, tracking, or telemetry |
| Terms | `/terms` | Website and service terms |
| Sitemap | `/sitemap.xml` | Public URL list for crawlers |
| Errors | unmatched routes | Inertia `Error` page for 403, 404, 500, 503 |

### Layout

- `app/Http/Controllers` invokable page controllers
- `config/voltaic.php` nav, services, values, SEO defaults
- `resources/js/Components` shared React UI
- `resources/js/Pages` Inertia pages
- `resources/css/app.css` theme tokens and BEM-style components
- `resources/views/app.blade.php` Inertia root template
- `routes/web.php` named public routes

## Commands

```bash
composer install
npm install
npm run build
composer format
npm run format
composer lint
npm run lint
composer test
php artisan serve
npm run lighthouse:ci
```

PHP: Pint + Larastan (`composer format` / `composer lint`).

Frontend: Prettier, TypeScript, ESLint (`npm run format` / `npm run lint`).

## Writing rules for site copy

When writing or editing user-facing prose, keep it direct and specific.

- Say what the thing is. Do not use "It is not X, it is Y" framing.
- No filler transitions ("Let's dive in", "Here is the thing", "In a world where").
- Headings should describe the section, not tease it like a movie poster.
- No emdashes. No fabricated facts.
- Prefer short factual sentences mixed with longer ones when needed.

Reference: [no_ai_slop_writing_rules](https://github.com/realrossmanngroup/no_ai_slop_writing_rules).

## Code changes

- Match existing Laravel and Inertia conventions in the repo
- Keep controllers thin. Put content in `config/voltaic.php`
- Run `composer lint` and `composer test` after PHP changes
- Run `npm run lint` and `npm run build` after frontend changes
- Do not commit `.env`, credentials, or build artifacts ignored by `.gitignore`

## CI/CD

GitHub Actions workflows live in `.github/workflows/`. Actions are pinned to full commit SHAs. Dependabot opens update PRs for Composer, npm, and Actions.

| Workflow | Purpose |
| --- | --- |
| `ci.yml` | PHP matrix (8.3, 8.4), Pint, PHPStan, PHPUnit, frontend lint, Vite build |
| `lighthouse.yml` | Lighthouse CI (performance, accessibility, best practices, SEO) on public pages |
| `codeql.yml` | CodeQL for JavaScript/TypeScript and workflow files |
| `dependency-review.yml` | Blocks PRs that add moderate+ severity dependency issues |

Workflow defaults follow GitHub's [secure use](https://docs.github.com/en/actions/reference/security/secure-use) guidance: least-privilege `permissions`, concurrency groups, and pinned third-party actions.
