import { useCallback, useEffect, useRef, useState } from 'react';
import {
    clearAvatarImage,
    loadAvatarImage,
    loadProfileDraft,
    readImageFile,
    saveAvatarImage,
    saveProfileDraft,
} from '@/Components/panel/avatarStorage';
import type {
    PanelApiKey,
    PanelAuditEntry,
    PanelBackup,
    PanelChatChannel,
    PanelChatMessage,
    PanelConcept,
    PanelFirewallRule,
    PanelNotificationChannel,
    PanelProfile,
    PanelServer,
    PanelSettingToggle,
    PanelSubuser,
    PanelTicket,
    PanelUptimeMonitor,
    PanelUser,
} from '@/types';

export type ServerFilter = 'all' | 'Bare metal' | 'Container' | 'MicroVM' | 'Game Servers';

export function usePanelSimulation(panel: PanelConcept) {
    const [servers, setServers] = useState(panel.servers);
    const [monitors, setMonitors] = useState(panel.uptime.monitors);
    const [toggles, setToggles] = useState(panel.settings_toggles);
    const [firewall, setFirewall] = useState(panel.firewall);
    const [backups, setBackups] = useState(panel.backups);
    const [subusers, setSubusers] = useState(panel.subusers);
    const [users, setUsers] = useState(panel.users);
    const [tickets, setTickets] = useState(panel.tickets);
    const [apiKeys, setApiKeys] = useState(panel.api_keys);
    const [sessions, setSessions] = useState(panel.sessions);
    const [audit, setAudit] = useState(panel.audit);
    const [security, setSecurity] = useState(panel.security);
    const [profile, setProfile] = useState<PanelProfile>({
        ...panel.account,
        avatar_color: panel.account.avatar_color ?? null,
        avatar_image: null,
    });
    const profileLoaded = useRef(false);
    const [notifications, setNotifications] = useState(panel.notifications);
    const [notificationChannels, setNotificationChannels] = useState(panel.notification_channels);
    const [webhookUrl, setWebhookUrl] = useState(panel.notification_webhook);
    const [chatChannels, setChatChannels] = useState(panel.chat_channels);
    const [activeChatId, setActiveChatId] = useState(panel.chat_channels[0]?.id ?? '');
    const [busy, setBusy] = useState<Record<string, boolean>>({});
    const [toasts, setToasts] = useState<Array<{ id: string; message: string }>>([]);
    const [clock, setClock] = useState(() => new Date());
    const [filter, setFilter] = useState<ServerFilter>('all');

    const pushToast = useCallback((message: string) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        setToasts((current) => [...current.slice(-4), { id, message }]);
        window.setTimeout(() => {
            setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 4200);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const pushAudit = useCallback((entry: Omit<PanelAuditEntry, 'time'> & { time?: string }) => {
        const stamp = entry.time ?? new Date().toISOString().slice(11, 19);
        setAudit((current) =>
            [
                {
                    time: stamp,
                    actor: entry.actor,
                    action: entry.action,
                    target: entry.target,
                    ip: entry.ip,
                },
                ...current,
            ].slice(0, 40),
        );
    }, []);

    useEffect(() => {
        const draft = loadProfileDraft();
        void loadAvatarImage().then((image) => {
            setProfile((current) => ({
                ...current,
                ...(draft ?? {}),
                avatar_image: image,
            }));
            profileLoaded.current = true;
        });
    }, []);

    useEffect(() => {
        if (!profileLoaded.current) {
            return;
        }

        const timer = window.setTimeout(() => {
            saveProfileDraft({
                name: profile.name,
                email: profile.email,
                avatar_seed: profile.avatar_seed,
                avatar_color: profile.avatar_color,
            });
        }, 400);

        return () => window.clearTimeout(timer);
    }, [profile.name, profile.email, profile.avatar_seed, profile.avatar_color]);

    useEffect(() => {
        const tick = window.setInterval(() => {
            setClock(new Date());
            setServers((current) =>
                current.map((server) =>
                    server.status === 'stopped' || server.status === 'paused'
                        ? server
                        : advanceServer(server),
                ),
            );
            setMonitors((current) =>
                current.map((monitor) => ({
                    ...monitor,
                    latency_ms: jitterLatency(monitor.latency_ms, monitor.status),
                    last_check: `${2 + Math.floor(Math.random() * 12)}s ago`,
                })),
            );
        }, 2400);

        return () => window.clearInterval(tick);
    }, []);

    const runAction = useCallback(
        (key: string, message: string, work: () => void, delay = 900) => {
            if (busy[key]) {
                return;
            }
            setBusy((current) => ({ ...current, [key]: true }));
            window.setTimeout(() => {
                work();
                setBusy((current) => {
                    const next = { ...current };
                    delete next[key];
                    return next;
                });
                pushToast(message);
            }, delay);
        },
        [busy, pushToast],
    );

    const setServerStatus = useCallback(
        (server: PanelServer, status: string, message: string) => {
            runAction(
                `${server.id}-${status}`,
                message,
                () => {
                    setServers((current) =>
                        current.map((item) => {
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
                        }),
                    );
                    pushAudit({
                        actor: panel.account.email,
                        action: `server.${status}`,
                        target: server.name,
                        ip: '198.51.100.24',
                    });
                },
                status === 'online' ? 1100 : 700,
            );
        },
        [panel.account.email, pushAudit, runAction],
    );

    const startServer = useCallback(
        (server: PanelServer) => setServerStatus(server, 'online', `${server.name} started`),
        [setServerStatus],
    );

    const stopServer = useCallback(
        (server: PanelServer) => setServerStatus(server, 'stopped', `${server.name} stopped`),
        [setServerStatus],
    );

    const pauseServer = useCallback(
        (server: PanelServer) => setServerStatus(server, 'paused', `${server.name} paused`),
        [setServerStatus],
    );

    const restartServer = useCallback(
        (server: PanelServer) => {
            runAction(
                `${server.id}-restart`,
                `${server.name} restarted`,
                () => {
                    setServers((current) =>
                        current.map((item) =>
                            item.id === server.id
                                ? {
                                      ...item,
                                      status: 'online',
                                      cpu: 14,
                                      ram: Math.max(18, item.ram - 6),
                                      chalks: pushChalk(item.chalks, 'up'),
                                  }
                                : item,
                        ),
                    );
                    pushAudit({
                        actor: panel.account.email,
                        action: 'server.restart',
                        target: server.name,
                        ip: '198.51.100.24',
                    });
                },
                1300,
            );
        },
        [panel.account.email, pushAudit, runAction],
    );

    const checkNow = useCallback(
        (monitor: PanelUptimeMonitor) => {
            runAction(
                `check-${monitor.id}`,
                `Check finished for ${monitor.name}`,
                () => {
                    setMonitors((current) =>
                        current.map((entry) =>
                            entry.id === monitor.id
                                ? {
                                      ...entry,
                                      last_check: 'just now',
                                      latency_ms: jitterLatency(entry.latency_ms, entry.status),
                                      status: entry.status === 'degraded' ? 'up' : entry.status,
                                  }
                                : entry,
                        ),
                    );
                },
                1000,
            );
        },
        [runAction],
    );

    const toggleSetting = useCallback(
        (item: PanelSettingToggle) => {
            setToggles((current) =>
                current.map((entry) =>
                    entry.key === item.key ? { ...entry, enabled: !entry.enabled } : entry,
                ),
            );
            pushToast(`${item.label}: ${item.enabled ? 'off' : 'on'}`);
        },
        [pushToast],
    );

    const addFirewallRule = useCallback(
        (rule: Omit<PanelFirewallRule, 'id'>) => {
            const id = `fw-${Date.now()}`;
            setFirewall((current) => [{ ...rule, id }, ...current]);
            pushAudit({
                actor: panel.account.email,
                action: 'firewall.rule.create',
                target: rule.server_id,
                ip: '198.51.100.24',
            });
            pushToast('Firewall rule added');
        },
        [panel.account.email, pushAudit, pushToast],
    );

    const removeFirewallRule = useCallback(
        (id: string) => {
            setFirewall((current) => current.filter((rule) => rule.id !== id));
            pushToast('Firewall rule removed');
        },
        [pushToast],
    );

    const updateFirewallRule = useCallback(
        (id: string, patch: Omit<PanelFirewallRule, 'id'>) => {
            setFirewall((current) =>
                current.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)),
            );
            pushAudit({
                actor: panel.account.email,
                action: 'firewall.rule.update',
                target: patch.server_id,
                ip: '198.51.100.24',
            });
            pushToast('Firewall rule updated');
        },
        [panel.account.email, pushAudit, pushToast],
    );

    const createBackup = useCallback(
        (server: PanelServer) => {
            runAction(
                `backup-${server.id}`,
                `Backup started for ${server.name}`,
                () => {
                    const entry: PanelBackup = {
                        id: `bk-${Date.now()}`,
                        server_id: server.id,
                        name: `${server.name}-manual`,
                        size: '—',
                        created: 'just now',
                        status: 'ready',
                    };
                    setBackups((current) => [entry, ...current]);
                    pushAudit({
                        actor: panel.account.email,
                        action: 'backup.create',
                        target: server.name,
                        ip: '198.51.100.24',
                    });
                },
                1200,
            );
        },
        [panel.account.email, pushAudit, runAction],
    );

    const downloadBackup = useCallback(
        (backup: PanelBackup) => {
            const server = panel.servers.find((item) => item.id === backup.server_id);
            const body = [
                'Voltaic Panel backup export (concept)',
                `Name: ${backup.name}`,
                `Server: ${server?.name ?? backup.server_id}`,
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
            pushToast(`Downloading ${backup.name}`);
        },
        [panel.servers, pushToast],
    );

    const restoreBackup = useCallback(
        (backup: PanelBackup) => {
            runAction(
                `restore-${backup.id}`,
                `Restore queued for ${backup.name}`,
                () => {
                    pushAudit({
                        actor: panel.account.email,
                        action: 'backup.restore',
                        target: backup.name,
                        ip: '198.51.100.24',
                    });
                },
                1400,
            );
        },
        [panel.account.email, pushAudit, runAction],
    );

    const deleteBackup = useCallback(
        (backup: PanelBackup) => {
            setBackups((current) => current.filter((item) => item.id !== backup.id));
            pushAudit({
                actor: panel.account.email,
                action: 'backup.delete',
                target: backup.name,
                ip: '198.51.100.24',
            });
            pushToast(`Deleted ${backup.name}`);
        },
        [panel.account.email, pushAudit, pushToast],
    );

    const addSubuser = useCallback(
        (entry: Omit<PanelSubuser, 'id'>) => {
            const subuser: PanelSubuser = {
                id: `su-${Date.now()}`,
                ...entry,
            };
            setSubusers((current) => [...current, subuser]);
            pushAudit({
                actor: panel.account.email,
                action: 'subuser.create',
                target: entry.email,
                ip: '198.51.100.24',
            });
            pushToast(`Subuser added: ${entry.email}`);
        },
        [panel.account.email, pushAudit, pushToast],
    );

    const removeSubuser = useCallback(
        (id: string) => {
            setSubusers((current) => {
                const target = current.find((item) => item.id === id);
                if (target) {
                    pushAudit({
                        actor: panel.account.email,
                        action: 'subuser.remove',
                        target: target.email,
                        ip: '198.51.100.24',
                    });
                    pushToast(`Removed ${target.email}`);
                }
                return current.filter((item) => item.id !== id);
            });
        },
        [panel.account.email, pushAudit, pushToast],
    );

    const updateSubuser = useCallback(
        (id: string, patch: Pick<PanelSubuser, 'email' | 'perms'>) => {
            setSubusers((current) =>
                current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
            );
            pushAudit({
                actor: panel.account.email,
                action: 'subuser.update',
                target: patch.email,
                ip: '198.51.100.24',
            });
            pushToast(`Updated ${patch.email}`);
        },
        [panel.account.email, pushAudit, pushToast],
    );

    const addUser = useCallback(
        (user: Omit<PanelUser, 'id' | 'avatar_seed' | 'status'> & { status?: string }) => {
            const entry: PanelUser = {
                id: `u-${Date.now()}`,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status ?? 'invited',
                avatar_seed: user.email,
                perms: user.perms,
            };
            setUsers((current) => [...current, entry]);
            pushAudit({
                actor: panel.account.email,
                action: 'user.invite',
                target: user.email,
                ip: '198.51.100.24',
            });
            pushToast(`Invite sent to ${user.email}`);
        },
        [panel.account.email, pushAudit, pushToast],
    );

    const updateUserPerms = useCallback(
        (userId: string, perms: string[]) => {
            setUsers((current) =>
                current.map((user) => (user.id === userId ? { ...user, perms } : user)),
            );
            pushToast('Permissions updated');
        },
        [pushToast],
    );

    const createTicket = useCallback(
        (subject: string, priority: string, body: string) => {
            const entry: PanelTicket = {
                id: String(1300 + tickets.length),
                subject,
                priority,
                status: 'open',
                updated: 'just now',
                body,
            };
            setTickets((current) => [entry, ...current]);
            pushToast(`Ticket #${entry.id} opened`);
        },
        [pushToast, tickets.length],
    );

    const closeTicket = useCallback(
        (id: string) => {
            setTickets((current) =>
                current.map((ticket) =>
                    ticket.id === id
                        ? { ...ticket, status: 'resolved', updated: 'just now' }
                        : ticket,
                ),
            );
            pushToast(`Ticket #${id} closed`);
        },
        [pushToast],
    );

    const createApiKey = useCallback(
        (name: string) => {
            const entry: PanelApiKey = {
                id: `key-${Date.now()}`,
                name,
                prefix: `vt_live_${Math.random().toString(36).slice(2, 6)}`,
                created: new Date().toISOString().slice(0, 10),
                last_used: 'never',
                last_ip: '—',
                scopes: ['servers:read'],
            };
            setApiKeys((current) => [entry, ...current]);
            pushToast(`API key created: ${entry.prefix}…`);
        },
        [pushToast],
    );

    const revokeApiKey = useCallback(
        (id: string) => {
            setApiKeys((current) => current.filter((key) => key.id !== id));
            pushToast('API key revoked');
        },
        [pushToast],
    );

    const revokeSession = useCallback(
        (id: string) => {
            setSessions((current) => current.filter((session) => session.id !== id));
            pushToast('Session revoked');
        },
        [pushToast],
    );

    const toggleSecurity = useCallback(
        (key: 'totp' | 'yubikey' | 'passkey') => {
            setSecurity((current) => {
                const next = { ...current, [key]: !current[key] };
                pushToast(`${key} ${next[key] ? 'enabled' : 'disabled'}`);
                return next;
            });
        },
        [pushToast],
    );

    const updateProfile = useCallback((patch: Partial<PanelProfile>) => {
        setProfile((current) => ({ ...current, ...patch }));
    }, []);

    const uploadAvatarImage = useCallback(
        (file: File) => {
            if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
                pushToast('Use a PNG, JPG, or WEBP image');
                return;
            }

            void readImageFile(file).then((dataUrl) => {
                void saveAvatarImage(dataUrl).then(() => {
                    setProfile((current) => ({ ...current, avatar_image: dataUrl }));
                    pushToast('Profile photo updated');
                });
            });
        },
        [pushToast],
    );

    const resetAvatar = useCallback(() => {
        void clearAvatarImage().then(() => {
            setProfile((current) => ({
                ...current,
                avatar_image: null,
                avatar_seed: panel.account.avatar_seed,
                avatar_color: panel.account.avatar_color ?? null,
            }));
            pushToast('Avatar reset to defaults');
        });
    }, [panel.account.avatar_color, panel.account.avatar_seed, pushToast]);

    const resetSettingsDefaults = useCallback(() => {
        setToggles(panel.settings_toggles);
        setNotificationChannels(panel.notification_channels);
        setWebhookUrl(panel.notification_webhook);
        pushToast('Settings reset to defaults');
    }, [
        panel.notification_channels,
        panel.notification_webhook,
        panel.settings_toggles,
        pushToast,
    ]);

    const markNotificationRead = useCallback((id: string) => {
        setNotifications((current) =>
            current.map((item) => (item.id === id ? { ...item, read: true } : item)),
        );
    }, []);

    const markAllNotificationsRead = useCallback(() => {
        setNotifications((current) => current.map((item) => ({ ...item, read: true })));
        pushToast('All notifications marked read');
    }, [pushToast]);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
        pushToast('Notifications cleared');
    }, [pushToast]);

    const toggleNotificationChannel = useCallback(
        (key: PanelNotificationChannel['key']) => {
            setNotificationChannels((current) =>
                current.map((channel) =>
                    channel.key === key ? { ...channel, enabled: !channel.enabled } : channel,
                ),
            );
            pushToast('Notification channel updated');
        },
        [pushToast],
    );

    const testWebhook = useCallback(() => {
        if (!webhookUrl.trim()) {
            pushToast('Enter a webhook URL first');
            return;
        }
        pushToast('Test webhook sent (concept)');
    }, [pushToast, webhookUrl]);

    const sendChatMessage = useCallback(
        (channelId: string, body: string) => {
            const trimmed = body.trim();
            if (!trimmed) {
                return;
            }
            const message: PanelChatMessage = {
                id: `m-${Date.now()}`,
                author_id: profile.id,
                time: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }),
                body: trimmed,
            };
            setChatChannels((current) =>
                current.map((channel) =>
                    channel.id === channelId
                        ? {
                              ...channel,
                              messages: [...channel.messages, message],
                              preview: trimmed,
                              updated: message.time,
                              unread: 0,
                          }
                        : channel,
                ),
            );
        },
        [profile.id],
    );

    const selectChatChannel = useCallback((channelId: string) => {
        setActiveChatId(channelId);
        setChatChannels((current) =>
            current.map((channel) =>
                channel.id === channelId ? { ...channel, unread: 0 } : channel,
            ),
        );
    }, []);

    const createDirectMessage = useCallback(
        (user: PanelUser) => {
            const existing = chatChannels.find(
                (channel) =>
                    channel.kind === 'dm' &&
                    channel.members.some((member) => member.id === user.id),
            );
            if (existing) {
                selectChatChannel(existing.id);
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
                        id: profile.id,
                        name: profile.name,
                        avatar_seed: profile.avatar_seed,
                        avatar_color: profile.avatar_color,
                    },
                    {
                        id: user.id,
                        name: user.name,
                        avatar_seed: user.avatar_seed,
                    },
                ],
                messages: [],
            };

            setChatChannels((current) => [channel, ...current]);
            setActiveChatId(channel.id);
            pushToast(`Opened DM with ${user.name}`);
            return channel.id;
        },
        [
            chatChannels,
            profile.avatar_color,
            profile.avatar_seed,
            profile.id,
            profile.name,
            pushToast,
            selectChatChannel,
        ],
    );

    const createGroupChat = useCallback(
        (name: string, memberIds: string[]) => {
            const trimmed = name.trim();
            if (!trimmed || memberIds.length === 0) {
                pushToast('Pick a name and at least one member');
                return null;
            }

            const selected = users.filter((user) => memberIds.includes(user.id));
            const members = [
                {
                    id: profile.id,
                    name: profile.name,
                    avatar_seed: profile.avatar_seed,
                    avatar_color: profile.avatar_color,
                },
                ...selected.map((user) => ({
                    id: user.id,
                    name: user.name,
                    avatar_seed: user.avatar_seed,
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
                        author_id: profile.id,
                        time: new Date().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }),
                        body: `Created group "${trimmed}" with ${selected.map((user) => user.name).join(', ')}.`,
                    },
                ],
            };

            setChatChannels((current) => [channel, ...current]);
            setActiveChatId(channel.id);
            pushToast(`Created group ${trimmed}`);
            return channel.id;
        },
        [profile.avatar_color, profile.avatar_seed, profile.id, profile.name, pushToast, users],
    );

    const unreadNotifications = notifications.filter((item) => !item.read).length;
    const unreadChat = chatChannels.reduce((sum, channel) => sum + channel.unread, 0);

    return {
        servers,
        monitors,
        toggles,
        firewall,
        backups,
        subusers,
        users,
        tickets,
        apiKeys,
        sessions,
        audit,
        security,
        profile,
        notifications,
        notificationChannels,
        webhookUrl,
        chatChannels,
        activeChatId,
        unreadNotifications,
        unreadChat,
        busy,
        toasts,
        clock,
        filter,
        setFilter,
        setWebhookUrl,
        setActiveChatId: selectChatChannel,
        createDirectMessage,
        createGroupChat,
        dismissToast,
        pushToast,
        updateProfile,
        uploadAvatarImage,
        resetAvatar,
        resetSettingsDefaults,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        toggleNotificationChannel,
        testWebhook,
        sendChatMessage,
        startServer,
        stopServer,
        pauseServer,
        restartServer,
        checkNow,
        toggleSetting,
        addFirewallRule,
        removeFirewallRule,
        updateFirewallRule,
        createBackup,
        downloadBackup,
        restoreBackup,
        deleteBackup,
        addSubuser,
        removeSubuser,
        updateSubuser,
        addUser,
        updateUserPerms,
        createTicket,
        closeTicket,
        createApiKey,
        revokeApiKey,
        revokeSession,
        toggleSecurity,
    };
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

export type PanelSimulation = ReturnType<typeof usePanelSimulation>;
