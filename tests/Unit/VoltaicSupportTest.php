<?php

namespace Tests\Unit;

use App\Support\Voltaic;
use Tests\TestCase;

class VoltaicSupportTest extends TestCase
{
    public function test_site_props_include_configured_domain(): void
    {
        $props = Voltaic::siteProps();

        $this->assertSame(config('voltaic.name'), $props['name']);
        $this->assertSame(config('voltaic.domain'), $props['domain']);
        $this->assertSame(config('voltaic.nav'), $props['nav']);
    }

    public function test_error_for_returns_configured_status_copy(): void
    {
        $error = Voltaic::errorFor(404);

        $this->assertSame(config('voltaic.errors.404.title'), $error['title']);
        $this->assertSame(config('voltaic.errors.404.description'), $error['description']);
    }

    public function test_error_for_falls_back_to_default(): void
    {
        $error = Voltaic::errorFor(418);

        $this->assertSame(config('voltaic.errors.default.title'), $error['title']);
        $this->assertSame(config('voltaic.errors.default.description'), $error['description']);
    }
}
