<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'site' => [
                'name' => config('voltaic.name'),
                'tagline' => config('voltaic.tagline'),
                'domain' => config('voltaic.domain'),
                'contact' => config('voltaic.contact'),
                'nav' => config('voltaic.nav'),
                'footerNav' => config('voltaic.footer_nav'),
                'privacyNote' => config('voltaic.privacy_note'),
                'seo' => config('voltaic.seo'),
            ],
        ];
    }
}
