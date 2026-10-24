/** @type {import('@lhci/cli').Config} */
module.exports = {
    ci: {
        collect: {
            url: [
                'http://127.0.0.1:8765/',
                'http://127.0.0.1:8765/about',
                'http://127.0.0.1:8765/faq',
                'http://127.0.0.1:8765/branding',
                'http://127.0.0.1:8765/contact',
                'http://127.0.0.1:8765/privacy',
                'http://127.0.0.1:8765/terms',
            ],
            numberOfRuns: 3,
            startServerCommand: 'pnpm exec astro preview --host 127.0.0.1 --port 8765',
            startServerReadyPattern: 'http://127.0.0.1:8765',
            settings: {
                preset: 'desktop',
                chromeFlags: '--headless=new --no-sandbox --disable-dev-shm-usage --disable-gpu',
            },
        },
        assert: {
            assertions: {
                'categories:performance': ['error', { minScore: 1, aggregationMethod: 'median' }],
                'categories:accessibility': ['error', { minScore: 1, aggregationMethod: 'median' }],
                'categories:best-practices': [
                    'error',
                    { minScore: 1, aggregationMethod: 'median' },
                ],
                'categories:seo': ['error', { minScore: 1, aggregationMethod: 'median' }],
            },
        },
        upload: {
            target: 'filesystem',
            outputDir: '.lighthouseci',
        },
    },
};
