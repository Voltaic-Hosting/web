import type { Product } from './types';

export const products: Product[] = [
    {
        slug: 'game-servers',
        title: 'Game Servers',
        navLabel: 'Game Servers',
        href: '/game-servers',
        icon: 'gamepad-2',
        headline: 'Your own game server. No setup, no fuss.',
        lede: 'Pick a game, tell us how many players you need, and we build the server. You get a live console, file access, scheduled backups, and player controls from day one.',
        metaDescription:
            'Rent a Minecraft, Valheim, Rust, or other game server from Voltaic Hosting. One-click setup, live console, scheduled backups, and human-first support.',
        cardSummary:
            'Minecraft, Valheim, Rust, and other game servers with a live console, backups, and player controls.',
        cardPoints: [
            'Minecraft, Valheim, Rust, and more',
            'Live console and file access',
            'Scheduled backups that restore',
        ],
        games: [
            'Minecraft',
            'Valheim',
            'Rust',
            'Palworld',
            'Project Zomboid',
            'Arma Reforger',
            'CS2',
            '7 Days to Die',
            'More on request',
        ],
        features: [
            {
                icon: 'gamepad-2',
                title: 'Pick a game, not a config file',
                body: 'Choose from the catalog or ask for another game. We handle the install, updates, and dependencies like SteamCMD.',
            },
            {
                icon: 'square-terminal',
                title: 'A real console, no SSH required',
                body: 'Watch the server log live, run commands, and restart with one click. Everything you would do over SSH, from a browser.',
            },
            {
                icon: 'download',
                title: 'Backups that actually restore',
                body: 'Scheduled backups of game files and configs. Restore a backup in one click instead of hoping it exists.',
            },
            {
                icon: 'users',
                title: 'Player controls built in',
                body: 'Whitelist, ops, kicks, and bans from the panel. Friends join with an IP and port.',
            },
            {
                icon: 'hard-drive',
                title: 'Room for mods and saves',
                body: 'Saves, plugins, and mod files live on real disk. Add mods by dropping files in or ask us to set them up.',
            },
            {
                icon: 'life-buoy',
                title: 'A human when it breaks',
                body: 'If the server goes down or a plugin misbehaves, you email a person who knows the setup. No ticket queue.',
            },
        ],
        included: [
            'Server install and game updates',
            'Live console and file manager',
            'Scheduled backups with one-click restore',
            'Player controls: whitelist, ops, kicks, bans',
            'SFTP access for mods and saves',
            'Human first support',
        ],
        steps: [
            {
                title: 'Tell us the game and player count',
                body: 'Email us the game, roughly how many players, and any mods or plugins you want. We reply with a setup and a monthly price.',
            },
            {
                title: 'We build the server',
                body: 'We install the game, apply your settings, and hand you a working server. Most setups are done within a couple of business days.',
            },
            {
                title: 'You play',
                body: 'Console access, backups, and player controls are yours from day one. Share the IP and port with your group.',
            },
        ],
    },
    {
        slug: 'websites',
        title: 'Websites',
        navLabel: 'Websites',
        href: '/websites',
        icon: 'globe',
        headline: 'Your site, live on the internet. No cPanel required.',
        lede: 'Connect a Git repository and we build and publish your site automatically. Custom domain, free SSL, backups, and a human when something breaks.',
        metaDescription:
            'Website hosting from Voltaic Hosting. Deploy from any Git repository, custom domains, free SSL, scheduled backups, and human support.',
        cardSummary:
            'Git-powered website hosting. Push code, we build and publish. No server admin.',
        cardPoints: [
            'Deploys from any Git repository',
            'Custom domains and free SSL',
            'Scheduled backups included',
        ],
        features: [
            {
                icon: 'git-branch',
                title: 'Push to deploy',
                body: 'Connect GitHub, GitLab, or any Git remote. Every push builds and publishes your site, or trigger a deploy yourself.',
            },
            {
                icon: 'globe',
                title: 'Your domain, handled',
                body: "Point your domain at us and we sort out DNS guidance, free SSL via Let's Encrypt, and renewals. Need a paid certificate for a wildcard or EV cert? Bring your own and we will install it.",
            },
            {
                icon: 'zap',
                title: 'Fast by default',
                body: 'Static sites and apps served close to visitors, with anti-bot and anti-scraping protection included at no extra charge.',
            },
            {
                icon: 'database',
                title: 'More than static pages',
                body: 'Need forms, a store, email on your domain, a database, or a small app? Ask. We host what the panel can run and tell you honestly what it cannot.',
            },
            {
                icon: 'gauge',
                title: 'Uptime monitoring included',
                body: 'The panel watches your sites and alerts you when something goes down, with history you can check before you email us.',
            },
            {
                icon: 'download',
                title: 'Backups on schedule',
                body: 'Scheduled backups of your files and data. Restore in one click if a deploy goes wrong.',
            },
            {
                icon: 'life-buoy',
                title: 'Support that answers',
                body: 'Email a person, not a ticket queue. When something breaks you get someone who knows your setup.',
            },
        ],
        included: [
            'Git-based deploys on push or on demand',
            'Custom domain with free SSL',
            'Scheduled backups with one-click restore',
            'Anti-bot and anti-scraping protection',
            'Uptime monitoring',
            'File and log access',
            'Human first support',
        ],
        steps: [
            {
                title: 'Tell us about the site',
                body: 'Email us your repository or what you want to build, plus the domain you plan to use. We reply with a setup and a monthly price.',
            },
            {
                title: 'We wire up deploys',
                body: 'We connect the repo, set up the build, point the domain, and issue SSL. You get a working site.',
            },
            {
                title: 'You push, we publish',
                body: 'Every push builds and publishes your site. Roll back in one click if a deploy goes wrong.',
            },
        ],
    },
    {
        slug: 'servers',
        title: 'Your Own Server',
        navLabel: 'Your Server',
        href: '/servers',
        icon: 'server',
        headline: 'Your own server, minus the sysadmin part.',
        lede: 'One panel for everything you run: game servers, websites, databases, bots, and services. It works on hardware you own or hardware we host, and Moonbase keeps your services private.',
        metaDescription:
            'Voltaic Panel: one dashboard for game servers, websites, and services on your own hardware or ours. Firewall, backups, team access, and private networking included.',
        cardSummary: 'One dashboard for everything you host. Bring your own hardware or rent ours.',
        cardPoints: [
            'Game servers and websites in one place',
            'Firewall, backups, and team access',
            'Runs on your hardware or ours',
        ],
        features: [
            {
                icon: 'layout-dashboard',
                title: 'One panel for everything',
                body: 'Servers, sites, backups, firewall rules, and team members in a single dashboard. No SSH, no config files unless you want them.',
            },
            {
                icon: 'server',
                title: 'Bring your own hardware',
                body: 'Run the server agent on a machine in your closet, a rack, or a VPS. We host the panel, and the agent connects your hardware to your dashboard.',
            },
            {
                icon: 'network',
                title: 'Moonbase keeps it private',
                body: 'A custom QUIC-based overlay network. Reach your services and game servers from your own devices without putting them on the public internet.',
            },
            {
                icon: 'bot',
                title: 'AI is optional, not forced',
                body: 'The panel ships an MCP server and optional integrations for building fully customized servers, services, and game servers. Use them or ignore them.',
            },
            {
                icon: 'boxes',
                title: 'Isolated by default',
                body: 'Containers and MicroVMs keep workloads separated without a hypervisor stack to maintain.',
            },
            {
                icon: 'key',
                title: 'API and automation',
                body: 'Everything in the panel is scriptable. Automate deploys, backups, and power actions.',
            },
            {
                icon: 'users',
                title: 'Team access',
                body: 'Invite friends or staff with the permissions they actually need. Sub-users per server keep things tidy.',
            },
        ],
        included: [
            'Voltaic Panel access',
            'Firewall rules per server',
            'Scheduled backups',
            'Team and sub-user accounts',
            'Moonbase private access',
            'API access',
        ],
        steps: [
            {
                title: 'Tell us what you run',
                body: 'Email us what you want hosted and whether you have hardware or want ours. We reply with a setup and a monthly price.',
            },
            {
                title: 'We set up the agent',
                body: 'We install the server agent on your hardware or provision ours, then connect it to the panel and configure firewall and backups.',
            },
            {
                title: 'You manage from one place',
                body: 'Game servers, websites, and services live in one dashboard. Invite your team when you are ready.',
            },
        ],
    },
];

export function productBySlug(slug: string): Product | undefined {
    return products.find((product) => product.slug === slug);
}
