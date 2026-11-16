/** @type {import('@lhci/cli').Config} */
module.exports = {
    ci: {
        collect: {
            url: [
                'http://127.0.0.1:8799/',
                'http://127.0.0.1:8799/game-servers',
                'http://127.0.0.1:8799/websites',
                'http://127.0.0.1:8799/servers',
                'http://127.0.0.1:8799/business',
                'http://127.0.0.1:8799/about',
                'http://127.0.0.1:8799/faq',
                'http://127.0.0.1:8799/branding',
                'http://127.0.0.1:8799/contact',
                'http://127.0.0.1:8799/privacy',
                'http://127.0.0.1:8799/terms',
            ],
            numberOfRuns: 3,
            startServerCommand: 'pnpm exec astro preview --host 127.0.0.1 --port 8799',
            startServerReadyPattern: 'http://127.0.0.1:8799',
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
