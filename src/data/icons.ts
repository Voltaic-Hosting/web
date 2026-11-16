export type IconName =
    | 'layout-dashboard'
    | 'gamepad-2'
    | 'git-branch'
    | 'folder-git-2'
    | 'globe'
    | 'code-xml'
    | 'server'
    | 'building'
    | 'boxes'
    | 'container'
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
    | 'users'
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
    | 'calendar'
    | 'square-terminal'
    | 'database'
    | 'zap'
    | 'hard-drive'
    | 'rocket'
    | 'life-buoy'
    | 'message-circle'
    | 'arrow-right'
    | 'arrow-up-right'
    | 'infinity'
    | 'chevron-down';

export const productIcons: Record<string, IconName> = {
    'game-servers': 'gamepad-2',
    websites: 'globe',
    servers: 'server',
};

export const serviceIcons: Record<string, IconName> = {
    'voltaic-panel': 'layout-dashboard',
    'custom-software': 'code-xml',
    'server-hardware': 'cpu',
    'data-centers': 'warehouse',
    microvms: 'boxes',
    moonbase: 'network',
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
    'Getting started': 'rocket',
    'Game servers': 'gamepad-2',
    Websites: 'globe',
    'Your own server': 'server',
    'Billing and privacy': 'shield-check',
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
