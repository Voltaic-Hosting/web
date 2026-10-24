import type { SiteConfig } from './types';

export const site: SiteConfig = {
    name: 'Voltaic Hosting',
    tagline: 'Sustainable. Secure. Private.',
    domain: 'https://voltaic.host',
    contact: {
        email: 'team@voltaic.host',
        responseTime: 'I reply within two business days, Monday through Friday.',
    },
    nav: [
        {
            label: 'Home',
            href: '/',
        },
        {
            label: 'Panel',
            href: '/panel',
        },
        {
            label: 'About',
            href: '/about',
        },
        {
            label: 'FAQ',
            href: '/faq',
        },
    ],
    footerNav: [
        {
            label: 'FAQ',
            href: '/faq',
        },
        {
            label: 'Privacy',
            href: '/privacy',
        },
        {
            label: 'Terms',
            href: '/terms',
        },
    ],
    privacyNote: 'No ads. No tracking. No telemetry.',
    seo: {
        defaultTitle: 'Voltaic Hosting',
        titleSeparator: ' · ',
        defaultDescription:
            'Hosting, colocation, and infrastructure from Voltaic Hosting. One-click services and game servers. Deploy websites from any Git repository.',
        keywords:
            'voltaic hosting, hosting, colocation, game servers, git deploy, one-click services, server hardware, MicroVMs, Wazuh, firewall, privacy',
        ogImage: '/brand/logo-on-light.png',
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
    heroLede:
        'Hosting, colocation, and infrastructure with clear billing, strong privacy, and no lock-in.',
} satisfies SiteConfig;

export const sitemapPaths: string[] = [
    '/',
    '/about',
    '/faq',
    '/contact',
    '/branding',
    '/privacy',
    '/terms',
];
