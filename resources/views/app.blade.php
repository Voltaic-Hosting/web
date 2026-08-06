<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#e7e1d8">
        <meta name="color-scheme" content="light dark">
        <script>
            (function () {
                var storageKey = 'voltaic-theme';
                var stored = null;

                try {
                    stored = localStorage.getItem(storageKey);
                } catch (e) {}

                var prefersDark =
                    window.matchMedia &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
                var theme = stored === 'light' || stored === 'dark' ? stored : prefersDark ? 'dark' : 'light';

                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme;

                var themeColor = document.querySelector('meta[name="theme-color"]');
                if (themeColor) {
                    themeColor.setAttribute('content', theme === 'dark' ? '#151311' : '#e7e1d8');
                }
            })();
        </script>
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32">
        <link rel="apple-touch-icon" href="/brand/icon-192.png">
        <link rel="manifest" href="/site.webmanifest">
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="antialiased">
        @inertia
    </body>
</html>
