import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { services } from '../src/data/services';

const html = readFileSync('dist/business.html', 'utf8');
const servicesPage = readFileSync('dist/services.html', 'utf8');
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');

describe('/business page', () => {
    it('builds with the right title and canonical', () => {
        expect(html).toContain('<title>Business · Voltaic Hosting</title>');
        expect(html).toContain('<link rel="canonical" href="https://voltaic.host/business">');
    });

    it('lists every service title', () => {
        for (const service of services) {
            expect(html).toContain(service.title);
        }
    });

    it('has an anchor id for every service slug', () => {
        for (const service of services) {
            expect(html).toContain(`id="${service.slug}"`);
        }
    });

    it('is in the sitemap', () => {
        expect(sitemap).toContain('/business');
    });
});

describe('/services page', () => {
    it('redirects to /business and is not indexed', () => {
        expect(servicesPage).toContain('url=/business');
        expect(servicesPage).toContain('noindex');
        expect(sitemap).not.toContain('/services');
    });
});
