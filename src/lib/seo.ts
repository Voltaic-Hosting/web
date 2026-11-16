import { absoluteUrl } from '@/lib/url';
import type { SiteConfig } from '@/data/types';

export function organizationJsonLd(site: SiteConfig): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': site.seo.organization.type,
        name: site.seo.organization.name,
        url: site.seo.organization.url,
        email: site.seo.organization.email,
        contactPoint: {
            '@type': 'ContactPoint',
            email: site.seo.organization.email,
            contactType: 'customer support',
        },
        logo: site.seo.organization.logo,
        description: site.seo.defaultDescription,
        ...(site.seo.organization.sameAs.length > 0
            ? { sameAs: site.seo.organization.sameAs }
            : {}),
    };
}

export function websiteJsonLd(site: SiteConfig): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: site.name,
        url: absoluteUrl(site.domain, '/'),
        description: site.seo.defaultDescription,
        publisher: {
            '@type': 'Organization',
            name: site.name,
            url: site.domain,
        },
    };
}

export function webPageJsonLd(
    site: SiteConfig,
    options: {
        name: string;
        path: string;
        description: string;
        type?: string;
        datePublished?: string;
    },
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': options.type ?? 'WebPage',
        name: options.name,
        url: absoluteUrl(site.domain, options.path),
        description: options.description,
        ...(options.datePublished ? { datePublished: options.datePublished } : {}),
        isPartOf: {
            '@type': 'WebSite',
            name: site.name,
            url: site.domain,
        },
    };
}

export function servicesJsonLd(
    site: SiteConfig,
    services: { slug: string; title: string; summary: string }[],
    options: { name?: string; path?: string; description?: string } = {},
): Record<string, unknown>[] {
    const name = options.name ?? 'Business services';
    const path = options.path ?? '/business';
    const description =
        options.description ??
        'Panel software, custom builds, colocation, and security services for hosting providers, data centers, and infrastructure teams.';
    return [
        webPageJsonLd(site, {
            name,
            path,
            description,
        }),
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: services.map((service, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Service',
                    name: service.title,
                    description: service.summary,
                    url: `${site.domain}${path}#${service.slug}`,
                    provider: {
                        '@type': 'Organization',
                        name: site.seo.organization.name,
                        url: site.seo.organization.url,
                    },
                },
            })),
        },
    ];
}

export function productsJsonLd(
    site: SiteConfig,
    products: { slug: string; title: string; metaDescription: string; href: string }[],
): Record<string, unknown>[] {
    return [
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Voltaic Hosting products',
            itemListElement: products.map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Service',
                    name: product.title,
                    description: product.metaDescription,
                    url: `${site.domain}${product.href}`,
                    provider: {
                        '@type': 'Organization',
                        name: site.seo.organization.name,
                        url: site.seo.organization.url,
                    },
                },
            })),
        },
    ];
}

export function faqPageJsonLd(
    site: SiteConfig,
    options: {
        name: string;
        path: string;
        description: string;
        items: Array<{ question: string; answer: string[] }>;
    },
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        name: options.name,
        url: absoluteUrl(site.domain, options.path),
        description: options.description,
        mainEntity: options.items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer.join(' '),
            },
        })),
        isPartOf: {
            '@type': 'WebSite',
            name: site.name,
            url: site.domain,
        },
    };
}
