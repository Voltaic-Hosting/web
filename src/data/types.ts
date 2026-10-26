export interface NavItem {
    label: string;
    href: string;
}

export interface ContactInfo {
    email: string;
    responseTime: string;
}

export interface SiteSeo {
    defaultTitle: string;
    titleSeparator: string;
    defaultDescription: string;
    keywords: string;
    ogImage: string;
    twitterCard: string;
    locale: string;
    organization: {
        type: string;
        name: string;
        url: string;
        email: string;
        logo: string;
        sameAs: string[];
    };
}

export interface SiteConfig {
    name: string;
    tagline: string;
    domain: string;
    contact: ContactInfo;
    nav: NavItem[];
    footerNav: NavItem[];
    privacyNote: string;
    seo: SiteSeo;
    heroLede: string;
}

export type ServiceCategory = 'Software' | 'Networking' | 'Security' | 'Facilities' | 'Server AI';

export interface Service {
    slug: string;
    title: string;
    summary: string;
    badge?: string;
    category: ServiceCategory;
}

export interface Value {
    title: string;
    body: string;
}

export interface AboutSection {
    title: string;
    paragraphs: string[];
}

export interface AboutContent {
    intro: string;
    sections: AboutSection[];
}

export interface FaqItem {
    question: string;
    answer: string[];
}

export interface FaqGroup {
    title: string;
    items: FaqItem[];
}

export interface FaqContent {
    intro: string;
    groups: FaqGroup[];
}

export type BrandingFormat = 'png' | 'jpg' | 'webp';

export interface BrandingAsset {
    key: string;
    label: string;
    description: string;
    formats: Record<BrandingFormat, string>;
    dimensions: string;
    preview: 'light' | 'dark' | 'neutral' | 'field';
}

export interface BrandingContent {
    intro: string;
    assets: BrandingAsset[];
}

export interface ErrorContent {
    title: string;
    description: string;
}

export interface LegalMeta {
    effectiveDate: string;
    operator: string;
}

export interface LegalSection {
    title: string;
    paragraphs: string[];
    list: string[];
}

export interface LegalDocument {
    intro: string;
    sections: LegalSection[];
}

export interface LegalContent extends LegalMeta {
    privacy: LegalDocument;
    terms: LegalDocument;
}

export interface PanelAccount {
    id: string;
    name: string;
    email: string;
    org: string;
    plan: string;
    scope: string;
    role: string;
    avatarSeed: string;
    avatarColor?: string | null;
}

export interface PanelProfile extends PanelAccount {
    avatarColor: string | null;
    avatarImage?: string | null;
}

export interface PanelServerSftp {
    host: string;
    port: number;
    user: string;
}

export interface PanelServer {
    id: string;
    name: string;
    type: string;
    role: string;
    region: string;
    locationId: string;
    status: string;
    cpu: number;
    ram: number;
    disk: number;
    cpuCores?: number;
    ramGb?: number;
    diskGb?: number;
    chalks: string[];
    logfiles: string[];
    sftp: PanelServerSftp;
    game?: string;
    players?: number;
    slots?: number;
    version?: string;
}

export interface PanelFirewallRule {
    id: string;
    serverId: string;
    action: string;
    source: string;
    dest: string;
    proto: string;
}

export interface PanelLogEntry {
    time: string;
    level: string;
    source: string;
    message: string;
}

export interface PanelAuditEntry {
    time: string;
    actor: string;
    action: string;
    target: string;
    ip: string;
}

export interface PanelUser {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    avatarSeed: string;
    perms: string[];
}

export interface PanelTicket {
    id: string;
    subject: string;
    priority: string;
    status: string;
    updated: string;
    body: string;
}

export interface PanelDocPage {
    id: string;
    section: string;
    title: string;
    blurb: string;
    body: string;
}

export interface PanelNotification {
    id: string;
    title: string;
    body: string;
    channel: 'email' | 'push' | 'webhook';
    time: string;
    read: boolean;
}

export interface PanelNotificationChannel {
    key: 'email' | 'push' | 'webhook';
    label: string;
    description: string;
    enabled: boolean;
}

export interface PanelChatMember {
    id: string;
    name: string;
    avatarSeed: string;
    avatarColor?: string | null;
}

export interface PanelChatMessage {
    id: string;
    authorId: string;
    time: string;
    body: string;
}

export interface PanelChatChannel {
    id: string;
    label: string;
    kind: 'dm' | 'group' | 'team' | 'support';
    unread: number;
    members: PanelChatMember[];
    preview: string;
    updated: string;
    messages: PanelChatMessage[];
}

export interface PanelBackup {
    id: string;
    serverId: string;
    name: string;
    size: string;
    created: string;
    status: string;
}

export interface PanelLocation {
    id: string;
    code: string;
    name: string;
    provider: string;
    capacity: string;
    servers: number;
    status: string;
}

export interface PanelApiKey {
    id: string;
    name: string;
    prefix: string;
    created: string;
    lastUsed: string;
    lastIp: string;
    scopes: string[];
}

export interface PanelApiEndpoint {
    method: string;
    path: string;
    description: string;
}

export interface PanelSession {
    id: string;
    device: string;
    ip: string;
    location: string;
    current: boolean;
    lastActive: string;
    userAgent: string;
}

export interface PanelSecurity {
    passwordHint: string;
    totp: boolean;
    yubikey: boolean;
    passkey: boolean;
}

export interface PanelSubuser {
    id: string;
    serverId: string;
    email: string;
    perms: string[];
}

export interface PanelFileEntry {
    serverId: string;
    path: string;
    kind: string;
    size: string;
}

export interface PanelSetting {
    key: string;
    label: string;
    value: string;
}

export interface PanelSettingToggle {
    key: string;
    label: string;
    enabled: boolean;
}

export interface PanelUptimeMonitor {
    id: string;
    name: string;
    target: string;
    type: string;
    status: string;
    uptime90d: string;
    latencyMs: number;
    errors24h: number;
    lastCheck: string;
    regions: string[];
    history: string;
}

export interface PanelUptimeIncident {
    id: string;
    monitor: string;
    started: string;
    duration: string;
    error: string;
    resolved: boolean;
}

export interface PanelUptime {
    summary: {
        overall: string;
        monitors: number;
        incidents90d: number;
        avgLatencyMs: number;
        errors24h: number;
    };
    monitors: PanelUptimeMonitor[];
    incidents: PanelUptimeIncident[];
}

export interface PanelShot {
    src: string;
    alt: string;
    caption: string;
}

export interface PanelNavItem {
    id: string;
    label: string;
}

export interface PanelStat {
    label: string;
    value: string;
    hint: string;
    nav: string;
}

export interface PanelConcept {
    title: string;
    lede: string;
    conceptNote: string;
    account: PanelAccount;
    nav: PanelNavItem[];
    stats: PanelStat[];
    timezones: string[];
    servers: PanelServer[];
    audit: PanelAuditEntry[];
    firewall: PanelFirewallRule[];
    backups: PanelBackup[];
    locations: PanelLocation[];
    logs: PanelLogEntry[];
    logFiles: string[];
    users: PanelUser[];
    permissionOptions: string[];
    subusers: PanelSubuser[];
    files: PanelFileEntry[];
    fileContents: Record<string, string>;
    apiKeys: PanelApiKey[];
    apiDocs: PanelApiEndpoint[];
    sessions: PanelSession[];
    security: PanelSecurity;
    tickets: PanelTicket[];
    docs: PanelDocPage[];
    notifications: PanelNotification[];
    notificationChannels: PanelNotificationChannel[];
    notificationWebhook: string;
    chatChannels: PanelChatChannel[];
    settings: PanelSetting[];
    settingsToggles: PanelSettingToggle[];
    uptime: PanelUptime;
    shots: PanelShot[];
}
