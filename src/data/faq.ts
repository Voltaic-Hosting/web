import type { FaqContent } from './types';

export const faq: FaqContent = {
    intro: 'Straight answers about ordering, game servers, websites, billing, and privacy. If something is missing, email and ask.',
    groups: [
        {
            title: 'Getting started',
            items: [
                {
                    question: 'How do I order a server or a site?',
                    answer: [
                        'Email team@voltaic.host with what you want: the game or site type, how many players or how much traffic you expect, and any mods or requirements you have.',
                        'We reply within two business days, Monday through Friday, with a setup plan and a monthly price. Once you approve, we build it.',
                    ],
                },
                {
                    question: 'Do I need technical skills?',
                    answer: [
                        'No. Tell us what you want in plain language. A human will handle the install, configuration, DNS, and SSL. You get a dashboard for the day-to-day things like restarts, backups, and player lists.',
                    ],
                },
                {
                    question: 'How long does setup take?',
                    answer: [
                        'Most game servers and websites are ready within a couple of business days after you approve the plan. Bigger builds or custom software take longer and we tell you up front.',
                    ],
                },
                {
                    question: 'Where are the servers located?',
                    answer: [
                        'Voltaic Hosting is based in the United States. We work with data center partners in the US and EU, with Asia planned for later.',
                        'When you ask for a quote, tell us where your players or visitors are and we will pick a sensible region.',
                    ],
                },
            ],
        },
        {
            title: 'Game servers',
            items: [
                {
                    question: 'Which games do you support?',
                    answer: [
                        'The popular ones: Minecraft, Valheim, Rust, Palworld, Project Zomboid, Arma Reforger, CS2, 7 Days to Die, and more. If you want another game, ask. We add titles based on demand and will tell you honestly if one is not feasible.',
                    ],
                },
                {
                    question: 'Can I use mods and plugins?',
                    answer: [
                        'Yes. You get file access to the server, so you can add plugins and modpacks yourself, or ask us to set them up. Backups run on a schedule so a bad mod update is recoverable.',
                    ],
                },
                {
                    question: 'How many players can join?',
                    answer: [
                        'It depends on the game and the plan. Tell us your player count when you ask for a quote and we will size the server for it.',
                    ],
                },
                {
                    question: 'What happens to my game data if something breaks?',
                    answer: [
                        'Scheduled backups cover game files and configs. You can restore a backup in one click from the panel, or ask us to do it for you.',
                    ],
                },
            ],
        },
        {
            title: 'Websites',
            items: [
                {
                    question: 'What kind of sites can you host?',
                    answer: [
                        'Static sites, apps built from a Git repository, small databases, and services the panel can run. If you are not sure your project fits, describe it and we will tell you.',
                    ],
                },
                {
                    question: 'Do I need to manage DNS and SSL?',
                    answer: [
                        "No. Point your domain at us and we handle the DNS guidance, free SSL via Let's Encrypt, and renewals. If you need a paid certificate for a wildcard or EV cert, bring your own and we will install it.",
                    ],
                },
                {
                    question: 'Can I deploy without knowing Git?',
                    answer: [
                        'Deploys run on push to a connected repository. If you do not use Git, we can upload files directly or walk you through connecting a repo. Email us and we will set up what fits.',
                    ],
                },
            ],
        },
        {
            title: 'Your own server',
            items: [
                {
                    question: 'What is Voltaic Panel?',
                    answer: [
                        'It is the dashboard behind every Voltaic service. It manages game servers, websites, databases, bots, and services with console access, file management, firewall rules, backups, an API, and team accounts.',
                    ],
                },
                {
                    question: 'Is the panel open source?',
                    answer: [
                        'Older major versions of the panel are open source. Those releases stay available and receive bug fixes and security updates only.',
                        'The newest major versions are closed source so panel development can fund itself and keep shipping.',
                    ],
                },
                {
                    question: 'Can I bring my own hardware?',
                    answer: [
                        'Yes. You run the server agent on your own machine, a rack, or a VPS, and we host the panel that manages it. You can also migrate off Voltaic hosting at any time onto hardware you control.',
                    ],
                },
                {
                    question: 'What is Moonbase?',
                    answer: [
                        'A custom QUIC-based overlay network. It lets you reach your own services and game servers from your devices without exposing them to the public internet.',
                    ],
                },
            ],
        },
        {
            title: 'Billing and privacy',
            items: [
                {
                    question: 'Can I cancel anytime?',
                    answer: [
                        'Yes. Monthly service stops when you cancel. There is no exit fee.',
                        'If you want the same workloads on hardware you own, we help you migrate off onto your servers. Your data is not stuck in a format only Voltaic can read.',
                    ],
                },
                {
                    question: 'Will extra fees show up after I approve a quote?',
                    answer: [
                        'You pay the line items on the order you approved. Fees that are not on the quote do not appear later.',
                    ],
                },
                {
                    question: 'Is there a refund window?',
                    answer: [
                        'New service has a 30-day refund window if it does not fit. Try the service, and if it is the wrong fit you can get out cleanly inside that window.',
                    ],
                },
                {
                    question: 'What payments do you accept?',
                    answer: [
                        'USD, EUR, and Monero. Fiat payments go through Stripe, so the card and bank options Stripe supports in your region are available there.',
                    ],
                },
                {
                    question: 'Do you track visitors on this site?',
                    answer: [
                        'No. The public site has no ads, tracking pixels, or product telemetry.',
                    ],
                },
                {
                    question: 'How is support handled?',
                    answer: [
                        'Support is a real person, not an AI chatbot. When something breaks, you get a human who knows the systems.',
                    ],
                },
            ],
        },
    ],
};
