// UI-level smoke tests over the built site in dist/.
// Covers landmarks, link integrity, JSON-LD validity, no-JS structure,
// and footer access/payment elements.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { describe, expect, it } from 'vitest';
import { accessPoints } from '../src/data/access';
import { products } from '../src/data/products';
import { site } from '../src/data/site';

const dist = join(import.meta.dirname, '../dist');

const htmlFiles = (dir: string): string[] =>
    readdirSync(dir).flatMap((entry) => {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) return htmlFiles(full);
        return entry.endsWith('.html') ? [full] : [];
    });

const pages = htmlFiles(dist).map((file) => ({
    file: file.slice(dist.length + 1),
    html: readFileSync(file, 'utf8'),
}));

// services.html is a bare redirect stub and panel.html is a bare app
// surface; neither carries site chrome.
const publicPages = pages.filter(
    ({ file }) => !file.startsWith('errors/') && file !== 'services.html' && file !== 'panel.html',
);

const resolveInternal = (href: string): string | null => {
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return null;
    }
    let path = href;
    if (path.startsWith(site.domain)) path = path.slice(site.domain.length);
    if (!path.startsWith('/')) return null;
    path = path.split('#')[0].split('?')[0];
    if (path === '' || path === '/') return 'index.html';
    if (extname(path)) return path.slice(1);
    return `${path.slice(1)}.html`;
};

describe('page landmarks', () => {
    it.each(publicPages.map((p) => [p.file, p.html] as const))(
        '%s has h1, header, main, footer, and a skip link',
        (_file, html) => {
            expect(html).toContain('<h1');
            expect(html).toContain('<header');
            expect(html).toContain('<main');
            expect(html).toContain('<footer');
            expect(html).toContain('class="skip-link"');
        },
    );
});

describe('link integrity', () => {
    it('every internal href and src resolves to a built file', () => {
        const broken: string[] = [];

        for (const { file, html } of pages) {
            const refs = [
                // Navigational links and embedded resources
                ...[...html.matchAll(/<a\s[^>]*?href="([^"]+)"/g)].map((m) => m[1]),
                ...[...html.matchAll(/<(?:img|script|iframe)\s[^>]*?src="([^"]+)"/g)].map(
                    (m) => m[1],
                ),
                // Asset links, skipping canonical/alternate which are not navigable
                ...[...html.matchAll(/<link\s[^>]*>/g)]
                    .filter(
                        (m) =>
                            !/rel="(?:canonical|alternate)"/.test(m[0]) &&
                            !/href="[^"]*"[^>]*rel="(?:canonical|alternate)"/.test(m[0]),
                    )
                    .map((m) => m[0].match(/href="([^"]+)"/)?.[1])
                    .filter((v): v is string => Boolean(v)),
            ];

            for (const ref of refs) {
                const resolved = resolveInternal(ref);
                if (resolved && !existsSync(join(dist, resolved))) {
                    broken.push(`${file} -> ${ref} (expected ${resolved})`);
                }
            }
        }

        expect(broken).toEqual([]);
    });
});

describe('JSON-LD', () => {
    it.each(publicPages.map((p) => [p.file, p.html] as const))(
        '%s JSON-LD blocks parse as JSON',
        (_file, html) => {
            const blocks = [
                ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),
            ];
            for (const block of blocks) {
                expect(() => JSON.parse(block[1])).not.toThrow();
            }
        },
    );
});

describe('no-JS structure', () => {
    it('mobile menu and product dropdown use details/summary', () => {
        const html = readFileSync(join(dist, 'index.html'), 'utf8');

        expect(html).toContain('<details class="mobile-menu">');
        expect(html).toContain('<summary class="icon-btn menu-toggle"');
        expect(html).toContain('<details class="nav-dropdown">');
        expect(html).toContain('<summary class="nav-link nav-dropdown__summary">');
    });

    it('branding downloads are plain links, not JS-driven buttons', () => {
        const html = readFileSync(join(dist, 'branding.html'), 'utf8');

        expect(html).toContain('download');
        expect(html).not.toContain('brand-card__format-btn" type="button"');
        expect(html).not.toContain('data-format=');
    });

    it('JS-only controls are gated behind the js class', () => {
        const css = readFileSync(join(import.meta.dirname, '../src/styles/app.css'), 'utf8');

        expect(css).toContain('.js .theme-toggle');
        expect(css).toContain('.js .mobile-nav__theme');
    });
});

describe('footer access and payments', () => {
    it('lists every access point with a status', () => {
        const html = readFileSync(join(dist, 'index.html'), 'utf8');

        for (const point of accessPoints) {
            expect(html).toContain(`data-access-id="${point.id}"`);
        }
        expect(html).toContain('Address coming soon');
    });

    it('shows payment method badges', () => {
        const html = readFileSync(join(dist, 'index.html'), 'utf8');

        expect(html).toContain('payment-badges');
        expect(html).toContain('stripe');
        expect(html).toContain('Bitcoin');
        expect(html).toContain('Monero');
    });

    it('access.json endpoint serves the same access data', () => {
        const json = JSON.parse(readFileSync(join(dist, 'access.json'), 'utf8')) as {
            access: typeof accessPoints;
        };

        expect(json.access.map((point) => point.id)).toEqual(accessPoints.map((point) => point.id));
    });
});

describe('navigation', () => {
    it('desktop nav covers products dropdown and company links', () => {
        const html = readFileSync(join(dist, 'index.html'), 'utf8');

        for (const product of products) {
            expect(html).toContain(`href="${product.href}"`);
        }
        for (const href of ['/business', '/about', '/faq', '/contact']) {
            expect(html).toContain(`href="${href}"`);
        }
    });
});
