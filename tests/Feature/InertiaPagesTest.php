<?php

namespace Tests\Feature;

use Tests\TestCase;

class InertiaPagesTest extends TestCase
{
    public function test_home_page_renders_expected_inertia_payload(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Home')
                ->has('services', count(config('voltaic.services')))
                ->has('values', count(config('voltaic.values')))
                ->has('panel.shots', count(config('voltaic.panel.shots')))
                ->where('site.name', config('voltaic.name'))
                ->where('site.tagline', config('voltaic.tagline')));
    }

    public function test_about_page_renders_expected_inertia_payload(): void
    {
        $this->get(route('about'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('About')
                ->has('values', count(config('voltaic.values')))
                ->where('about.intro', config('voltaic.about.intro'))
                ->has('about.sections', count(config('voltaic.about.sections'))));
    }

    public function test_contact_page_renders_expected_inertia_payload(): void
    {
        $this->get(route('contact'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Contact')
                ->has('services', count(config('voltaic.services')))
                ->where('site.contact.email', config('voltaic.contact.email')));
    }

    public function test_privacy_page_renders_expected_inertia_payload(): void
    {
        $this->get(route('privacy'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Privacy')
                ->where('legal.operator', config('voltaic.legal.operator'))
                ->where('content.intro', config('voltaic.legal.privacy.intro')));
    }

    public function test_shared_site_config_is_available_on_every_page(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('site.nav', count(config('voltaic.nav')))
                ->has('site.footerNav', count(config('voltaic.footer_nav')))
                ->has('site.seo')
                ->where('site.domain', config('voltaic.domain'))
                ->where('site.privacyNote', config('voltaic.privacy_note')));
    }

    public function test_branding_page_renders_expected_inertia_payload(): void
    {
        $this->get(route('branding'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Branding')
                ->has('branding.assets', count(config('voltaic.branding.assets')))
                ->where('branding.intro', config('voltaic.branding.intro')));
    }
}
