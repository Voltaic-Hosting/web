import { SvelteDate } from 'svelte/reactivity';
import {
    clearAvatarImage,
    loadAvatarImage,
    loadProfileDraft,
    readImageFile,
    saveAvatarImage,
    saveProfileDraft,
} from './avatarStorage';
import type {
    PanelApiKey,
    PanelAuditEntry,
    PanelBackup,
    PanelChatChannel,
    PanelChatMessage,
    PanelConcept,
    PanelFirewallRule,
    PanelNotification,
    PanelNotificationChannel,
    PanelProfile,
    PanelSecurity,
    PanelServer,
    PanelSession,
    PanelSettingToggle,
    PanelSubuser,
    PanelTicket,
    PanelUptimeMonitor,
    PanelUser,
} from '@/data/types';

export type ServerFilter = 'all' | 'Bare metal' | 'Container' | 'MicroVM' | 'Game Servers';

export class PanelSimulation {
    servers = $state<PanelServer[]>([]);
    monitors = $state<PanelUptimeMonitor[]>([]);
    toggles = $state<PanelSettingToggle[]>([]);
    firewall = $state<PanelFirewallRule[]>([]);
    backups = $state<PanelBackup[]>([]);
    subusers = $state<PanelSubuser[]>([]);
    users = $state<PanelUser[]>([]);
    tickets = $state<PanelTicket[]>([]);
    apiKeys = $state<PanelApiKey[]>([]);
    sessions = $state<PanelSession[]>([]);
    audit = $state<PanelAuditEntry[]>([]);
    security = $state<PanelSecurity>({
        passwordHint: '',
        totp: false,
        yubikey: false,
        passkey: false,
    });
    profile = $state<PanelProfile>({} as PanelProfile);
    notifications = $state<PanelNotification[]>([]);
    notificationChannels = $state<PanelNotificationChannel[]>([]);
    webhookUrl = $state('');
    chatChannels = $state<PanelChatChannel[]>([]);
    activeChatId = $state('');
    busy = $state<Record<string, boolean>>({});
    toasts = $state<Array<{ id: string; message: string }>>([]);
    clock = $state<Date | null>(null);
    filter = $state<ServerFilter>('all');

    unreadNotifications = $derived(this.notifications.filter((item) => !item.read).length);
    unreadChat = $derived(this.chatChannels.reduce((sum, channel) => sum + channel.unread, 0));

    private profileLoaded = false;

    constructor(private panel: PanelConcept) {
        this.servers = panel.servers;
        this.monitors = panel.uptime.monitors;
        this.toggles = panel.settingsToggles;
        this.firewall = panel.firewall;
        this.backups = panel.backups;
        this.subusers = panel.subusers;
        this.users = panel.users;
        this.tickets = panel.tickets;
        this.apiKeys = panel.apiKeys;
        this.sessions = panel.sessions;
        this.audit = panel.audit;
        this.security = panel.security;
        this.profile = {
            ...panel.account,
            avatarColor: panel.account.avatarColor ?? null,
            avatarImage: null,
        };
        this.notifications = panel.notifications;
        this.notificationChannels = panel.notificationChannels;
        this.webhookUrl = panel.notificationWebhook;
        this.chatChannels = panel.chatChannels;
        this.activeChatId = panel.chatChannels[0]?.id ?? '';

        $effect(() => {
            const draft = loadProfileDraft();
            void loadAvatarImage().then((image) => {
                this.profile = {
                    ...this.profile,
                    ...(draft ?? {}),
                    avatarImage: image,
                };
                this.profileLoaded = true;
            });
        });

        $effect(() => {
            if (!this.profileLoaded) {
                return;
            }

            const snapshot = {
                name: this.profile.name,
                email: this.profile.email,
                avatarSeed: this.profile.avatarSeed,
                avatarColor: this.profile.avatarColor,
            };
            const timer = window.setTimeout(() => {
                saveProfileDraft(snapshot);
            }, 400);

            return () => window.clearTimeout(timer);
        });

        $effect(() => {
            const tick = window.setInterval(() => {
                this.clock = new SvelteDate();
                this.servers = this.servers.map((server) =>
                    server.status === 'stopped' || server.status === 'paused'
                        ? server
                        : advanceServer(server),
                );
                this.monitors = this.monitors.map((monitor) => ({
                    ...monitor,
                    latencyMs: jitterLatency(monitor.latencyMs, monitor.status),
                    lastCheck: `${2 + Math.floor(Math.random() * 12)}s ago`,
                }));
            }, 2400);

            return () => window.clearInterval(tick);
        });
    }

    pushToast = (message: string) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        this.toasts = [...this.toasts.slice(-4), { id, message }];
        window.setTimeout(() => {
            this.toasts = this.toasts.filter((toast) => toast.id !== id);
        }, 4200);
    };

    dismissToast = (id: string) => {
        this.toasts = this.toasts.filter((toast) => toast.id !== id);
    };

    private pushAudit = (entry: Omit<PanelAuditEntry, 'time'> & { time?: string }) => {
        const stamp = entry.time ?? new SvelteDate().toISOString().slice(11, 19);
        this.audit = [
            {
                time: stamp,
                actor: entry.actor,
                action: entry.action,
                target: entry.target,
                ip: entry.ip,
            },
            ...this.audit,
        ].slice(0, 40);
    };

    private runAction = (key: string, message: string, work: () => void, delay = 900) => {
        if (this.busy[key]) {
            return;
        }
        this.busy = { ...this.busy, [key]: true };
        window.setTimeout(() => {
            work();
            const next = { ...this.busy };
            delete next[key];
            this.busy = next;
            this.pushToast(message);
        }, delay);
    };

    private setServerStatus = (server: PanelServer, status: string, message: string) => {
        this.runAction(
            `${server.id}-${status}`,
            message,
            () => {
                this.servers = this.servers.map((item) => {
                    if (item.id !== server.id) {
                        return item;
                    }
                    const next: PanelServer = {
                        ...item,
                        status,
                        chalks: pushChalk(
                            item.chalks,
                            status === 'online'
                                ? 'up'
                                : status === 'maintenance' || status === 'paused'
                                  ? 'maintenance'
                                  : 'down',
                        ),
                    };
                    if (item.type === 'Game' || item.type === 'Game Servers') {
                        next.players =
                            status === 'online'
                                ? Math.max(1, Math.floor((item.slots ?? 10) * 0.15))
                                : 0;
                        if (status === 'online') {
                            next.cpu = Math.max(18, item.cpu || 30);
                            next.ram = Math.max(22, item.ram || 35);
                        } else {
                            next.cpu = 0;
                            next.ram = 0;
                        }
                    }
                    return next;
                });
                this.pushAudit({
                    actor: this.panel.account.email,
                    action: `server.${status}`,
                    target: server.name,
                    ip: '198.51.100.24',
                });
            },
            status === 'online' ? 1100 : 700,
        );
    };

    startServer = (server: PanelServer) =>
        this.setServerStatus(server, 'online', `${server.name} started`);

    stopServer = (server: PanelServer) =>
        this.setServerStatus(server, 'stopped', `${server.name} stopped`);

    pauseServer = (server: PanelServer) =>
        this.setServerStatus(server, 'paused', `${server.name} paused`);

    restartServer = (server: PanelServer) => {
        this.runAction(
            `${server.id}-restart`,
            `${server.name} restarted`,
            () => {
                this.servers = this.servers.map((item) =>
                    item.id === server.id
                        ? {
                              ...item,
                              status: 'online',
                              cpu: 14,
                              ram: Math.max(18, item.ram - 6),
                              chalks: pushChalk(item.chalks, 'up'),
                          }
                        : item,
                );
                this.pushAudit({
                    actor: this.panel.account.email,
                    action: 'server.restart',
                    target: server.name,
                    ip: '198.51.100.24',
                });
            },
            1300,
        );
    };

    checkNow = (monitor: PanelUptimeMonitor) => {
        this.runAction(
            `check-${monitor.id}`,
            `Check finished for ${monitor.name}`,
            () => {
                this.monitors = this.monitors.map((entry) =>
                    entry.id === monitor.id
                        ? {
                              ...entry,
                              lastCheck: 'just now',
                              latencyMs: jitterLatency(entry.latencyMs, entry.status),
                              status: entry.status === 'degraded' ? 'up' : entry.status,
                          }
                        : entry,
                );
            },
            1000,
        );
    };

    toggleSetting = (item: PanelSettingToggle) => {
        this.toggles = this.toggles.map((entry) =>
            entry.key === item.key ? { ...entry, enabled: !entry.enabled } : entry,
        );
        this.pushToast(`${item.label}: ${item.enabled ? 'off' : 'on'}`);
    };

    addFirewallRule = (rule: Omit<PanelFirewallRule, 'id'>) => {
        const id = `fw-${Date.now()}`;
        this.firewall = [{ ...rule, id }, ...this.firewall];
        this.pushAudit({
            actor: this.panel.account.email,
            action: 'firewall.rule.create',
            target: rule.serverId,
            ip: '198.51.100.24',
        });
        this.pushToast('Firewall rule added');
    };

    removeFirewallRule = (id: string) => {
        this.firewall = this.firewall.filter((rule) => rule.id !== id);
        this.pushToast('Firewall rule removed');
    };

    updateFirewallRule = (id: string, patch: Omit<PanelFirewallRule, 'id'>) => {
        this.firewall = this.firewall.map((rule) =>
            rule.id === id ? { ...rule, ...patch } : rule,
        );
        this.pushAudit({
            actor: this.panel.account.email,
            action: 'firewall.rule.update',
            target: patch.serverId,
            ip: '198.51.100.24',
        });
        this.pushToast('Firewall rule updated');
    };

    createBackup = (server: PanelServer) => {
        this.runAction(
            `backup-${server.id}`,
            `Backup started for ${server.name}`,
            () => {
                const entry: PanelBackup = {
                    id: `bk-${Date.now()}`,
                    serverId: server.id,
                    name: `${server.name}-manual`,
                    size: '—',
                    created: 'just now',
                    status: 'ready',
                };
                this.backups = [entry, ...this.backups];
                this.pushAudit({
                    actor: this.panel.account.email,
                    action: 'backup.create',
                    target: server.name,
                    ip: '198.51.100.24',
                });
            },
            1200,
        );
    };

    downloadBackup = (backup: PanelBackup) => {
        const server = this.panel.servers.find((item) => item.id === backup.serverId);
        const body = [
            'Voltaic Panel backup export (concept)',
            `Name: ${backup.name}`,
            `Server: ${server?.name ?? backup.serverId}`,
            `Size: ${backup.size}`,
            `Created: ${backup.created}`,
            `Status: ${backup.status}`,
        ].join('\n');
        const blob = new Blob([body], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${backup.name}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        this.pushToast(`Downloading ${backup.name}`);
    };

    restoreBackup = (backup: PanelBackup) => {
        this.runAction(
            `restore-${backup.id}`,
            `Restore queued for ${backup.name}`,
            () => {
                this.pushAudit({
                    actor: this.panel.account.email,
                    action: 'backup.restore',
                    target: backup.name,
                    ip: '198.51.100.24',
                });
            },
            1400,
        );
    };

    deleteBackup = (backup: PanelBackup) => {
        this.backups = this.backups.filter((item) => item.id !== backup.id);
        this.pushAudit({
            actor: this.panel.account.email,
            action: 'backup.delete',
            target: backup.name,
            ip: '198.51.100.24',
        });
        this.pushToast(`Deleted ${backup.name}`);
    };

    addSubuser = (entry: Omit<PanelSubuser, 'id'>) => {
        const subuser: PanelSubuser = {
            id: `su-${Date.now()}`,
            ...entry,
        };
        this.subusers = [...this.subusers, subuser];
        this.pushAudit({
            actor: this.panel.account.email,
            action: 'subuser.create',
            target: entry.email,
            ip: '198.51.100.24',
        });
        this.pushToast(`Subuser added: ${entry.email}`);
    };

    removeSubuser = (id: string) => {
        const target = this.subusers.find((item) => item.id === id);
        if (target) {
            this.pushAudit({
                actor: this.panel.account.email,
                action: 'subuser.remove',
                target: target.email,
                ip: '198.51.100.24',
            });
            this.pushToast(`Removed ${target.email}`);
        }
        this.subusers = this.subusers.filter((item) => item.id !== id);
    };

    updateSubuser = (id: string, patch: Pick<PanelSubuser, 'email' | 'perms'>) => {
        this.subusers = this.subusers.map((item) =>
            item.id === id ? { ...item, ...patch } : item,
        );
        this.pushAudit({
            actor: this.panel.account.email,
            action: 'subuser.update',
            target: patch.email,
            ip: '198.51.100.24',
        });
        this.pushToast(`Updated ${patch.email}`);
    };

    addUser = (user: Omit<PanelUser, 'id' | 'avatarSeed' | 'status'> & { status?: string }) => {
        const entry: PanelUser = {
            id: `u-${Date.now()}`,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status ?? 'invited',
            avatarSeed: user.email,
            perms: user.perms,
        };
        this.users = [...this.users, entry];
        this.pushAudit({
            actor: this.panel.account.email,
            action: 'user.invite',
            target: user.email,
            ip: '198.51.100.24',
        });
        this.pushToast(`Invite sent to ${user.email}`);
    };

    updateUserPerms = (userId: string, perms: string[]) => {
        this.users = this.users.map((user) => (user.id === userId ? { ...user, perms } : user));
        this.pushToast('Permissions updated');
    };

    createTicket = (subject: string, priority: string, body: string) => {
        const entry: PanelTicket = {
            id: String(1300 + this.tickets.length),
            subject,
            priority,
            status: 'open',
            updated: 'just now',
            body,
        };
        this.tickets = [entry, ...this.tickets];
        this.pushToast(`Ticket #${entry.id} opened`);
    };

    closeTicket = (id: string) => {
        this.tickets = this.tickets.map((ticket) =>
            ticket.id === id ? { ...ticket, status: 'resolved', updated: 'just now' } : ticket,
        );
        this.pushToast(`Ticket #${id} closed`);
    };

    createApiKey = (name: string) => {
        const entry: PanelApiKey = {
            id: `key-${Date.now()}`,
            name,
            prefix: `vt_live_${Math.random().toString(36).slice(2, 6)}`,
            created: new SvelteDate().toISOString().slice(0, 10),
            lastUsed: 'never',
            lastIp: '—',
            scopes: ['servers:read'],
        };
        this.apiKeys = [entry, ...this.apiKeys];
        this.pushToast(`API key created: ${entry.prefix}…`);
    };

    revokeApiKey = (id: string) => {
        this.apiKeys = this.apiKeys.filter((key) => key.id !== id);
        this.pushToast('API key revoked');
    };

    revokeSession = (id: string) => {
        this.sessions = this.sessions.filter((session) => session.id !== id);
        this.pushToast('Session revoked');
    };

    toggleSecurity = (key: 'totp' | 'yubikey' | 'passkey') => {
        this.security = { ...this.security, [key]: !this.security[key] };
        this.pushToast(`${key} ${this.security[key] ? 'enabled' : 'disabled'}`);
    };

    updateProfile = (patch: Partial<PanelProfile>) => {
        this.profile = { ...this.profile, ...patch };
    };

    uploadAvatarImage = (file: File) => {
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
            this.pushToast('Use a PNG, JPG, or WEBP image');
            return;
        }

        void readImageFile(file).then((dataUrl) => {
            void saveAvatarImage(dataUrl).then(() => {
                this.profile = { ...this.profile, avatarImage: dataUrl };
                this.pushToast('Profile photo updated');
            });
        });
    };

    resetAvatar = () => {
        void clearAvatarImage().then(() => {
            this.profile = {
                ...this.profile,
                avatarImage: null,
                avatarSeed: this.panel.account.avatarSeed,
                avatarColor: this.panel.account.avatarColor ?? null,
            };
            this.pushToast('Avatar reset to defaults');
        });
    };

    resetSettingsDefaults = () => {
        this.toggles = this.panel.settingsToggles;
        this.notificationChannels = this.panel.notificationChannels;
        this.webhookUrl = this.panel.notificationWebhook;
        this.pushToast('Settings reset to defaults');
    };

    markNotificationRead = (id: string) => {
        this.notifications = this.notifications.map((item) =>
            item.id === id ? { ...item, read: true } : item,
        );
    };

    markAllNotificationsRead = () => {
        this.notifications = this.notifications.map((item) => ({ ...item, read: true }));
        this.pushToast('All notifications marked read');
    };

    clearNotifications = () => {
        this.notifications = [];
        this.pushToast('Notifications cleared');
    };

    toggleNotificationChannel = (key: PanelNotificationChannel['key']) => {
        this.notificationChannels = this.notificationChannels.map((channel) =>
            channel.key === key ? { ...channel, enabled: !channel.enabled } : channel,
        );
        this.pushToast('Notification channel updated');
    };

    testWebhook = () => {
        if (!this.webhookUrl.trim()) {
            this.pushToast('Enter a webhook URL first');
            return;
        }
        this.pushToast('Test webhook sent (concept)');
    };

    setWebhookUrl = (value: string) => {
        this.webhookUrl = value;
    };

    sendChatMessage = (channelId: string, body: string) => {
        const trimmed = body.trim();
        if (!trimmed) {
            return;
        }
        const message: PanelChatMessage = {
            id: `m-${Date.now()}`,
            authorId: this.profile.id,
            time: new SvelteDate().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }),
            body: trimmed,
        };
        this.chatChannels = this.chatChannels.map((channel) =>
            channel.id === channelId
                ? {
                      ...channel,
                      messages: [...channel.messages, message],
                      preview: trimmed,
                      updated: message.time,
                      unread: 0,
                  }
                : channel,
        );
    };

    setActiveChatId = (channelId: string) => {
        this.activeChatId = channelId;
        this.chatChannels = this.chatChannels.map((channel) =>
            channel.id === channelId ? { ...channel, unread: 0 } : channel,
        );
    };

    createDirectMessage = (user: PanelUser) => {
        const existing = this.chatChannels.find(
            (channel) =>
                channel.kind === 'dm' && channel.members.some((member) => member.id === user.id),
        );
        if (existing) {
            this.setActiveChatId(existing.id);
            return existing.id;
        }

        const channel: PanelChatChannel = {
            id: `dm-${user.id}`,
            label: user.name,
            kind: 'dm',
            unread: 0,
            preview: 'Start a direct message',
            updated: 'now',
            members: [
                {
                    id: this.profile.id,
                    name: this.profile.name,
                    avatarSeed: this.profile.avatarSeed,
                    avatarColor: this.profile.avatarColor,
                },
                {
                    id: user.id,
                    name: user.name,
                    avatarSeed: user.avatarSeed,
                },
            ],
            messages: [],
        };

        this.chatChannels = [channel, ...this.chatChannels];
        this.activeChatId = channel.id;
        this.pushToast(`Opened DM with ${user.name}`);
        return channel.id;
    };

    createGroupChat = (name: string, memberIds: string[]) => {
        const trimmed = name.trim();
        if (!trimmed || memberIds.length === 0) {
            this.pushToast('Pick a name and at least one member');
            return null;
        }

        const selected = this.users.filter((user) => memberIds.includes(user.id));
        const members = [
            {
                id: this.profile.id,
                name: this.profile.name,
                avatarSeed: this.profile.avatarSeed,
                avatarColor: this.profile.avatarColor,
            },
            ...selected.map((user) => ({
                id: user.id,
                name: user.name,
                avatarSeed: user.avatarSeed,
            })),
        ];

        const channel: PanelChatChannel = {
            id: `group-${Date.now()}`,
            label: trimmed,
            kind: 'group',
            unread: 0,
            preview: 'Group created',
            updated: 'now',
            members,
            messages: [
                {
                    id: `m-${Date.now()}`,
                    authorId: this.profile.id,
                    time: new SvelteDate().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }),
                    body: `Created group "${trimmed}" with ${selected.map((user) => user.name).join(', ')}.`,
                },
            ],
        };

        this.chatChannels = [channel, ...this.chatChannels];
        this.activeChatId = channel.id;
        this.pushToast(`Created group ${trimmed}`);
        return channel.id;
    };

    setFilter = (value: ServerFilter) => {
        this.filter = value;
    };
}

export function createPanelSimulation(panel: PanelConcept): PanelSimulation {
    return new PanelSimulation(panel);
}

function advanceServer(server: PanelServer): PanelServer {
    if (server.status === 'maintenance') {
        return {
            ...server,
            chalks: pushChalk(server.chalks, 'maintenance'),
            cpu: jitter(server.cpu, 2, 4, 20),
            ram: jitter(server.ram, 2, 10, 40),
        };
    }

    const roll = Math.random();
    let nextChalk = 'up';
    let nextStatus = server.status;

    if (roll > 0.97) {
        nextChalk = 'down';
        nextStatus = 'degraded';
    } else if (roll > 0.94) {
        nextChalk = 'maintenance';
    } else if (server.status === 'degraded' && roll < 0.55) {
        nextStatus = 'online';
        nextChalk = 'up';
    }

    const next: PanelServer = {
        ...server,
        status: nextStatus,
        chalks: pushChalk(server.chalks, nextChalk),
        cpu: jitter(server.cpu, 5, 6, 95),
        ram: jitter(server.ram, 4, 10, 96),
        disk: jitter(server.disk, 2, 8, 90),
    };

    if (
        (server.type === 'Game' || server.type === 'Game Servers') &&
        server.status === 'online' &&
        typeof server.players === 'number'
    ) {
        next.players = Math.max(
            0,
            Math.min(server.slots ?? 40, server.players + Math.floor(Math.random() * 3) - 1),
        );
    }

    return next;
}

function pushChalk(chalks: string[], next: string): string[] {
    return [...chalks.slice(-(8 - 1)), next].slice(-8);
}

function jitter(value: number, amount: number, min: number, max: number): number {
    const next = value + (Math.random() * amount * 2 - amount);
    return Math.max(min, Math.min(max, next));
}

function jitterLatency(value: number, status: string): number {
    const base = status === 'degraded' ? Math.max(value, 140) : value;
    const amount = status === 'degraded' ? 35 : 8;
    return Math.max(6, Math.round(jitter(base, amount, 6, status === 'degraded' ? 420 : 160)));
}
