<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $domain = rtrim((string) config('voltaic.domain'), '/');
        $routes = config('voltaic.sitemap', []);

        $urls = collect($routes)
            ->map(function (string $name) use ($domain): array {
                $path = route($name, absolute: false);

                return [
                    'loc' => $domain.($path === '/' ? '/' : $path),
                    'changefreq' => $name === 'home' ? 'weekly' : 'monthly',
                    'priority' => $name === 'home' ? '1.0' : '0.7',
                ];
            })
            ->values()
            ->all();

        $xml = view('sitemap', ['urls' => $urls])->render();

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
