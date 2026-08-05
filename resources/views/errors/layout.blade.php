<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <meta name="theme-color" content="#e7e1d8">
    <title>{{ $title }} · {{ $siteName }}</title>
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32">
    <style>
        :root {
            color-scheme: light;
            --void: #e7e1d8;
            --surface: #f0ebe3;
            --line: #c9bfb0;
            --frost: #4a433c;
            --snow: #1c1916;
            --accent: #b45309;
            --accent-soft: #9a4208;
            --accent-muted: #8a7460;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100dvh;
            font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: var(--snow);
            background:
                radial-gradient(900px 420px at 100% -8%, color-mix(in srgb, var(--accent) 9%, transparent), transparent 55%),
                linear-gradient(180deg, #efe9e0 0%, var(--void) 45%, #ddd6cb 100%);
        }

        .shell {
            display: grid;
            grid-template-rows: auto 1fr auto;
            min-height: 100dvh;
        }

        .header,
        .footer,
        .main {
            width: min(760px, calc(100% - 2rem));
            margin-inline: auto;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-block: 1.25rem;
            border-bottom: 1px solid color-mix(in srgb, var(--line) 65%, transparent);
        }

        .brand {
            color: var(--snow);
            font-weight: 700;
            letter-spacing: -0.02em;
            text-decoration: none;
        }

        .main {
            padding-block: clamp(3rem, 8vw, 5.5rem) clamp(3rem, 7vw, 5rem);
        }

        .code {
            margin: 0 0 0.35rem;
            color: color-mix(in srgb, var(--accent) 55%, var(--line));
            font-family: ui-monospace, "Cascadia Code", "SFMono-Regular", Menlo, Consolas, monospace;
            font-size: clamp(4.5rem, 16vw, 8.5rem);
            font-weight: 650;
            letter-spacing: -0.06em;
            line-height: 0.9;
        }

        .eyebrow {
            margin: 0 0 0.75rem;
            color: var(--accent-muted);
            font-family: ui-monospace, "Cascadia Code", "SFMono-Regular", Menlo, Consolas, monospace;
            font-size: 0.78rem;
            letter-spacing: 0.06em;
            text-transform: uppercase;
        }

        h1 {
            margin: 0;
            max-width: 16ch;
            font-size: clamp(2rem, 5vw, 3.25rem);
            font-weight: 650;
            line-height: 1.05;
            letter-spacing: -0.03em;
        }

        .lede {
            margin: 1.15rem 0 0;
            max-width: 36rem;
            color: var(--frost);
            font-size: clamp(1.05rem, 2vw, 1.2rem);
            line-height: 1.65;
        }

        .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-top: 1.75rem;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 2.75rem;
            padding: 0.7rem 1.15rem;
            border-radius: 0.35rem;
            border: 1px solid transparent;
            font: inherit;
            font-weight: 600;
            text-decoration: none;
        }

        .btn-solid {
            background: var(--accent);
            color: #f7f2ea;
        }

        .btn-ghost {
            border-color: var(--line);
            background: var(--surface);
            color: var(--snow);
        }

        .nav {
            margin-top: 2.75rem;
            padding-top: 1.5rem;
            border-top: 1px solid color-mix(in srgb, var(--line) 65%, transparent);
        }

        .nav-label {
            margin: 0 0 0.75rem;
            color: var(--accent-muted);
            font-family: ui-monospace, "Cascadia Code", "SFMono-Regular", Menlo, Consolas, monospace;
            font-size: 0.72rem;
            letter-spacing: 0.06em;
            text-transform: uppercase;
        }

        .nav-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.55rem 1.15rem;
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .nav-list a {
            color: var(--frost);
            font-weight: 550;
            text-decoration: none;
            border-bottom: 1px solid transparent;
        }

        .nav-list a:hover,
        .nav-list a:focus-visible {
            color: var(--accent-soft);
            border-bottom-color: color-mix(in srgb, var(--accent) 45%, transparent);
            outline: none;
        }

        .footer {
            padding-block: 1.5rem 2rem;
            border-top: 1px solid color-mix(in srgb, var(--line) 65%, transparent);
            color: var(--frost);
            font-size: 0.875rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="shell">
        <header class="header">
            <a class="brand" href="/">{{ $siteName }}</a>
            <a class="btn btn-ghost" href="/contact">Contact</a>
        </header>

        <main class="main">
            <p class="code" aria-hidden="true">{{ $status }}</p>
            <p class="eyebrow">Error {{ $status }}</p>
            <h1>{{ $title }}</h1>
            <p class="lede">{{ $description }}</p>

            <div class="actions">
                <a class="btn btn-solid" href="/">Back to home</a>
                @if ($status === 419)
                    <a class="btn btn-ghost" href="{{ url()->previous() !== url()->current() ? url()->previous() : '/' }}">Try again</a>
                @else
                    <a class="btn btn-ghost" href="/contact">Contact {{ $siteName }}</a>
                @endif
            </div>

            <nav class="nav" aria-label="Helpful links">
                <p class="nav-label">Helpful pages</p>
                <ul class="nav-list">
                    <li><a href="/">Home</a></li>
                    <li><a href="/faq">FAQ</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/panel">Panel</a></li>
                </ul>
            </nav>
        </main>

        <footer class="footer">
            {{ $privacyNote }}
        </footer>
    </div>
</body>
</html>
