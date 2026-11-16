import type { SiteConfig } from './types';

export const site: SiteConfig = {
    name: 'Voltaic Hosting',
    tagline: 'Hosting that just works.',
    domain: 'https://voltaic.host',
    contact: {
        email: 'team@voltaic.host',
        responseTime: 'We reply within two business days, Monday through Friday.',
        // Paste a Formbricks link-survey URL (https://…/s/…) to embed the
        // contact form on /contact. Leave empty to show email only.
        formSurveyUrl: '',
    },
    nav: [
        {
            label: 'Game Servers',
            href: '/game-servers',
        },
        {
            label: 'Websites',
            href: '/websites',
        },
        {
            label: 'Your Server',
            href: '/servers',
        },
        {
            label: 'Business',
            href: '/business',
        },
        {
            label: 'FAQ',
            href: '/faq',
        },
    ],
    footerNav: [
        {
            label: 'Privacy',
            href: '/privacy',
        },
        {
            label: 'Terms',
            href: '/terms',
        },
    ],
    privacyNote: "We don't track you, display ads, or collect telemetry.",
    seo: {
        defaultTitle: 'Voltaic Hosting',
        titleSeparator: ' · ',
        defaultDescription:
            'Game servers, website hosting, and your own private server from Voltaic Hosting. One-click setup, scheduled backups, and human-first support. No lock-in.',
        keywords:
            'game server hosting, minecraft server hosting, valheim server hosting, arma reforger, website hosting, git deploys, self hosting, voltaic panel, private server, web hosting, no lock in, data portability',
        ogImage: '/brand/og.png',
        twitterCard: 'summary_large_image',
        locale: 'en_US',
        organization: {
            type: 'Organization',
            name: 'Voltaic Hosting',
            url: 'https://voltaic.host',
            email: 'team@voltaic.host',
            logo: 'https://voltaic.host/brand/logo-on-light.png',
            sameAs: [],
        },
    },
} satisfies SiteConfig;

export const sitemapPaths: string[] = [
    '/',
    '/game-servers',
    '/websites',
    '/servers',
    '/business',
    '/about',
    '/faq',
    '/contact',
    '/branding',
    '/privacy',
    '/terms',
];
