import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    site: 'https://voltaic.host',
    output: 'static',
    trailingSlash: 'never',
    build: {
        format: 'file',
    },
    security: {
        csp: {
            styleDirective: {
                resources: ["'self'", "'unsafe-inline'"],
            },
        },
    },
    integrations: [svelte()],
    vite: {
        plugins: [tailwindcss()],
    },
});
