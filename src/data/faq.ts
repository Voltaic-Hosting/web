import type { FaqContent } from './types';

export const faq: FaqContent = {
    intro: 'Direct answers about billing, the panel, privacy, hosting rules, and support. If something is missing, email and ask.',
    groups: [
        {
            title: 'Billing and exit',
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
            ],
        },
        {
            title: 'Panel and software',
            items: [
                {
                    question: 'What does Voltaic Panel cover?',
                    answer: [
                        'One-click services and game servers, Git website deploys, bare metal, containers, MicroVMs, firewall, backups, API access, and team accounts.',
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
                    question: 'What about the server daemon?',
                    answer: [
                        'The server daemon is still under development. It is being built as open-source software and will not be locked to the Voltaic panel.',
                        'When it is ready, you should be able to build a custom panel on top of it or control hosts from the CLI.',
                    ],
                },
                {
                    question: 'Can I bring my own servers?',
                    answer: [
                        'Yes. You can bring your own servers and run them with the panel, or migrate off at any time onto hardware you control or to another provider.',
                    ],
                },
            ],
        },
        {
            title: 'Privacy and security',
            items: [
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
                {
                    question: 'What security tooling do you use?',
                    answer: [
                        'Servers are hardened and monitored with Wazuh XDR and threat intelligence so problems show up as alerts you can act on.',
                        'Anti-DDoS, anti-bot, and anti-scraping protections are included at no extra charge. You do not need Cloudflare for those protections.',
                    ],
                },
            ],
        },
        {
            title: 'Hosting and content',
            items: [
                {
                    question: 'What will you not host on Voltaic-owned servers?',
                    answer: [
                        'Illegal sites, gambling, email servers, or pornography. DMCA takedowns apply on those systems.',
                    ],
                },
                {
                    question: 'Do those content rules apply to bring-your-own servers?',
                    answer: [
                        'Bring-your-own servers that you operate yourself are not under those content rules. You stay responsible for what runs on hardware you control.',
                    ],
                },
                {
                    question: 'Where are you based, and where do you look for facilities?',
                    answer: [
                        'Voltaic Hosting is based in the United States. Right now we look for data center partners in the US and EU, with Asia planned for later.',
                    ],
                },
            ],
        },
        {
            title: 'Getting started',
            items: [
                {
                    question: 'How do I get a quote or ask a question?',
                    answer: [
                        'Email team@voltaic.host with your requirements, current setup, and timeline. Attach configuration details if they help.',
                        'We reply within two business days, Monday through Friday.',
                    ],
                },
                {
                    question: 'Who runs Voltaic Hosting?',
                    answer: [
                        'Ivan (Sudo-Ivan) founded Voltaic Hosting. You talk to the people who build and maintain the stack.',
                    ],
                },
            ],
        },
    ],
};
