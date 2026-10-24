import type { BrandingContent } from './types';

export const branding: BrandingContent = {
    intro: 'Logo files for press, partners, and your own docs. Use the dark mark on light backgrounds and the light mark on dark ones. Leave clear space around the mark equal to about a quarter of its height.',
    assets: [
        {
            key: 'logo-dark',
            label: 'Dark mark',
            description: 'Dark ink on transparent. Default for light pages and print.',
            formats: {
                png: '/brand/logo-dark.png',
                jpg: '/brand/logo-dark.jpg',
                webp: '/brand/logo-dark.webp',
            },
            dimensions: '512 × 551',
            preview: 'light',
        },
        {
            key: 'logo-light',
            label: 'Light mark',
            description: 'White mark on transparent. Use on dark or photographic backgrounds.',
            formats: {
                png: '/brand/logo-light.png',
                jpg: '/brand/logo-light.jpg',
                webp: '/brand/logo-light.webp',
            },
            dimensions: '512 × 551',
            preview: 'dark',
        },
        {
            key: 'logo-on-light',
            label: 'On light field',
            description: 'Dark mark on the site stone background. Ready for slides and one-sheets.',
            formats: {
                png: '/brand/logo-on-light.png',
                jpg: '/brand/logo-on-light.jpg',
                webp: '/brand/logo-on-light.webp',
            },
            dimensions: '512 × 512',
            preview: 'light',
        },
        {
            key: 'logo-on-dark',
            label: 'On dark field',
            description: 'White mark on iron. Use when you need a solid square tile.',
            formats: {
                png: '/brand/logo-on-dark.png',
                jpg: '/brand/logo-on-dark.jpg',
                webp: '/brand/logo-on-dark.webp',
            },
            dimensions: '512 × 512',
            preview: 'dark',
        },
        {
            key: 'icon-512',
            label: 'App icon 512',
            description: 'Square padded mark for app stores and high-density icons.',
            formats: {
                png: '/brand/icon-512.png',
                jpg: '/brand/icon-512.jpg',
                webp: '/brand/icon-512.webp',
            },
            dimensions: '512 × 512',
            preview: 'light',
        },
        {
            key: 'icon-192',
            label: 'App icon 192',
            description: 'Square mark at 192px for progressive web app icons.',
            formats: {
                png: '/brand/icon-192.png',
                jpg: '/brand/icon-192.jpg',
                webp: '/brand/icon-192.webp',
            },
            dimensions: '192 × 192',
            preview: 'light',
        },
        {
            key: 'favicon-32',
            label: 'Favicon 32',
            description:
                'Browser tab icon with a transparent background. Same mark as the source logo.',
            formats: {
                png: '/brand/favicon-32.png',
                jpg: '/brand/favicon-32.jpg',
                webp: '/brand/favicon-32.webp',
            },
            dimensions: '32 × 32',
            preview: 'dark',
        },
        {
            key: 'source',
            label: 'Source',
            description: 'Full-resolution white mark on transparent from the design file.',
            formats: {
                png: '/logo.png',
                jpg: '/logo.jpg',
                webp: '/logo.webp',
            },
            dimensions: '512 × 551',
            preview: 'dark',
        },
    ],
};
