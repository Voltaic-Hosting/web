// Nav views a consumer account sees in the panel demo. Everything else is
// treated as pro tooling and hidden in consumer mode.
export const CONSUMER_NAV: ReadonlySet<string> = new Set([
    'overview',
    'servers',
    'backups',
    'logs',
    'notifications',
    'support',
    'docs',
    'settings',
]);
