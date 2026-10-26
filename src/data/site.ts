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
            label: 'Services',
            href: '/services',
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
            'Server and data center software, server security for hosting providers, and local server AI for sysadmin tasks and security from Voltaic Hosting. Hosting, colocation, game servers, and Git deploys.',
        keywords:
            'voltaic hosting, hosting, colocation, game servers, git deploy, one-click services, server hardware, MicroVMs, Wazuh, firewall, privacy, server AI, local AI, sysadmin automation, data center software, server security',
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
    heroLede: 'Server and data center software.',
} satisfies SiteConfig;

export const sitemapPaths: string[] = [
    '/',
    '/services',
    '/about',
    '/faq',
    '/contact',
    '/branding',
    '/privacy',
    '/terms',
];
