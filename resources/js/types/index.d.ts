export interface NavItem {
    label: string;
    route: string;
}

export interface ContactInfo {
    email: string;
    response_time: string;
}

export interface SiteSeo {
    default_title: string;
    title_separator: string;
    default_description: string;
    keywords: string;
    og_image: string;
    twitter_card: string;
    locale: string;
    organization: {
        type: string;
        name: string;
        url: string;
        email: string;
        logo: string;
        same_as: string[];
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
}

export interface Service {
    slug: string;
    title: string;
    summary: string;
    badge?: string | null;
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
    preview: 'light' | 'dark';
}

export interface BrandingContent {
    intro: string;
    assets: BrandingAsset[];
}

export interface PanelAccount {
    id: string;
    name: string;
    email: string;
    org: string;
    plan: string;
    scope: string;
    role: string;
    avatar_seed: string;
    avatar_color?: string | null;
}

export interface PanelProfile extends PanelAccount {
    avatar_color: string | null;
    avatar_image?: string | null;
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
    location_id: string;
    status: string;
    cpu: number;
    ram: number;
    disk: number;
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
    server_id: string;
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
    avatar_seed: string;
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
    avatar_seed: string;
    avatar_color?: string | null;
}

export interface PanelChatMessage {
    id: string;
    author_id: string;
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
    server_id: string;
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
    last_used: string;
    last_ip: string;
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
    last_active: string;
    user_agent: string;
}

export interface PanelSecurity {
    password_hint: string;
    totp: boolean;
    yubikey: boolean;
    passkey: boolean;
}

export interface PanelSubuser {
    id: string;
    server_id: string;
    email: string;
    perms: string[];
}

export interface PanelFileEntry {
    server_id: string;
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
    uptime_90d: string;
    latency_ms: number;
    errors_24h: number;
    last_check: string;
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
        incidents_90d: number;
        avg_latency_ms: number;
        errors_24h: number;
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
    concept_note: string;
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
    log_files: string[];
    users: PanelUser[];
    permission_options: string[];
    subusers: PanelSubuser[];
    files: PanelFileEntry[];
    file_contents: Record<string, string>;
    api_keys: PanelApiKey[];
    api_docs: PanelApiEndpoint[];
    sessions: PanelSession[];
    security: PanelSecurity;
    tickets: PanelTicket[];
    docs: PanelDocPage[];
    notifications: PanelNotification[];
    notification_channels: PanelNotificationChannel[];
    notification_webhook: string;
    chat_channels: PanelChatChannel[];
    settings: PanelSetting[];
    settings_toggles: PanelSettingToggle[];
    uptime: PanelUptime;
    shots: PanelShot[];
}

export interface LegalMeta {
    effective_date: string;
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

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    site: SiteConfig;
};
