import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { services } from '../src/data/services';

const html = readFileSync('dist/services.html', 'utf8');
const index = readFileSync('dist/index.html', 'utf8');
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');

describe('/services page', () => {
    it('builds with the right title and canonical', () => {
        expect(html).toContain('<title>Services · Voltaic Hosting</title>');
        expect(html).toContain('<link rel="canonical" href="https://voltaic.host/services">');
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

    it('is in the sitemap and the home page nav', () => {
        expect(sitemap).toContain('/services');
        expect(index).toContain('href="/services"');
    });
});
