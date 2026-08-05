# Voltaic Hosting Website

Public marketing site for [Voltaic Hosting](https://voltaic.host).

Stack: Laravel 13, Inertia.js, React, TypeScript, Tailwind CSS 4, Vite.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home, panel showcase, services, operating principles |
| `/about` | Company background and contact details |
| `/faq` | Billing, panel, privacy, hosting, and support answers |
| `/contact` | Email and service list |
| `/branding` | Logo downloads and usage notes |
| `/panel` | Voltaic Panel concept UI |
| `/privacy` | Privacy policy |
| `/terms` | Terms of use |
| `/sitemap.xml` | Sitemap for crawlers |
| unmatched URLs | Branded 404 and other error pages (401, 403, 404, 419, 429, 500, 503) |

Site copy and navigation live in `config/voltaic.php`. React pages live under `resources/js/Pages/`.

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
pnpm install
pnpm run build
php artisan serve
```

For local development with hot reload:

```bash
composer dev
```

That runs the Laravel server and Vite together. Open http://127.0.0.1:8000 in your browser. Port 5173 is the Vite dev server only, not the site.

Requires Node.js 22+ and pnpm 11+ (`packageManager` in `package.json`).

## Commands

```bash
composer format      # PHP style (Pint)
composer lint        # Pint check + PHPStan
composer test        # PHPUnit

pnpm run format      # Prettier (TS/CSS/JS config)
pnpm run lint        # Prettier check, TypeScript, ESLint
pnpm run build       # Production assets
pnpm audit           # Production dependency audit
```

CI runs on push and pull requests via GitHub Actions (PHP 8.3/8.4 matrix, frontend lint/build, CodeQL, dependency review). See `AGENTS.md` for workflow details.

## Layout

- `app/Http/Controllers` page controllers
- `config/voltaic.php` site content
- `resources/js/Components` shared React UI
- `resources/js/Pages` Inertia pages
- `resources/css/app.css` theme and component styles
- `resources/views/app.blade.php` Inertia root template

## License

MIT. See `LICENSE`.

Security reports: see `SECURITY.md`.
