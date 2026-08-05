<?php

namespace App\Support;

final class Voltaic
{
    private function __construct() {}

    /**
     * @return array<string, mixed>
     */
    #[\NoDiscard]
    public static function siteProps(): array
    {
        return [
            'name' => config('voltaic.name'),
            'tagline' => config('voltaic.tagline'),
            'domain' => config('voltaic.domain'),
            'contact' => config('voltaic.contact'),
            'nav' => config('voltaic.nav'),
            'footerNav' => config('voltaic.footer_nav'),
            'privacyNote' => config('voltaic.privacy_note'),
            'seo' => config('voltaic.seo'),
        ];
    }

    /**
     * @return array{title: string, description: string}
     */
    #[\NoDiscard]
    public static function errorFor(int $status): array
    {
        $errors = config('voltaic.errors');

        return $errors[$status] ?? $errors['default'];
    }
}
