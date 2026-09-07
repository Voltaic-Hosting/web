<?php

namespace Tests\Unit;

use Tests\TestCase;

class VoltaicConfigTest extends TestCase
{
    public function test_services_use_structured_entries(): void
    {
        foreach (config('voltaic.services') as $service) {
            $this->assertIsArray($service);
            $this->assertArrayHasKey('slug', $service);
            $this->assertArrayHasKey('title', $service);
            $this->assertArrayHasKey('summary', $service);
            $this->assertNotSame('', $service['slug']);
            $this->assertNotSame('', $service['title']);
            $this->assertNotSame('', $service['summary']);
        }
    }

    public function test_server_hardware_has_soon_badge(): void
    {
        $hardware = array_first(array_filter(
            config('voltaic.services'),
            fn (array $service): bool => $service['slug'] === 'server-hardware',
        ));

        $this->assertIsArray($hardware);
        $this->assertSame('Soon', $hardware['badge']);
    }

    public function test_security_services_are_listed(): void
    {
        $slugs = collect(config('voltaic.services'))->pluck('slug')->all();

        $this->assertContains('wazuh-xdr', $slugs);
        $this->assertContains('threat-intelligence', $slugs);
        $this->assertContains('anti-bot', $slugs);
        $this->assertContains('voltaic-net', $slugs);
    }

    public function test_panel_services_cover_one_click_games_and_git_deploys(): void
    {
        $slugs = collect(config('voltaic.services'))->pluck('slug')->all();

        $this->assertContains('game-servers', $slugs);
        $this->assertContains('git-websites', $slugs);
        $this->assertContains('custom-software', $slugs);

        $panel = collect(config('voltaic.services'))->firstWhere('slug', 'voltaic-panel');

        $this->assertIsArray($panel);
        $this->assertStringContainsString('One-click', $panel['summary']);
        $this->assertStringContainsString('Git repository', $panel['summary']);
        $this->assertStringContainsString('Git repository', config('voltaic.panel.lede'));
    }

    public function test_nav_items_reference_known_routes(): void
    {
        $knownRoutes = ['home', 'about', 'faq', 'contact', 'branding', 'panel', 'privacy', 'terms'];

        foreach ([...config('voltaic.nav'), ...config('voltaic.footer_nav')] as $item) {
            $this->assertContains($item['route'], $knownRoutes);
            $this->assertNotSame('', $item['label']);
        }
    }

    public function test_branding_assets_exist_on_disk(): void
    {
        foreach (config('voltaic.branding.assets') as $asset) {
            foreach ($asset['formats'] as $path) {
                $this->assertFileExists(public_path(ltrim((string) $path, '/')));
            }
        }
    }

    public function test_contact_email_is_configured(): void
    {
        $this->assertSame('team@voltaic.host', config('voltaic.contact.email'));
    }

    public function test_privacy_policy_states_no_tracking(): void
    {
        $this->assertStringContainsString(
            'telemetry',
            config('voltaic.legal.privacy.intro'),
        );
        $this->assertSame(
            'No ads. No tracking. No telemetry.',
            config('voltaic.privacy_note'),
        );
    }

    public function test_values_cover_exit_pricing_and_privacy(): void
    {
        $titles = collect(config('voltaic.values'))->pluck('title')->all();

        $this->assertContains('Cancel anytime', $titles);
        $this->assertContains('Quoted price is the price', $titles);
        $this->assertContains('Privacy stays with the customer', $titles);

        $bodies = collect(config('voltaic.values'))->pluck('body')->implode(' ');

        $this->assertStringContainsString('migrate', $bodies);
        $this->assertStringContainsString('30-day refund', $bodies);
        $this->assertStringContainsString('telemetry', $bodies);
    }

    public function test_terms_cover_fees_cancellation_and_migration(): void
    {
        $titles = collect(config('voltaic.legal.terms.sections'))->pluck('title')->all();

        $this->assertContains('Fees and refunds', $titles);
        $this->assertContains('Cancellation and migration', $titles);
        $this->assertContains('Acceptable use on Voltaic servers', $titles);

        $fees = collect(config('voltaic.legal.terms.sections'))
            ->firstWhere('title', 'Fees and refunds');

        $this->assertIsArray($fees);
        $this->assertStringContainsString(
            '30-day refund',
            implode(' ', $fees['paragraphs']),
        );
    }

    public function test_about_states_founder_timeline_and_regions(): void
    {
        $body = collect(config('voltaic.about.sections'))
            ->pluck('paragraphs')
            ->flatten()
            ->implode(' ');

        $this->assertStringContainsString('2013', $body);
        $this->assertStringContainsString('2022', $body);
        $this->assertStringContainsString('solo', $body);
        $this->assertStringContainsString('United States', $body);
        $this->assertStringContainsString('Monero', $body);
        $this->assertStringContainsString('30-day refund', $body);
    }

    public function test_about_states_panel_open_source_strategy(): void
    {
        $panel = collect(config('voltaic.about.sections'))
            ->firstWhere('title', 'Panel and daemon');

        $this->assertIsArray($panel);

        $body = implode(' ', $panel['paragraphs']);

        $this->assertStringContainsString('Older major versions', $body);
        $this->assertStringContainsString('open source', $body);
        $this->assertStringContainsString('bug fixes and security updates only', $body);
        $this->assertStringContainsString('newest major versions are closed source', $body);
        $this->assertStringContainsString('daemon', $body);
    }

    public function test_faq_covers_billing_panel_and_privacy(): void
    {
        $groups = collect(config('voltaic.faq.groups'));
        $titles = $groups->pluck('title')->all();

        $this->assertContains('Billing and exit', $titles);
        $this->assertContains('Panel and software', $titles);
        $this->assertContains('Privacy and security', $titles);

        $questions = $groups
            ->pluck('items')
            ->flatten(1)
            ->pluck('question')
            ->implode(' ');

        $this->assertStringContainsString('cancel', strtolower($questions));
        $this->assertStringContainsString('open source', strtolower($questions));
        $this->assertStringContainsString('track', strtolower($questions));

        foreach ($groups as $group) {
            $this->assertNotEmpty($group['items']);

            foreach ($group['items'] as $item) {
                $this->assertNotSame('', $item['question']);
                $this->assertIsArray($item['answer']);
                $this->assertNotEmpty($item['answer']);
            }
        }
    }

    public function test_error_messages_cover_common_http_statuses(): void
    {
        foreach ([401, 403, 404, 419, 429, 500, 503] as $status) {
            $error = config('voltaic.errors.'.$status);

            $this->assertIsArray($error);
            $this->assertNotSame('', $error['title']);
            $this->assertNotSame('', $error['description']);
        }

        $default = config('voltaic.errors.default');

        $this->assertIsArray($default);
        $this->assertNotSame('', $default['title']);
        $this->assertNotSame('', $default['description']);
    }
}
