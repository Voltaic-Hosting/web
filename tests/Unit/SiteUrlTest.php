<?php

namespace Tests\Unit;

use App\Support\SiteUrl;
use Tests\TestCase;

class SiteUrlTest extends TestCase
{
    public function test_resolve_joins_base_and_path(): void
    {
        $this->assertSame(
            'https://voltaic.host/branding',
            SiteUrl::resolve('https://voltaic.host', '/branding'),
        );
    }

    public function test_resolve_keeps_root_path(): void
    {
        $this->assertSame(
            'https://voltaic.host/',
            SiteUrl::resolve('https://voltaic.host', '/'),
        );
    }

    public function test_request_path_strips_query_string(): void
    {
        $this->assertSame('/about', SiteUrl::requestPath('/about?preview=1'));
    }
}
