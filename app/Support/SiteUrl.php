<?php

namespace App\Support;

use Uri\Rfc3986\Uri;

final class SiteUrl
{
    private function __construct() {}

    #[\NoDiscard]
    public static function resolve(string $base, string $path): string
    {
        return $base
            |> Uri::parse(...)
            |> (fn (Uri $uri): Uri => $uri->resolve($path))
            |> (fn (Uri $uri): string => $uri->toString());
    }

    #[\NoDiscard]
    public static function requestPath(string $requestUri): string
    {
        return $requestUri
            |> Uri::parse(...)
            |> (fn (Uri $uri): string => urldecode($uri->getPath()));
    }
}
