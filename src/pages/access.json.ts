import type { APIRoute } from 'astro';
import { accessPoints } from '@/data/access';
import { site } from '@/data/site';

export const GET: APIRoute = () =>
    new Response(JSON.stringify({ domain: site.domain, access: accessPoints }, null, 2), {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, max-age=300',
        },
    });
