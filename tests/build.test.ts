// Smoke test over the built site in dist/. Runs after `astro build`
// via the package.json test script.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { errors } from '../src/data/errors';
import { site } from '../src/data/site';
import { absoluteUrl } from '../src/lib/url';

const dist = join(import.meta.dirname, '../dist');

const readPage = (path: string) => readFileSync(join(dist, path), 'utf8');

const pages: Array<{ file: string; path: string; title: string }> = [
    {
        file: 'index.html',
        path: '/',
        title: `${site.seo.defaultTitle}${site.seo.titleSeparator}${site.tagline}`,
    },
    {
        file: 'about.html',
        path: '/about',
        title: `About${site.seo.titleSeparator}${site.seo.defaultTitle}`,
    },
    {
        file: 'faq.html',
        path: '/faq',
        title: `FAQ${site.seo.titleSeparator}${site.seo.defaultTitle}`,
    },
    {
        file: 'contact.html',
        path: '/contact',
        title: `Contact${site.seo.titleSeparator}${site.seo.defaultTitle}`,
    },
    {
        file: 'branding.html',
        path: '/branding',
        title: `Branding${site.seo.titleSeparator}${site.seo.defaultTitle}`,
    },
    {
        file: 'privacy.html',
        path: '/privacy',
        title: `Privacy${site.seo.titleSeparator}${site.seo.defaultTitle}`,
    },
    {
        file: 'terms.html',
        path: '/terms',
        title: `Terms of use${site.seo.titleSeparator}${site.seo.defaultTitle}`,
    },
    {
        file: 'panel.html',
        path: '/panel',
        title: `Voltaic Panel concept${site.seo.titleSeparator}${site.seo.defaultTitle}`,
    },
];

describe('built site', () => {
    it.each(pages)(
        '$path exists with the expected title and canonical',
        ({ file, path, title }) => {
            const fullPath = join(dist, file);
            expect(existsSync(fullPath), `${file} should exist`).toBe(true);

            const html = readPage(file);

            expect(html).toContain(`<title>${title}</title>`);
            expect(html).toContain(
                `<link rel="canonical" href="${absoluteUrl(site.domain, path)}"`,
            );
        },
    );

    it('home page embeds Organization and WebSite JSON-LD', () => {
        const html = readPage('index.html');
        const jsonLdBlocks = [
            ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),
        ].map((match) => JSON.parse(match[1]) as { '@type': string });

        const types = jsonLdBlocks.map((block) => block['@type']);

        expect(types).toContain('Organization');
        expect(types).toContain('WebSite');
    });

    it('panel page is noindex', () => {
        const html = readPage('panel.html');

        expect(html).toContain('noindex, nofollow');
    });

    it('panel page and home showcase server-render the panel markup', async () => {
        const { panel } = await import('../src/data/panel');

        for (const file of ['panel.html', 'index.html']) {
            const html = readPage(file);

            expect(html, file).toContain('panel-app');
            for (const item of panel.nav) {
                expect(html, `${file} nav ${item.id}`).toContain(item.label);
            }
        }
    });

    it('home page loads the panel island lazily', () => {
        const html = readPage('index.html');

        const island = html.match(/<astro-island[^>]*PanelApp[^>]*>/)?.[0] ?? '';
        expect(island).toContain('client="visible"');
        expect(html).not.toMatch(/<script[^>]+src="[^"]*PanelApp[^"]*"/);
    });

    it('sitemap.xml lists the public URLs', () => {
        const xml = readPage('sitemap.xml');

        expect(xml).toContain('<urlset');
        expect(xml).toContain('https://voltaic.host/');
        expect(xml).toContain('https://voltaic.host/branding');
        expect(xml).toContain('https://voltaic.host/faq');
    });

    it('404 and error pages render each status title and description', () => {
        const files: Record<number, string> = {
            404: '404.html',
            401: 'errors/401.html',
            403: 'errors/403.html',
            419: 'errors/419.html',
            429: 'errors/429.html',
            500: 'errors/500.html',
            503: 'errors/503.html',
        };

        for (const [status, file] of Object.entries(files)) {
            const html = readPage(file);
            const error = errors[status];

            expect(html, file).toContain(`Error ${status}`);
            expect(html, file).toContain(error.title);
            expect(html, file).toContain(error.description);
            expect(html, file).toContain('noindex, nofollow');
        }
    });

    it('no page loads scripts or stylesheets from an external origin', () => {
        for (const { file } of [...pages, { file: '404.html', path: '/404', title: '' }]) {
            const html = readPage(file);

            const externalScripts = [
                ...html.matchAll(/<script[^>]+src=["'](https?:)?\/\/([^/"']+)/g),
            ].map((match) => match[2]);
            const externalStyles = [
                ...html.matchAll(
                    /<link[^>]+rel=["']stylesheet["'][^>]+href=["'](https?:)?\/\/([^/"']+)/g,
                ),
            ].map((match) => match[2]);

            expect(externalScripts, `${file} external scripts`).toEqual([]);
            expect(externalStyles, `${file} external stylesheets`).toEqual([]);
        }
    });
});
