export type IconName =
    | 'layout-dashboard'
    | 'gamepad-2'
    | 'git-branch'
    | 'code-xml'
    | 'server'
    | 'building'
    | 'boxes'
    | 'network'
    | 'brick-wall-shield'
    | 'radar'
    | 'scan-search'
    | 'crosshair'
    | 'bot'
    | 'bot-off'
    | 'cpu'
    | 'warehouse'
    | 'brain-circuit'
    | 'credit-card'
    | 'receipt'
    | 'bitcoin'
    | 'undo-2'
    | 'badge-check'
    | 'shield'
    | 'shield-check'
    | 'user-round'
    | 'mail'
    | 'copy'
    | 'clipboard-list'
    | 'list-checks'
    | 'check'
    | 'compass'
    | 'lock'
    | 'key'
    | 'ban'
    | 'timer'
    | 'refresh-cw'
    | 'gauge'
    | 'hourglass'
    | 'server-crash'
    | 'triangle-alert'
    | 'wrench'
    | 'server-off'
    | 'download'
    | 'circle-question-mark'
    | 'file-sliders'
    | 'calendar';

export const serviceIcons: Record<string, IconName> = {
    'voltaic-panel': 'layout-dashboard',
    'game-servers': 'gamepad-2',
    'git-websites': 'git-branch',
    'custom-software': 'code-xml',
    'server-hardware': 'cpu',
    'data-centers': 'warehouse',
    microvms: 'boxes',
    'voltaic-net': 'network',
    firewall: 'brick-wall-shield',
    'wazuh-xdr': 'scan-search',
    'threat-intelligence': 'radar',
    'anti-bot': 'bot-off',
    'server-ai': 'brain-circuit',
};

export const categoryIcons: Record<string, IconName> = {
    Software: 'code-xml',
    Networking: 'network',
    Security: 'shield-check',
    Facilities: 'warehouse',
    'Server AI': 'brain-circuit',
};

export const valueIcons: IconName[] = ['undo-2', 'receipt', 'shield'];

export const detailIcons: Record<string, IconName> = {
    Founder: 'user-round',
    Company: 'building',
    Payments: 'credit-card',
    Contact: 'mail',
};

export const faqGroupIcons: Record<string, IconName> = {
    'Billing and exit': 'credit-card',
    'Panel and software': 'layout-dashboard',
    'Privacy and security': 'shield-check',
    'Hosting and content': 'server',
    'Getting started': 'compass',
};

export const statusIcons: Record<number, IconName> = {
    401: 'lock',
    403: 'ban',
    404: 'compass',
    419: 'timer',
    429: 'gauge',
    500: 'server-crash',
    503: 'wrench',
};

export const billingIcons: IconName[] = ['credit-card', 'receipt', 'undo-2'];

export const includeIcons: IconName[] = ['clipboard-list', 'server', 'calendar', 'file-sliders'];
