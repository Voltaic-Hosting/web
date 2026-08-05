import { Head, usePage } from '@inertiajs/react';
import { absoluteUrl } from '@/lib/routes';
import type { PageProps } from '@/types';

interface SeoHeadProps {
    title?: string;
    description?: string;
    path?: string;
    type?: string;
    image?: string;
    noindex?: boolean;
    jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export default function SeoHead({
    title,
    description,
    path = '/',
    type = 'website',
    image,
    noindex = false,
    jsonLd,
}: SeoHeadProps) {
    const { site } = usePage<PageProps>().props;
    const seo = site.seo;
    const pageTitle = title
        ? `${title}${seo.title_separator}${seo.default_title}`
        : `${seo.default_title}${seo.title_separator}${site.tagline}`;
    const metaDescription = description ?? seo.default_description;
    const canonical = absoluteUrl(site.domain, path);
    const ogImage = absoluteUrl(site.domain, image ?? seo.og_image);
    const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={seo.keywords} />
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}
            <link rel="canonical" href={canonical} />

            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={site.name} />
            <meta property="og:locale" content={seo.locale} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={ogImage} />

            <meta name="twitter:card" content={seo.twitter_card} />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={ogImage} />

            {schemas.map((schema, index) => (
                <script
                    key={`jsonld-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </Head>
    );
}
