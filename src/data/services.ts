import type { Service } from './types';

export const services: Service[] = [
    {
        slug: 'voltaic-panel',
        category: 'Software' as const,
        title: 'Voltaic Panel',
        summary:
            'The control panel behind every Voltaic service. Bare metal, containers, MicroVMs, one-click services, game servers, Git website deploys, firewall rules, backups, an API, and team accounts. Older major versions are open source.',
    },
    {
        slug: 'custom-software',
        category: 'Software' as const,
        title: 'Custom Software',
        summary:
            'Hosting and infrastructure software written for data centers, hosting providers, and open-source communities.',
    },
    {
        slug: 'microvms',
        category: 'Software' as const,
        title: 'MicroVMs',
        summary:
            'Virtual machines that each run their own kernel. Workloads stay isolated without a full hypervisor stack to maintain.',
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
        slug: 'moonbase',
        category: 'Networking' as const,
        title: 'Moonbase',
        summary:
            'A custom QUIC-based overlay network for reaching your own services and game servers without exposing them to the public internet.',
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
