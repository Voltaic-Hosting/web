<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PublicRoutesTest extends TestCase
{
    /**
     * @return array<string, array{0: string}>
     */
    public static function publicPages(): array
    {
        return [
            'home' => ['home'],
            'about' => ['about'],
            'faq' => ['faq'],
            'contact' => ['contact'],
            'branding' => ['branding'],
            'panel' => ['panel'],
            'privacy' => ['privacy'],
            'terms' => ['terms'],
        ];
    }

    #[DataProvider('publicPages')]
    public function test_public_get_routes_render_successfully(string $route): void
    {
        $this->get(route($route))->assertOk();
    }

    public function test_sitemap_returns_xml(): void
    {
        $this->get(route('sitemap'))
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee('<urlset', false)
            ->assertSee('https://voltaic.host/', false)
            ->assertSee('https://voltaic.host/branding', false)
            ->assertSee('https://voltaic.host/faq', false);
    }

    public function test_unknown_route_renders_not_found_page(): void
    {
        $this->get('/does-not-exist')
            ->assertNotFound()
            ->assertInertia(fn ($page) => $page->component('Error')->where('status', 404));
    }
}
