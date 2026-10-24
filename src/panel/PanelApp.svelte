<script lang="ts">
    import '../styles/panel.css';
    import { Menu, X } from '@lucide/svelte';
    import { onMount, untrack } from 'svelte';
    import type { PanelConcept, PanelServer, PanelUser } from '@/data/types';
    import { setPanelSimulation } from './context';
    import { createPanelSimulation } from './simulation.svelte';
    import { SvelteSet } from 'svelte/reactivity';
    import NotificationsView from './NotificationsView.svelte';
    import PanelTopbarTools from './PanelTopbarTools.svelte';
    import ServerDetail from './ServerDetail.svelte';
    import UptimeView from './UptimeView.svelte';
    import UserAvatar from './UserAvatar.svelte';
    import ToastStack from './ui/ToastStack.svelte';
    import AdminView from './views/AdminView.svelte';
    import ApiView from './views/ApiView.svelte';
    import BackupsView from './views/BackupsView.svelte';
    import DocsView from './views/DocsView.svelte';
    import FirewallView from './views/FirewallView.svelte';
    import LocationsView from './views/LocationsView.svelte';
    import LogsView from './views/LogsView.svelte';
    import OverviewView from './views/OverviewView.svelte';
    import ProfileView from './views/ProfileView.svelte';
    import ServersView from './views/ServersView.svelte';
    import SettingsView from './views/SettingsView.svelte';
    import SupportView from './views/SupportView.svelte';
    import UsersView from './views/UsersView.svelte';

    interface Props {
        panel: PanelConcept;
        compact?: boolean;
        initialView?: string;
    }

    let { panel, compact = false, initialView = 'overview' }: Props = $props();

    function navAllowedForUser(user: PanelUser): Set<string> {
        const allowed = new SvelteSet(['overview', 'docs', 'settings', 'notifications']);
        if (user.perms.includes('servers')) {
            for (const id of ['servers', 'backups', 'locations', 'uptime', 'logs']) {
                allowed.add(id);
            }
        }
        if (user.perms.includes('firewall')) {
            allowed.add('firewall');
        }
        if (user.perms.includes('support')) {
            allowed.add('support');
        }
        if (user.perms.includes('users')) {
            allowed.add('users');
        }
        if (user.perms.includes('api')) {
            allowed.add('api');
        }
        if (user.perms.includes('admin')) {
            allowed.add('admin');
        }
        return allowed;
    }

    const TIMEZONE_STORAGE_KEY = 'voltaic-panel-timezone';

    let view = $state(untrack(() => initialView));
    let query = $state('');
    let selectedServerId = $state<string | null>(null);
    let firewallServerId = $state(untrack(() => panel.servers[0]?.id ?? ''));
    let viewAsUser = $state<PanelUser | null>(null);
    let menuOpen = $state(false);
    let timezone = $state('UTC');
    const sim = untrack(() => createPanelSimulation(panel));
    setPanelSimulation(sim);

    const setTimezone = (value: string) => {
        timezone = value;
        window.localStorage.setItem(TIMEZONE_STORAGE_KEY, value);
    };

    onMount(() => {
        const stored = window.localStorage.getItem(TIMEZONE_STORAGE_KEY);
        if (stored) {
            timezone = stored;
        }
    });

    const navigate = (next: string) => {
        view = next;
        selectedServerId = null;
        query = '';
        menuOpen = false;
    };

    $effect(() => {
        if (!menuOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                menuOpen = false;
            }
        };

        window.addEventListener('keydown', onKeyDown);

        if (compact) {
            return () => {
                window.removeEventListener('keydown', onKeyDown);
            };
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    });

    const openServer = (server: PanelServer) => {
        selectedServerId = server.id;
        view = 'servers';
        query = '';
        menuOpen = false;
    };

    const startViewAs = (user: PanelUser) => {
        viewAsUser = user;
        selectedServerId = null;
        view = 'overview';
        sim.pushToast(`Viewing panel as ${user.name}`);
    };

    const stopViewAs = () => {
        viewAsUser = null;
        sim.pushToast('Back to your account');
    };

    const visibleNav = $derived.by(() => {
        if (!viewAsUser) {
            return panel.nav;
        }
        const allowed = navAllowedForUser(viewAsUser);
        return panel.nav.filter((item) => allowed.has(item.id));
    });

    const contentView = $derived.by(() => {
        if (!viewAsUser || view === 'profile') {
            return view;
        }
        return navAllowedForUser(viewAsUser).has(view) ? view : 'overview';
    });

    const activeAccount = $derived(
        viewAsUser
            ? {
                  name: viewAsUser.name,
                  email: viewAsUser.email,
                  role: viewAsUser.role,
                  avatarSeed: viewAsUser.avatarSeed,
                  avatarColor: null,
                  avatarImage: null,
                  org: panel.account.org,
                  plan: panel.account.plan,
              }
            : sim.profile,
    );

    const selectedServer = $derived(
        sim.servers.find((server) => server.id === selectedServerId) ?? null,
    );

    const filteredServers = $derived.by(() => {
        const byType =
            sim.filter === 'all'
                ? sim.servers
                : sim.servers.filter((server) => server.type === sim.filter);
        const q = query.trim().toLowerCase();
        if (!q || view !== 'servers' || selectedServer) {
            return byType;
        }
        return byType.filter(
            (server) =>
                server.name.toLowerCase().includes(q) ||
                server.role.toLowerCase().includes(q) ||
                server.region.toLowerCase().includes(q) ||
                server.type.toLowerCase().includes(q),
        );
    });

    const heading = $derived(
        selectedServer && contentView === 'servers'
            ? selectedServer.name
            : contentView === 'profile'
              ? 'Profile'
              : (visibleNav.find((item) => item.id === view)?.label ?? 'Overview'),
    );

    const navItemClass = (itemId: string) => {
        const serversActive =
            Boolean(selectedServerId) && itemId === 'servers' && view === 'servers';
        const active = (!selectedServerId && view === itemId) || serversActive;
        return `panel-app__nav-item${active ? ' is-active' : ''}`;
    };
</script>

<div class="panel-app" class:panel-app--compact={compact} class:is-menu-open={menuOpen}>
    <div class="panel-app__mobile-bar">
        <button
            type="button"
            class="panel-app__menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="panel-app-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onclick={() => (menuOpen = !menuOpen)}
        >
            {#if menuOpen}
                <X size={20} aria-hidden="true" />
            {:else}
                <Menu size={20} aria-hidden="true" />
            {/if}
        </button>

        <div class="panel-app__mobile-brand">
            <span class="panel-app__mark" aria-hidden="true"></span>
            <div>
                <p class="panel-app__brand-name">Voltaic Panel</p>
                <p class="panel-app__brand-meta">{heading}</p>
            </div>
        </div>

        <div class="panel-app__mobile-tools">
            <PanelTopbarTools
                clock={sim.clock}
                {timezone}
                timezones={panel.timezones}
                onTimezoneChange={setTimezone}
                notifications={sim.notifications}
                unreadNotifications={sim.unreadNotifications}
                onMarkRead={sim.markNotificationRead}
                onOpenNotifications={() => navigate('notifications')}
                onClearNotifications={sim.clearNotifications}
                profile={sim.profile}
                users={sim.users}
                chatChannels={sim.chatChannels}
                activeChatId={sim.activeChatId}
                unreadChat={sim.unreadChat}
                onChatChannelChange={sim.setActiveChatId}
                onSendChat={sim.sendChatMessage}
                onCreateDirectMessage={sim.createDirectMessage}
                onCreateGroup={sim.createGroupChat}
            />
        </div>

        <button
            type="button"
            class="panel-app__mobile-profile"
            class:is-active={contentView === 'profile'}
            aria-label="Open profile for {activeAccount.name}"
            onclick={() => navigate('profile')}
        >
            <UserAvatar
                seed={activeAccount.avatarSeed}
                name={activeAccount.name}
                size={32}
                color={activeAccount.avatarColor}
                imageUrl={activeAccount.avatarImage}
            />
        </button>
    </div>

    {#if menuOpen}
        <button
            type="button"
            class="panel-app__backdrop"
            aria-label="Close menu"
            onclick={() => (menuOpen = false)}
        ></button>
    {/if}

    <aside class="panel-app__sidebar" id="panel-app-nav">
        <div class="panel-app__brand">
            <span class="panel-app__mark" aria-hidden="true"></span>
            <div>
                <p class="panel-app__brand-name">Voltaic Panel</p>
                <p class="panel-app__brand-meta">{panel.account.plan} · DFW / ORD / IAD</p>
            </div>
        </div>

        <nav class="panel-app__nav" aria-label="Panel">
            {#each visibleNav as item (item.id)}
                <button
                    type="button"
                    class={navItemClass(item.id)}
                    onclick={() => navigate(item.id)}
                >
                    {item.label}
                </button>
            {/each}
        </nav>

        <div class="panel-app__sidebar-foot">
            <button
                type="button"
                class="panel-profile-btn"
                class:is-active={contentView === 'profile'}
                onclick={() => navigate('profile')}
            >
                <UserAvatar
                    seed={activeAccount.avatarSeed}
                    name={activeAccount.name}
                    size={34}
                    color={activeAccount.avatarColor}
                    imageUrl={activeAccount.avatarImage}
                />
                <span>
                    <span class="panel-profile-btn__name">{activeAccount.name}</span>
                    <span class="panel-app__muted">{activeAccount.role}</span>
                </span>
            </button>
            <p class="panel-app__chip">{activeAccount.plan ?? panel.account.plan}</p>
            <p class="panel-app__muted">{activeAccount.org ?? panel.account.org}</p>
            <a class="panel-app__email" href="mailto:{activeAccount.email}">{activeAccount.email}</a
            >
        </div>
    </aside>

    <div class="panel-app__main">
        {#if viewAsUser}
            <div class="panel-viewas-banner">
                <p>Viewing as <strong>{viewAsUser.name}</strong> ({viewAsUser.role})</p>
                <button type="button" class="panel-mini-btn" onclick={stopViewAs}>
                    Exit view as
                </button>
            </div>
        {/if}
        <header class="panel-app__topbar">
            <div>
                <p class="panel-app__eyebrow">Control panel</p>
                <h2 class="panel-app__heading">{heading}</h2>
            </div>
            <div class="panel-app__topbar-actions">
                <PanelTopbarTools
                    clock={sim.clock}
                    {timezone}
                    timezones={panel.timezones}
                    onTimezoneChange={setTimezone}
                    notifications={sim.notifications}
                    unreadNotifications={sim.unreadNotifications}
                    onMarkRead={sim.markNotificationRead}
                    onOpenNotifications={() => navigate('notifications')}
                    onClearNotifications={sim.clearNotifications}
                    profile={sim.profile}
                    users={sim.users}
                    chatChannels={sim.chatChannels}
                    activeChatId={sim.activeChatId}
                    unreadChat={sim.unreadChat}
                    onChatChannelChange={sim.setActiveChatId}
                    onSendChat={sim.sendChatMessage}
                    onCreateDirectMessage={sim.createDirectMessage}
                    onCreateGroup={sim.createGroupChat}
                />
            </div>
        </header>

        <div class="panel-app__content" class:panel-app__content--flush={contentView === 'docs'}>
            {#if contentView === 'overview'}
                <OverviewView
                    {panel}
                    servers={sim.servers}
                    audit={sim.audit}
                    onNavigate={navigate}
                    onOpenServer={openServer}
                />
            {/if}

            {#if contentView === 'servers' && selectedServer}
                <ServerDetail
                    {panel}
                    server={selectedServer}
                    {sim}
                    onBack={() => (selectedServerId = null)}
                />
            {/if}

            {#if contentView === 'servers' && !selectedServer}
                <ServersView
                    servers={filteredServers}
                    filter={sim.filter}
                    onFilter={sim.setFilter}
                    {query}
                    onQuery={(value) => (query = value)}
                    busy={sim.busy}
                    onOpen={openServer}
                    onStart={sim.startServer}
                    onStop={sim.stopServer}
                    onRestart={sim.restartServer}
                />
            {/if}

            {#if contentView === 'backups'}
                <BackupsView
                    {panel}
                    backups={sim.backups}
                    servers={sim.servers}
                    busy={sim.busy}
                    onCreate={sim.createBackup}
                    onDownload={sim.downloadBackup}
                    onRestore={sim.restoreBackup}
                />
            {/if}

            {#if contentView === 'firewall'}
                <FirewallView
                    servers={sim.servers}
                    rules={sim.firewall}
                    selectedId={firewallServerId}
                    onSelect={(id) => (firewallServerId = id)}
                    onAdd={sim.addFirewallRule}
                    onUpdate={sim.updateFirewallRule}
                    onRemove={sim.removeFirewallRule}
                />
            {/if}

            {#if contentView === 'locations'}
                <LocationsView
                    locations={panel.locations}
                    servers={sim.servers}
                    onOpenServer={openServer}
                    onToast={sim.pushToast}
                />
            {/if}

            {#if contentView === 'uptime'}
                <UptimeView
                    uptime={panel.uptime}
                    monitors={sim.monitors}
                    busy={sim.busy}
                    onCheckNow={sim.checkNow}
                />
            {/if}

            {#if contentView === 'logs'}
                <LogsView entries={panel.logs} logFiles={panel.logFiles} />
            {/if}

            {#if contentView === 'api'}
                <ApiView
                    keys={sim.apiKeys}
                    endpoints={panel.apiDocs}
                    onCreate={sim.createApiKey}
                    onRevoke={sim.revokeApiKey}
                />
            {/if}

            {#if contentView === 'users'}
                <UsersView
                    users={sim.users}
                    permissionOptions={panel.permissionOptions}
                    onAdd={sim.addUser}
                    onUpdatePerms={sim.updateUserPerms}
                    onViewAs={startViewAs}
                />
            {/if}

            {#if contentView === 'support'}
                <SupportView
                    tickets={sim.tickets}
                    onCreate={sim.createTicket}
                    onClose={sim.closeTicket}
                />
            {/if}

            {#if contentView === 'docs'}
                <DocsView docs={panel.docs} />
            {/if}

            {#if contentView === 'notifications'}
                <NotificationsView
                    notifications={sim.notifications}
                    channels={sim.notificationChannels}
                    webhookUrl={sim.webhookUrl}
                    onWebhookUrlChange={sim.setWebhookUrl}
                    onToggleChannel={sim.toggleNotificationChannel}
                    onMarkRead={sim.markNotificationRead}
                    onMarkAllRead={sim.markAllNotificationsRead}
                    onClearAll={sim.clearNotifications}
                    onTestWebhook={sim.testWebhook}
                    onToast={sim.pushToast}
                />
            {/if}

            {#if contentView === 'admin'}
                <AdminView
                    audit={sim.audit}
                    users={sim.users}
                    permissionOptions={panel.permissionOptions}
                    onAdd={sim.addUser}
                    onUpdatePerms={sim.updateUserPerms}
                    onViewAs={startViewAs}
                />
            {/if}

            {#if contentView === 'settings'}
                <SettingsView
                    settings={panel.settings}
                    toggles={sim.toggles}
                    onToggle={sim.toggleSetting}
                    onResetDefaults={sim.resetSettingsDefaults}
                />
            {/if}

            {#if contentView === 'profile'}
                <ProfileView
                    profile={sim.profile}
                    {panel}
                    security={sim.security}
                    sessions={sim.sessions}
                    onUpdateProfile={sim.updateProfile}
                    onUploadAvatar={sim.uploadAvatarImage}
                    onResetAvatar={sim.resetAvatar}
                    onToggleSecurity={sim.toggleSecurity}
                    onRevokeSession={sim.revokeSession}
                    onToast={sim.pushToast}
                />
            {/if}
        </div>
    </div>

    <ToastStack toasts={sim.toasts} onDismiss={sim.dismissToast} />
</div>
