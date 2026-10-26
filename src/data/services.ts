import type { Service } from './types';

export const services: Service[] = [
    {
        slug: 'voltaic-panel',
        category: 'Software' as const,
        title: 'Voltaic Panel',
        summary:
            'Run bare metal, containers, and MicroVMs from one interface. One-click services, game servers, website deploys from any Git repository, firewall rules, backups, an API, and team accounts.',
    },
    {
        slug: 'game-servers',
        category: 'Software' as const,
        title: 'Game Servers',
        summary:
            'Install a game server from the catalog in one click. Each server has a console, file access, scheduled backups, and player controls.',
    },
    {
        slug: 'git-websites',
        category: 'Software' as const,
        title: 'Git Website Deploys',
        summary:
            'Connect a Git repository and the panel builds and publishes the site. Deploys run on push or when you trigger one.',
    },
    {
        slug: 'custom-software',
        category: 'Software' as const,
        title: 'Custom Software',
        summary:
            'Hosting and infrastructure software written for data centers, hosting providers, and open-source communities.',
    },
    {
        slug: 'server-hardware',
        category: 'Facilities' as const,
        title: 'Server Hardware',
        summary:
            'Servers specified and built for the workload you describe. You get the power draw and capacity numbers in writing before anything ships.',
        badge: 'Soon',
    },
    {
        slug: 'data-centers',
        category: 'Facilities' as const,
        title: 'Data Centers',
        summary:
            'Colocation planning, rack installs, and coordination with the facility for equipment that lives outside your office.',
    },
    {
        slug: 'microvms',
        category: 'Software' as const,
        title: 'MicroVMs',
        summary:
            'Virtual machines that each run their own kernel. Workloads stay isolated without a full hypervisor stack to maintain.',
    },
    {
        slug: 'voltaic-net',
        category: 'Networking' as const,
        title: 'Voltaic-Net',
        summary:
            'Mesh WireGuard plus a reverse proxy so you can reach self-hosted services from your devices without putting them on the public internet.',
    },
    {
        slug: 'firewall',
        category: 'Security' as const,
        title: 'Firewall Configuration',
        summary:
            'OPNsense and pfSense installs, hardening, and ongoing rule maintenance for offices and colo racks.',
    },
    {
        slug: 'wazuh-xdr',
        category: 'Security' as const,
        title: 'Wazuh XDR',
        summary:
            'Wazuh deployed across your endpoints and servers. Log collection, alert tuning, and response steps for the hosts you actually run.',
    },
    {
        slug: 'threat-intelligence',
        category: 'Security' as const,
        title: 'Threat Intelligence',
        summary:
            'Indicator feeds loaded into your firewalls and detection rules so known bad traffic is dropped at the edge.',
    },
    {
        slug: 'anti-bot',
        category: 'Security' as const,
        title: 'Anti-Bot / Anti-Scraping',
        summary:
            'Protection for public sites and APIs against scrapers, credential stuffing, and automated abuse.',
    },
    {
        slug: 'server-ai',
        title: 'Server AI',
        summary: 'Local AI for sysadmin tasks and security, running on your own servers.',
        category: 'Server AI' as const,
    },
];
