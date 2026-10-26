import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { about } from '../src/data/about';
import { branding } from '../src/data/branding';
import { errorFor, errors } from '../src/data/errors';
import { faq } from '../src/data/faq';
import { legal } from '../src/data/legal';
import { panel } from '../src/data/panel';
import { services } from '../src/data/services';
import { site } from '../src/data/site';
import { values } from '../src/data/values';
import { absoluteUrl } from '../src/lib/url';

describe('site data', () => {
    it('services use structured entries', () => {
        for (const service of services) {
            expect(service.slug).not.toBe('');
            expect(service.title).not.toBe('');
            expect(service.summary).not.toBe('');
        }
    });

    it('server-hardware has a Soon badge', () => {
        const hardware = services.find((service) => service.slug === 'server-hardware');

        expect(hardware).toBeDefined();
        expect(hardware?.badge).toBe('Soon');
    });

    it('security services are listed', () => {
        const slugs = services.map((service) => service.slug);

        expect(slugs).toContain('wazuh-xdr');
        expect(slugs).toContain('threat-intelligence');
        expect(slugs).toContain('anti-bot');
    });

    it('panel services cover one-click, games, and git deploys', () => {
        const slugs = services.map((service) => service.slug);

        expect(slugs).toContain('game-servers');
        expect(slugs).toContain('git-websites');
        expect(slugs).toContain('custom-software');

        const voltaicPanel = services.find((service) => service.slug === 'voltaic-panel');

        expect(voltaicPanel?.summary).toContain('One-click');
        expect(voltaicPanel?.summary).toContain('Git repository');
        expect(panel.lede).toContain('Git repository');
    });

    it('nav items reference known pages', () => {
        const knownPaths = [
            '/',
            '/about',
            '/faq',
            '/contact',
            '/services',
            '/branding',
            '/panel',
            '/privacy',
            '/terms',
        ];

        for (const item of [...site.nav, ...site.footerNav]) {
            expect(knownPaths).toContain(item.href);
            expect(item.label).not.toBe('');
        }
    });

    it('branding assets exist on disk', () => {
        for (const asset of branding.assets) {
            for (const path of Object.values(asset.formats)) {
                expect(existsSync(join(import.meta.dirname, '../public', path))).toBe(true);
            }
        }
    });

    it('contact email is configured', () => {
        expect(site.contact.email).toBe('team@voltaic.host');
    });

    it('privacy policy states no tracking', () => {
        expect(legal.privacy.intro).toContain('telemetry');
        expect(site.privacyNote).toBe('No ads. No tracking. No telemetry.');
    });

    it('values cover exit, pricing, and privacy', () => {
        const titles = values.map((value) => value.title);

        expect(titles).toContain('Cancel anytime');
        expect(titles).toContain('Quoted price is the price');
        expect(titles).toContain('Privacy stays with the customer');

        const bodies = values.map((value) => value.body).join(' ');

        expect(bodies).toContain('migrate');
        expect(bodies).toContain('30-day refund');
        expect(bodies).toContain('telemetry');
    });

    it('terms cover fees, cancellation, and migration', () => {
        const titles = legal.terms.sections.map((section) => section.title);

        expect(titles).toContain('Fees and refunds');
        expect(titles).toContain('Cancellation and migration');
        expect(titles).toContain('Acceptable use on Voltaic servers');

        const fees = legal.terms.sections.find((section) => section.title === 'Fees and refunds');

        expect(fees?.paragraphs.join(' ')).toContain('30-day refund');
    });

    it('about states founder, timeline, and regions', () => {
        const body = about.sections.flatMap((section) => section.paragraphs).join(' ');

        expect(body).toContain('2013');
        expect(body).toContain('2022');
        expect(body).toContain('solo');
        expect(body).toContain('United States');
        expect(body).toContain('Monero');
        expect(body).toContain('30-day refund');
    });

    it('about states the panel open source strategy', () => {
        const panelSection = about.sections.find((section) => section.title === 'Panel and daemon');

        expect(panelSection).toBeDefined();

        const body = panelSection?.paragraphs.join(' ') ?? '';

        expect(body).toContain('Older major versions');
        expect(body).toContain('open source');
        expect(body).toContain('bug fixes and security updates only');
        expect(body).toContain('newest major versions are closed source');
        expect(body).toContain('daemon');
    });

    it('faq covers billing, panel, and privacy', () => {
        const titles = faq.groups.map((group) => group.title);

        expect(titles).toContain('Billing and exit');
        expect(titles).toContain('Panel and software');
        expect(titles).toContain('Privacy and security');

        const questions = faq.groups
            .flatMap((group) => group.items)
            .map((item) => item.question)
            .join(' ')
            .toLowerCase();

        expect(questions).toContain('cancel');
        expect(questions).toContain('open source');
        expect(questions).toContain('track');

        for (const group of faq.groups) {
            expect(group.items.length).toBeGreaterThan(0);

            for (const item of group.items) {
                expect(item.question).not.toBe('');
                expect(item.answer.length).toBeGreaterThan(0);
            }
        }
    });

    it('error messages cover common HTTP statuses', () => {
        for (const status of [401, 403, 404, 419, 429, 500, 503]) {
            const error = errors[String(status)];

            expect(error).toBeDefined();
            expect(error.title).not.toBe('');
            expect(error.description).not.toBe('');
        }

        expect(errors.default.title).not.toBe('');
        expect(errors.default.description).not.toBe('');
    });

    it('errorFor returns configured copy and falls back to default', () => {
        expect(errorFor(404)).toEqual(errors['404']);
        expect(errorFor(418)).toEqual(errors.default);
    });
});

describe('absoluteUrl', () => {
    it('joins base and path', () => {
        expect(absoluteUrl('https://voltaic.host', '/branding')).toBe(
            'https://voltaic.host/branding',
        );
    });

    it('keeps root path', () => {
        expect(absoluteUrl('https://voltaic.host', '/')).toBe('https://voltaic.host/');
    });
});
