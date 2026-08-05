<?php

return [
    'name' => 'Voltaic Hosting',
    'tagline' => 'Sustainable. Secure. Private.',
    'domain' => 'https://voltaic.host',

    'contact' => [
        'email' => 'team@voltaic.host',
        'response_time' => 'I reply within two business days, Monday through Friday.',
    ],

    'nav' => [
        ['label' => 'Home', 'route' => 'home'],
        ['label' => 'Panel', 'route' => 'panel'],
        ['label' => 'About', 'route' => 'about'],
        ['label' => 'Contact', 'route' => 'contact'],
    ],

    'footer_nav' => [
        ['label' => 'Privacy', 'route' => 'privacy'],
        ['label' => 'Terms', 'route' => 'terms'],
    ],

    'privacy_note' => 'No ads. No tracking. No telemetry.',

    'services' => [
        [
            'slug' => 'voltaic-panel',
            'title' => 'Voltaic Panel',
            'summary' => 'One-click services and game servers. Deploy websites from any Git repository. Bare metal, containers, MicroVMs, firewall, backups, API, and team access.',
        ],
        [
            'slug' => 'game-servers',
            'title' => 'Game Servers',
            'summary' => 'Install a game server from the catalog in one click. Console, files, backups, and player controls sit next to the rest of your fleet.',
        ],
        [
            'slug' => 'git-websites',
            'title' => 'Git Website Deploys',
            'summary' => 'Point the panel at any Git repository. It builds and publishes the site on push or when you trigger a redeploy.',
        ],
        [
            'slug' => 'custom-software',
            'title' => 'Custom Software',
            'summary' => 'For data centers, hosting providers, or community (open-source).',
        ],
        [
            'slug' => 'server-hardware',
            'title' => 'Server Hardware',
            'summary' => 'Servers specified and built for the workload. Power draw and capacity are documented before anything ships.',
            'badge' => 'Soon',
        ],
        [
            'slug' => 'data-centers',
            'title' => 'Data Centers',
            'summary' => 'Colocation planning, rack install, and facility coordination when equipment needs to live outside your office.',
        ],
        [
            'slug' => 'microvms',
            'title' => 'MicroVMs',
            'summary' => 'Isolated virtual machines with their own kernel. Useful when you want hard boundaries without standing up a full hypervisor stack.',
        ],
        [
            'slug' => 'reticulum',
            'title' => 'Reticulum Networks',
            'summary' => 'Encrypted mesh networking for sites that need a backup path when the primary link drops.',
        ],
        [
            'slug' => 'firewall',
            'title' => 'Firewall Configuration',
            'summary' => 'OPNsense and pfSense install, hardening, and rule maintenance for offices and colo racks.',
        ],
        [
            'slug' => 'wazuh-xdr',
            'title' => 'Wazuh XDR',
            'summary' => 'Detection and response with Wazuh across endpoints and servers. Logs, alerts, and playbooks tied to the hosts you run.',
        ],
        [
            'slug' => 'threat-intelligence',
            'title' => 'Threat Intelligence',
            'summary' => 'Indicators applied to firewalls and detection so known bad traffic is blocked before it becomes a support ticket.',
        ],
        [
            'slug' => 'anti-bot',
            'title' => 'Anti-Bot / Anti-Scraping',
            'summary' => 'Protections for public sites and APIs against scrapers, credential stuffing, and automated abuse.',
        ],
    ],

    'values' => [
        [
            'title' => 'Cancel anytime',
            'body' => 'Monthly service stops when you cancel. There is no exit fee and no proprietary format that traps your data in the panel. If you want the same workloads on hardware you own, I help you migrate off onto your servers.',
        ],
        [
            'title' => 'Quoted price is the price',
            'body' => 'You pay the line items on the order you approved. Fees that are not on the quote do not appear later. New service has a 30-day refund window if it does not fit.',
        ],
        [
            'title' => 'Privacy stays with the customer',
            'body' => 'I do not sell or profile customer data. The public site has no ads, tracking pixels, or product telemetry. Real human support, no AI.',
        ],
    ],

    'about' => [
        'intro' => 'Voltaic Hosting was created by Ivan (Sudo-Ivan). I build hosting software and work with infrastructure partners so you can run servers, leave when you want, and keep control of your stack.',
        'sections' => [
            [
                'title' => 'How it started',
                'paragraphs' => [
                    'I have wanted to host servers for other people since 2013, when I was a kid trying to run Minecraft servers. Even then the job was the same: keep the machine online, make sure backups actually restore, and give the people using the server a real person to talk to when something breaks instead of a support queue that never answers.',
                    'That early work turned into years of learning systems and software development. Networking, firewalls, virtualization, and the quiet routines that keep machines healthy became the foundation. Voltaic Hosting became a real project in 2022. I still run it solo, which means you talk to the person who builds and maintains the stack.',
                    'I write hosting software for paying customers and for open-source community projects. The same tools should work for a hosting provider, a data center operator, or a community running gear on a budget. If the software only works when you stay locked into one vendor, it is not good enough.',
                ],
            ],
            [
                'title' => 'Infrastructure partners',
                'paragraphs' => [
                    'Voltaic Hosting is based in the United States. Right now I look for data center partners in the US and EU, with Asia planned for later. I care about facilities that treat power, physical access, and customer data with the same seriousness as rack space. Sustainable, secure, and private servers are the bar, not a marketing line.',
                    'There is no vendor lock-in. You can migrate off at any time onto your own hardware or to another provider. You can also bring your own servers and run them with the panel. If you leave, I help you move, and your workloads are not stuck in a format only I can read. Staying should be a choice, not a trap.',
                ],
            ],
            [
                'title' => 'Panel and daemon',
                'paragraphs' => [
                    'The panel is closed-source so the product can fund itself and keep shipping. That is how a solo shop pays for development time and support without pretending open source alone covers the bills. The panel is built to cover one-click services, game servers, Git website deploys, bare metal, containers, MicroVMs, firewall, backups, API access, and team accounts.',
                    'The server daemon is still under development. It is being built as open-source software and will not be locked to the Voltaic panel. When it is ready, you should be able to build a custom panel on top of it or control hosts from the CLI. The panel is one interface. The daemon is the work underneath, and that work should stay portable.',
                ],
            ],
            [
                'title' => 'Payments',
                'paragraphs' => [
                    'I accept USD, EUR, and Monero. Fiat payments go through Stripe, so the card and bank options Stripe supports in your region are available there. New service has a 30-day refund window if it does not fit. Try the service, and if it is the wrong fit you can get out cleanly inside that window.',
                ],
            ],
            [
                'title' => 'Privacy and security',
                'paragraphs' => [
                    'I collect only the customer data the law requires. The public site has no ads, no tracking pixels, and no product telemetry. Servers are hardened and monitored with Wazuh XDR and threat intelligence so problems show up as alerts you can act on, not as quiet failures.',
                    'Support is me, a real person, not an AI chatbot. When something breaks, you get a human who knows the systems, not a script that restates the docs.',
                ],
            ],
            [
                'title' => 'Network protection',
                'paragraphs' => [
                    'Anti-DDoS, anti-bot, and anti-scraping protections are included at no extra charge. You do not need Cloudflare for those protections. Public sites and APIs should stay usable without handing traffic to a third-party CDN just to get basic abuse controls.',
                ],
            ],
            [
                'title' => 'What I will not host',
                'paragraphs' => [
                    'On Voltaic-owned servers I will not host illegal sites, gambling, email servers, or pornography. DMCA takedowns apply on those systems. That keeps the shared infrastructure usable for customers who follow the rules.',
                    'Bring-your-own servers that you operate yourself are not under those content rules. You stay responsible for what runs on hardware you control, and I stay out of policing gear that is not mine.',
                ],
            ],
        ],
    ],

    'branding' => [
        'intro' => 'Logo files for press, partners, and your own docs. Use the dark mark on light backgrounds and the light mark on dark ones. Leave clear space around the mark equal to about a quarter of its height.',
        'assets' => [
            [
                'key' => 'logo-dark',
                'label' => 'Dark mark',
                'description' => 'Dark ink on transparent. Default for light pages and print.',
                'path' => '/branding/logo-dark.png',
                'format' => 'PNG',
                'dimensions' => '512 × 551',
                'preview' => 'light',
            ],
            [
                'key' => 'logo-light',
                'label' => 'Light mark',
                'description' => 'White mark on transparent. Use on dark or photographic backgrounds.',
                'path' => '/branding/logo-light.png',
                'format' => 'PNG',
                'dimensions' => '512 × 551',
                'preview' => 'dark',
            ],
            [
                'key' => 'logo-on-light',
                'label' => 'On light field',
                'description' => 'Dark mark on the site stone background. Ready for slides and one-sheets.',
                'path' => '/branding/logo-on-light.png',
                'format' => 'PNG',
                'dimensions' => '512 × 512',
                'preview' => 'light',
            ],
            [
                'key' => 'logo-on-dark',
                'label' => 'On dark field',
                'description' => 'White mark on iron. Use when you need a solid square tile.',
                'path' => '/branding/logo-on-dark.png',
                'format' => 'PNG',
                'dimensions' => '512 × 512',
                'preview' => 'dark',
            ],
            [
                'key' => 'icon-512',
                'label' => 'App icon 512',
                'description' => 'Square padded mark for app stores and high-density icons.',
                'path' => '/branding/icon-512.png',
                'format' => 'PNG',
                'dimensions' => '512 × 512',
                'preview' => 'light',
            ],
            [
                'key' => 'icon-192',
                'label' => 'App icon 192',
                'description' => 'Square mark at 192px for progressive web app icons.',
                'path' => '/branding/icon-192.png',
                'format' => 'PNG',
                'dimensions' => '192 × 192',
                'preview' => 'light',
            ],
            [
                'key' => 'favicon-32',
                'label' => 'Favicon 32',
                'description' => 'Browser tab icon. Same art as the site favicon.',
                'path' => '/branding/favicon-32.png',
                'format' => 'PNG',
                'dimensions' => '32 × 32',
                'preview' => 'light',
            ],
            [
                'key' => 'source',
                'label' => 'Source PNG',
                'description' => 'Full-resolution white mark on transparent from the design file.',
                'path' => '/logo.png',
                'format' => 'PNG',
                'dimensions' => '512 × 551',
                'preview' => 'dark',
            ],
        ],
    ],

    'seo' => [
        'default_title' => 'Voltaic Hosting',
        'title_separator' => ' · ',
        'default_description' => 'Hosting, colocation, and infrastructure from Voltaic Hosting. One-click services and game servers. Deploy websites from any Git repository.',
        'keywords' => 'voltaic hosting, hosting, colocation, game servers, git deploy, one-click services, server hardware, MicroVMs, Wazuh, firewall, privacy',
        'og_image' => '/branding/logo-on-light.png',
        'twitter_card' => 'summary_large_image',
        'locale' => 'en_US',
        'organization' => [
            'type' => 'Organization',
            'name' => 'Voltaic Hosting',
            'url' => 'https://voltaic.host',
            'email' => 'team@voltaic.host',
            'logo' => 'https://voltaic.host/branding/logo-on-light.png',
            'same_as' => [],
        ],
    ],

    'sitemap' => [
        'home',
        'about',
        'contact',
        'branding',
        'privacy',
        'terms',
    ],
];
