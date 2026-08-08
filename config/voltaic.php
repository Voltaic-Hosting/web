<?php

return [
    'name' => 'Voltaic Hosting',
    'tagline' => 'Sustainable. Secure. Private.',
    'home_hero_lede' => 'Hosting, colocation, and infrastructure with clear billing, strong privacy, and no lock-in.',
    'domain' => 'https://voltaic.host',

    'contact' => [
        'email' => 'team@voltaic.host',
        'response_time' => 'I reply within two business days, Monday through Friday.',
    ],

    'nav' => [
        ['label' => 'Home', 'route' => 'home'],
        ['label' => 'Panel', 'route' => 'panel'],
        ['label' => 'About', 'route' => 'about'],
        ['label' => 'FAQ', 'route' => 'faq'],
    ],

    'footer_nav' => [
        ['label' => 'FAQ', 'route' => 'faq'],
        ['label' => 'Privacy', 'route' => 'privacy'],
        ['label' => 'Terms', 'route' => 'terms'],
    ],
    'privacy_note' => 'No ads. No tracking. No telemetry.',

    'services' => [
        [
            'slug' => 'voltaic-panel',
            'title' => 'Voltaic Panel',
            'summary' => 'Run bare metal, containers, and MicroVMs from one interface. One-click services, game servers, website deploys from any Git repository, firewall rules, backups, an API, and team accounts.',
        ],
        [
            'slug' => 'game-servers',
            'title' => 'Game Servers',
            'summary' => 'Install a game server from the catalog in one click. Each server has a console, file access, scheduled backups, and player controls.',
        ],
        [
            'slug' => 'git-websites',
            'title' => 'Git Website Deploys',
            'summary' => 'Connect a Git repository and the panel builds and publishes the site. Deploys run on push or when you trigger one.',
        ],
        [
            'slug' => 'custom-software',
            'title' => 'Custom Software',
            'summary' => 'Hosting and infrastructure software written for data centers, hosting providers, and open-source communities.',
        ],
        [
            'slug' => 'server-hardware',
            'title' => 'Server Hardware',
            'summary' => 'Servers specified and built for the workload you describe. You get the power draw and capacity numbers in writing before anything ships.',
            'badge' => 'Soon',
        ],
        [
            'slug' => 'data-centers',
            'title' => 'Data Centers',
            'summary' => 'Colocation planning, rack installs, and coordination with the facility for equipment that lives outside your office.',
        ],
        [
            'slug' => 'microvms',
            'title' => 'MicroVMs',
            'summary' => 'Virtual machines that each run their own kernel. Workloads stay isolated without a full hypervisor stack to maintain.',
        ],
        [
            'slug' => 'reticulum',
            'title' => 'Reticulum Networks',
            'summary' => 'Encrypted mesh networking built on Reticulum. Gives a site a second path when the primary link goes down.',
        ],
        [
            'slug' => 'firewall',
            'title' => 'Firewall Configuration',
            'summary' => 'OPNsense and pfSense installs, hardening, and ongoing rule maintenance for offices and colo racks.',
        ],
        [
            'slug' => 'wazuh-xdr',
            'title' => 'Wazuh XDR',
            'summary' => 'Wazuh deployed across your endpoints and servers. Log collection, alert tuning, and response steps for the hosts you actually run.',
        ],
        [
            'slug' => 'threat-intelligence',
            'title' => 'Threat Intelligence',
            'summary' => 'Indicator feeds loaded into your firewalls and detection rules so known bad traffic is dropped at the edge.',
        ],
        [
            'slug' => 'anti-bot',
            'title' => 'Anti-Bot / Anti-Scraping',
            'summary' => 'Protection for public sites and APIs against scrapers, credential stuffing, and automated abuse.',
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
                    'Older major versions of the panel are open source. Those releases stay available and receive bug fixes and security updates only. The newest major versions are closed source so panel development can fund itself and keep shipping. The panel covers one-click services, game servers, Git website deploys, bare metal, containers, MicroVMs, firewall, backups, API access, and team accounts.',
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

    'faq' => [
        'intro' => 'Direct answers about billing, the panel, privacy, hosting rules, and support. If something is missing, email and ask.',
        'groups' => [
            [
                'title' => 'Billing and exit',
                'items' => [
                    [
                        'question' => 'Can I cancel anytime?',
                        'answer' => [
                            'Yes. Monthly service stops when you cancel. There is no exit fee.',
                            'If you want the same workloads on hardware you own, I help you migrate off onto your servers. Your data is not stuck in a format only Voltaic can read.',
                        ],
                    ],
                    [
                        'question' => 'Will extra fees show up after I approve a quote?',
                        'answer' => [
                            'You pay the line items on the order you approved. Fees that are not on the quote do not appear later.',
                        ],
                    ],
                    [
                        'question' => 'Is there a refund window?',
                        'answer' => [
                            'New service has a 30-day refund window if it does not fit. Try the service, and if it is the wrong fit you can get out cleanly inside that window.',
                        ],
                    ],
                    [
                        'question' => 'What payments do you accept?',
                        'answer' => [
                            'USD, EUR, and Monero. Fiat payments go through Stripe, so the card and bank options Stripe supports in your region are available there.',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Panel and software',
                'items' => [
                    [
                        'question' => 'What does Voltaic Panel cover?',
                        'answer' => [
                            'One-click services and game servers, Git website deploys, bare metal, containers, MicroVMs, firewall, backups, API access, and team accounts.',
                        ],
                    ],
                    [
                        'question' => 'Is the panel open source?',
                        'answer' => [
                            'Older major versions of the panel are open source. Those releases stay available and receive bug fixes and security updates only.',
                            'The newest major versions are closed source so panel development can fund itself and keep shipping.',
                        ],
                    ],
                    [
                        'question' => 'What about the server daemon?',
                        'answer' => [
                            'The server daemon is still under development. It is being built as open-source software and will not be locked to the Voltaic panel.',
                            'When it is ready, you should be able to build a custom panel on top of it or control hosts from the CLI.',
                        ],
                    ],
                    [
                        'question' => 'Can I bring my own servers?',
                        'answer' => [
                            'Yes. You can bring your own servers and run them with the panel, or migrate off at any time onto hardware you control or to another provider.',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Privacy and security',
                'items' => [
                    [
                        'question' => 'Do you track visitors on this site?',
                        'answer' => [
                            'No. The public site has no ads, tracking pixels, or product telemetry.',
                        ],
                    ],
                    [
                        'question' => 'How is support handled?',
                        'answer' => [
                            'Support is a real person, not an AI chatbot. When something breaks, you get a human who knows the systems.',
                        ],
                    ],
                    [
                        'question' => 'What security tooling do you use?',
                        'answer' => [
                            'Servers are hardened and monitored with Wazuh XDR and threat intelligence so problems show up as alerts you can act on.',
                            'Anti-DDoS, anti-bot, and anti-scraping protections are included at no extra charge. You do not need Cloudflare for those protections.',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Hosting and content',
                'items' => [
                    [
                        'question' => 'What will you not host on Voltaic-owned servers?',
                        'answer' => [
                            'Illegal sites, gambling, email servers, or pornography. DMCA takedowns apply on those systems.',
                        ],
                    ],
                    [
                        'question' => 'Do those content rules apply to bring-your-own servers?',
                        'answer' => [
                            'Bring-your-own servers that you operate yourself are not under those content rules. You stay responsible for what runs on hardware you control.',
                        ],
                    ],
                    [
                        'question' => 'Where are you based, and where do you look for facilities?',
                        'answer' => [
                            'Voltaic Hosting is based in the United States. Right now I look for data center partners in the US and EU, with Asia planned for later.',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Getting started',
                'items' => [
                    [
                        'question' => 'How do I get a quote or ask a question?',
                        'answer' => [
                            'Email team@voltaic.host with your requirements, current setup, and timeline. Attach configuration details if they help.',
                            'I reply within two business days, Monday through Friday.',
                        ],
                    ],
                    [
                        'question' => 'Who runs Voltaic Hosting?',
                        'answer' => [
                            'Ivan (Sudo-Ivan). The company runs solo, so you talk to the person who builds and maintains the stack.',
                        ],
                    ],
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
                'formats' => [
                    'png' => '/brand/logo-dark.png',
                    'jpg' => '/brand/logo-dark.jpg',
                    'webp' => '/brand/logo-dark.webp',
                ],
                'dimensions' => '512 × 551',
                'preview' => 'light',
            ],
            [
                'key' => 'logo-light',
                'label' => 'Light mark',
                'description' => 'White mark on transparent. Use on dark or photographic backgrounds.',
                'formats' => [
                    'png' => '/brand/logo-light.png',
                    'jpg' => '/brand/logo-light.jpg',
                    'webp' => '/brand/logo-light.webp',
                ],
                'dimensions' => '512 × 551',
                'preview' => 'dark',
            ],
            [
                'key' => 'logo-on-light',
                'label' => 'On light field',
                'description' => 'Dark mark on the site stone background. Ready for slides and one-sheets.',
                'formats' => [
                    'png' => '/brand/logo-on-light.png',
                    'jpg' => '/brand/logo-on-light.jpg',
                    'webp' => '/brand/logo-on-light.webp',
                ],
                'dimensions' => '512 × 512',
                'preview' => 'light',
            ],
            [
                'key' => 'logo-on-dark',
                'label' => 'On dark field',
                'description' => 'White mark on iron. Use when you need a solid square tile.',
                'formats' => [
                    'png' => '/brand/logo-on-dark.png',
                    'jpg' => '/brand/logo-on-dark.jpg',
                    'webp' => '/brand/logo-on-dark.webp',
                ],
                'dimensions' => '512 × 512',
                'preview' => 'dark',
            ],
            [
                'key' => 'icon-512',
                'label' => 'App icon 512',
                'description' => 'Square padded mark for app stores and high-density icons.',
                'formats' => [
                    'png' => '/brand/icon-512.png',
                    'jpg' => '/brand/icon-512.jpg',
                    'webp' => '/brand/icon-512.webp',
                ],
                'dimensions' => '512 × 512',
                'preview' => 'light',
            ],
            [
                'key' => 'icon-192',
                'label' => 'App icon 192',
                'description' => 'Square mark at 192px for progressive web app icons.',
                'formats' => [
                    'png' => '/brand/icon-192.png',
                    'jpg' => '/brand/icon-192.jpg',
                    'webp' => '/brand/icon-192.webp',
                ],
                'dimensions' => '192 × 192',
                'preview' => 'light',
            ],
            [
                'key' => 'favicon-32',
                'label' => 'Favicon 32',
                'description' => 'Browser tab icon with a transparent background. Same mark as the source logo.',
                'formats' => [
                    'png' => '/brand/favicon-32.png',
                    'jpg' => '/brand/favicon-32.jpg',
                    'webp' => '/brand/favicon-32.webp',
                ],
                'dimensions' => '32 × 32',
                'preview' => 'dark',
            ],
            [
                'key' => 'source',
                'label' => 'Source',
                'description' => 'Full-resolution white mark on transparent from the design file.',
                'formats' => [
                    'png' => '/logo.png',
                    'jpg' => '/logo.jpg',
                    'webp' => '/logo.webp',
                ],
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
        'og_image' => '/brand/logo-on-light.png',
        'twitter_card' => 'summary_large_image',
        'locale' => 'en_US',
        'organization' => [
            'type' => 'Organization',
            'name' => 'Voltaic Hosting',
            'url' => 'https://voltaic.host',
            'email' => 'team@voltaic.host',
            'logo' => 'https://voltaic.host/brand/logo-on-light.png',
            'same_as' => [],
        ],
    ],

    'sitemap' => [
        'home',
        'about',
        'faq',
        'contact',
        'branding',
        'privacy',
        'terms',
    ],

    'errors' => [
        'default' => [
            'title' => 'Something went wrong',
            'description' => 'An unexpected error occurred. Try again, or email if it keeps happening.',
        ],
        401 => [
            'title' => 'Sign in required',
            'description' => 'This page needs an authenticated session. Return home or contact support if you reached this by mistake.',
        ],
        403 => [
            'title' => 'Access denied',
            'description' => 'You do not have permission to view this page.',
        ],
        404 => [
            'title' => 'Page not found',
            'description' => 'That URL is not on this site. Check the address, or use the links below.',
        ],
        419 => [
            'title' => 'Session expired',
            'description' => 'Your session timed out for security. Refresh the page and try again.',
        ],
        429 => [
            'title' => 'Too many requests',
            'description' => 'You hit a rate limit. Wait a moment, then try again.',
        ],
        500 => [
            'title' => 'Server error',
            'description' => 'Something failed while loading this page. Try again in a few minutes.',
        ],
        503 => [
            'title' => 'Service unavailable',
            'description' => 'The site is temporarily unavailable for maintenance or capacity. Try again shortly.',
        ],
    ],
];
