import type { APIRoute } from 'astro';
import { site, sitemapPaths } from '@/data/site';
import { absoluteUrl } from '@/lib/url';

export const GET: APIRoute = () => {
    const urls = sitemapPaths.map((path) => ({
        loc: absoluteUrl(site.domain, path),
        changefreq: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? '1.0' : '0.7',
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
        (url) => `    <url>
        <loc>${url.loc}</loc>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`,
    )
    .join('\n')}
</urlset>
`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=UTF-8',
        },
    });
};
