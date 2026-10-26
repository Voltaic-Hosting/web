import type { AboutContent } from './types';

export const about: AboutContent = {
    intro: 'Voltaic Hosting was created by Ivan (Sudo-Ivan). Voltaic Hosting develops server and data center software, secures servers for hosting providers, and builds local server AI for sysadmin tasks and security. I build hosting software and work with infrastructure partners so you can run servers, leave when you want, and keep control of your stack.',
    sections: [
        {
            title: 'How it started',
            paragraphs: [
                'I have wanted to host servers for other people since 2013, when I was a kid trying to run Minecraft servers. Even then the job was the same: keep the machine online, make sure backups actually restore, and give the people using the server a real person to talk to when something breaks instead of a support queue that never answers.',
                'That early work turned into years of learning systems and software development. Networking, firewalls, virtualization, and the quiet routines that keep machines healthy became the foundation. Voltaic Hosting became a real project in 2022. I still run it solo, which means you talk to the person who builds and maintains the stack.',
                'I write hosting software for paying customers and for open-source community projects. The same tools should work for a hosting provider, a data center operator, or a community running gear on a budget. If the software only works when you stay locked into one vendor, it is not good enough.',
            ],
        },
        {
            title: 'Infrastructure partners',
            paragraphs: [
                'Voltaic Hosting is based in the United States. Right now I look for data center partners in the US and EU, with Asia planned for later. I care about facilities that treat power, physical access, and customer data with the same seriousness as rack space. Sustainable, secure, and private servers are the bar, not a marketing line.',
                'There is no vendor lock-in. You can migrate off at any time onto your own hardware or to another provider. You can also bring your own servers and run them with the panel. If you leave, I help you move, and your workloads are not stuck in a format only I can read. Staying should be a choice, not a trap.',
            ],
        },
        {
            title: 'Panel and daemon',
            paragraphs: [
                'Older major versions of the panel are open source. Those releases stay available and receive bug fixes and security updates only. The newest major versions are closed source so panel development can fund itself and keep shipping. The panel covers one-click services, game servers, Git website deploys, bare metal, containers, MicroVMs, firewall, backups, API access, and team accounts.',
                'The server daemon is still under development. It is being built as open-source software and will not be locked to the Voltaic panel. When it is ready, you should be able to build a custom panel on top of it or control hosts from the CLI. The panel is one interface. The daemon is the work underneath, and that work should stay portable.',
            ],
        },
        {
            title: 'Payments',
            paragraphs: [
                'I accept USD, EUR, and Monero. Fiat payments go through Stripe, so the card and bank options Stripe supports in your region are available there. New service has a 30-day refund window if it does not fit. Try the service, and if it is the wrong fit you can get out cleanly inside that window.',
            ],
        },
        {
            title: 'Privacy and security',
            paragraphs: [
                'I collect only the customer data the law requires. The public site has no ads, no tracking pixels, and no product telemetry. Servers are hardened and monitored with Wazuh XDR and threat intelligence so problems show up as alerts you can act on, not as quiet failures.',
                'Support is me, a real person, not an AI chatbot. When something breaks, you get a human who knows the systems, not a script that restates the docs.',
            ],
        },
        {
            title: 'Network protection',
            paragraphs: [
                'Anti-DDoS, anti-bot, and anti-scraping protections are included at no extra charge. You do not need Cloudflare for those protections. Public sites and APIs should stay usable without handing traffic to a third-party CDN just to get basic abuse controls.',
            ],
        },
        {
            title: 'What I will not host',
            paragraphs: [
                'On Voltaic-owned servers I will not host illegal sites, gambling, email servers, or pornography. DMCA takedowns apply on those systems. That keeps the shared infrastructure usable for customers who follow the rules.',
                'Bring-your-own servers that you operate yourself are not under those content rules. You stay responsible for what runs on hardware you control, and I stay out of policing gear that is not mine.',
            ],
        },
    ],
};
