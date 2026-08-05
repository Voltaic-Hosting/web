import { useEffect, useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { UserAvatar } from '@/Components/panel/avatar';
import ServerDetail from '@/Components/panel/ServerDetail';
import UptimeView from '@/Components/panel/UptimeView';
import { usePanelSimulation } from '@/Components/panel/usePanelSimulation';
import { useTimezone } from '@/Components/panel/useTimezone';
import { ToastStack } from '@/Components/panel/ui';
import {
    AdminView,
    ApiView,
    BackupsView,
    DocsView,
    FirewallView,
    LocationsView,
    LogsView,
    OverviewView,
    ProfileView,
    ServersView,
    SettingsView,
    SupportView,
    UsersView,
} from '@/Components/panel/Views';
import type { PanelConcept, PanelServer, PanelUser } from '@/types';

interface PanelAppProps {
    panel: PanelConcept;
    compact?: boolean;
    initialView?: string;
}

function navAllowedForUser(user: PanelUser): Set<string> {
    const allowed = new Set(['overview', 'docs', 'settings']);
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

export default function PanelApp({
    panel,
    compact = false,
    initialView = 'overview',
}: PanelAppProps) {
    const [view, setView] = useState(initialView);
    const [query, setQuery] = useState('');
    const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
    const [firewallServerId, setFirewallServerId] = useState(panel.servers[0]?.id ?? '');
    const [viewAsUser, setViewAsUser] = useState<PanelUser | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const sim = usePanelSimulation(panel);
    const { timezone, setTimezone } = useTimezone('UTC');

    const navigate = (next: string) => {
        setView(next);
        setSelectedServerId(null);
        setQuery('');
        setMenuOpen(false);
    };

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
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
    }, [compact, menuOpen]);

    const openServer = (server: PanelServer) => {
        setSelectedServerId(server.id);
        setView('servers');
        setQuery('');
        setMenuOpen(false);
    };

    const startViewAs = (user: PanelUser) => {
        setViewAsUser(user);
        setSelectedServerId(null);
        setView('overview');
        sim.pushToast(`Viewing panel as ${user.name}`);
    };

    const stopViewAs = () => {
        setViewAsUser(null);
        sim.pushToast('Back to your account');
    };

    const visibleNav = useMemo(() => {
        if (!viewAsUser) {
            return panel.nav;
        }
        const allowed = navAllowedForUser(viewAsUser);
        return panel.nav.filter((item) => allowed.has(item.id));
    }, [panel.nav, viewAsUser]);

    const contentView = useMemo(() => {
        if (!viewAsUser || view === 'profile') {
            return view;
        }
        return navAllowedForUser(viewAsUser).has(view) ? view : 'overview';
    }, [view, viewAsUser]);

    const activeAccount = viewAsUser
        ? {
              name: viewAsUser.name,
              email: viewAsUser.email,
              role: viewAsUser.role,
              avatar_seed: viewAsUser.avatar_seed,
              org: panel.account.org,
              plan: panel.account.plan,
          }
        : panel.account;

    const selectedServer = sim.servers.find((server) => server.id === selectedServerId) ?? null;

    const filteredServers = useMemo(() => {
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
    }, [query, selectedServer, sim.filter, sim.servers, view]);

    const heading =
        selectedServer && contentView === 'servers'
            ? selectedServer.name
            : contentView === 'profile'
              ? 'Profile'
              : (visibleNav.find((item) => item.id === view)?.label ?? 'Overview');

    const navItemClass = (itemId: string) => {
        const serversActive =
            Boolean(selectedServerId) && itemId === 'servers' && view === 'servers';
        const active = (!selectedServerId && view === itemId) || serversActive;
        return `panel-app__nav-item${active ? ' is-active' : ''}`;
    };

    return (
        <div
            className={`panel-app${compact ? ' panel-app--compact' : ''}${menuOpen ? ' is-menu-open' : ''}`}
        >
            <div className="panel-app__mobile-bar">
                <button
                    type="button"
                    className="panel-app__menu-toggle"
                    aria-expanded={menuOpen}
                    aria-controls="panel-app-nav"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? (
                        <X size={20} aria-hidden="true" />
                    ) : (
                        <Menu size={20} aria-hidden="true" />
                    )}
                </button>

                <div className="panel-app__mobile-brand">
                    <span className="panel-app__mark" aria-hidden="true" />
                    <div>
                        <p className="panel-app__brand-name">Voltaic Panel</p>
                        <p className="panel-app__brand-meta">{heading}</p>
                    </div>
                </div>

                <button
                    type="button"
                    className={`panel-app__mobile-profile${contentView === 'profile' ? ' is-active' : ''}`}
                    aria-label={`Open profile for ${activeAccount.name}`}
                    onClick={() => navigate('profile')}
                >
                    <UserAvatar
                        seed={activeAccount.avatar_seed}
                        name={activeAccount.name}
                        size={32}
                    />
                </button>
            </div>

            {menuOpen ? (
                <button
                    type="button"
                    className="panel-app__backdrop"
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                />
            ) : null}

            <aside className="panel-app__sidebar" id="panel-app-nav">
                <div className="panel-app__brand">
                    <span className="panel-app__mark" aria-hidden="true" />
                    <div>
                        <p className="panel-app__brand-name">Voltaic Panel</p>
                        <p className="panel-app__brand-meta">
                            {panel.account.plan} · DFW / ORD / IAD
                        </p>
                    </div>
                </div>

                <nav className="panel-app__nav" aria-label="Panel">
                    {visibleNav.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className={navItemClass(item.id)}
                            onClick={() => navigate(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="panel-app__sidebar-foot">
                    <button
                        type="button"
                        className={`panel-profile-btn${contentView === 'profile' ? ' is-active' : ''}`}
                        onClick={() => navigate('profile')}
                    >
                        <UserAvatar
                            seed={activeAccount.avatar_seed}
                            name={activeAccount.name}
                            size={34}
                        />
                        <span>
                            <span className="panel-profile-btn__name">{activeAccount.name}</span>
                            <span className="panel-app__muted">{activeAccount.role}</span>
                        </span>
                    </button>
                    <p className="panel-app__chip">{activeAccount.plan ?? panel.account.plan}</p>
                    <p className="panel-app__muted">{activeAccount.org ?? panel.account.org}</p>
                    <a className="panel-app__email" href={`mailto:${activeAccount.email}`}>
                        {activeAccount.email}
                    </a>
                </div>
            </aside>

            <div className="panel-app__main">
                {viewAsUser ? (
                    <div className="panel-viewas-banner">
                        <p>
                            Viewing as <strong>{viewAsUser.name}</strong> ({viewAsUser.role})
                        </p>
                        <button type="button" className="panel-mini-btn" onClick={stopViewAs}>
                            Exit view as
                        </button>
                    </div>
                ) : null}
                <header className="panel-app__topbar">
                    <div>
                        <p className="panel-app__eyebrow">Control panel</p>
                        <h2 className="panel-app__heading">{heading}</h2>
                    </div>
                    <div className="panel-app__topbar-actions">
                        <details className="panel-clock-menu">
                            <summary
                                className="panel-app__clock panel-mono"
                                aria-label={`Current time in ${timezone}. Open to change timezone.`}
                            >
                                {sim.clock.toLocaleTimeString('en-US', {
                                    hour12: false,
                                    timeZone: timezone,
                                })}
                            </summary>
                            <div
                                className="panel-clock-menu__panel"
                                role="listbox"
                                aria-label="Timezone"
                            >
                                {panel.timezones.map((zone) => (
                                    <button
                                        key={zone}
                                        type="button"
                                        role="option"
                                        aria-selected={timezone === zone}
                                        className={`panel-clock-menu__zone${timezone === zone ? ' is-active' : ''}`}
                                        onClick={(event) => {
                                            setTimezone(zone);
                                            const details = event.currentTarget.closest('details');
                                            if (details) {
                                                details.open = false;
                                            }
                                        }}
                                    >
                                        <span>{zone}</span>
                                        <span className="panel-clock-menu__zone-time">
                                            {sim.clock.toLocaleTimeString('en-US', {
                                                hour12: false,
                                                timeZone: zone,
                                            })}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </details>
                    </div>
                </header>

                <div className="panel-app__content">
                    {contentView === 'overview' ? (
                        <OverviewView
                            panel={panel}
                            servers={sim.servers}
                            audit={sim.audit}
                            onNavigate={navigate}
                            onOpenServer={openServer}
                        />
                    ) : null}

                    {contentView === 'servers' && selectedServer ? (
                        <ServerDetail
                            panel={panel}
                            server={selectedServer}
                            sim={sim}
                            onBack={() => setSelectedServerId(null)}
                        />
                    ) : null}

                    {contentView === 'servers' && !selectedServer ? (
                        <ServersView
                            servers={filteredServers}
                            filter={sim.filter}
                            onFilter={sim.setFilter}
                            query={query}
                            onQuery={setQuery}
                            busy={sim.busy}
                            onOpen={openServer}
                            onStart={sim.startServer}
                            onStop={sim.stopServer}
                            onRestart={sim.restartServer}
                        />
                    ) : null}

                    {contentView === 'backups' ? (
                        <BackupsView
                            panel={panel}
                            backups={sim.backups}
                            servers={sim.servers}
                            busy={sim.busy}
                            onCreate={sim.createBackup}
                        />
                    ) : null}

                    {contentView === 'firewall' ? (
                        <FirewallView
                            servers={sim.servers}
                            rules={sim.firewall}
                            selectedId={firewallServerId}
                            onSelect={setFirewallServerId}
                            onAdd={sim.addFirewallRule}
                            onRemove={sim.removeFirewallRule}
                        />
                    ) : null}

                    {contentView === 'locations' ? (
                        <LocationsView
                            locations={panel.locations}
                            servers={sim.servers}
                            onOpenServer={openServer}
                            onToast={sim.pushToast}
                        />
                    ) : null}

                    {contentView === 'uptime' ? (
                        <UptimeView
                            uptime={panel.uptime}
                            monitors={sim.monitors}
                            busy={sim.busy}
                            onCheckNow={sim.checkNow}
                        />
                    ) : null}

                    {contentView === 'logs' ? (
                        <LogsView entries={panel.logs} logFiles={panel.log_files} />
                    ) : null}

                    {contentView === 'api' ? (
                        <ApiView
                            keys={sim.apiKeys}
                            endpoints={panel.api_docs}
                            onCreate={sim.createApiKey}
                            onRevoke={sim.revokeApiKey}
                        />
                    ) : null}

                    {contentView === 'users' ? (
                        <UsersView
                            users={sim.users}
                            permissionOptions={panel.permission_options}
                            onAdd={sim.addUser}
                            onUpdatePerms={sim.updateUserPerms}
                            onViewAs={startViewAs}
                        />
                    ) : null}

                    {contentView === 'support' ? (
                        <SupportView
                            tickets={sim.tickets}
                            onCreate={sim.createTicket}
                            onClose={sim.closeTicket}
                        />
                    ) : null}

                    {contentView === 'docs' ? <DocsView docs={panel.docs} /> : null}

                    {contentView === 'admin' ? (
                        <AdminView
                            audit={sim.audit}
                            users={sim.users}
                            permissionOptions={panel.permission_options}
                            onAdd={sim.addUser}
                            onUpdatePerms={sim.updateUserPerms}
                            onViewAs={startViewAs}
                        />
                    ) : null}

                    {contentView === 'settings' ? (
                        <SettingsView
                            settings={panel.settings}
                            toggles={sim.toggles}
                            onToggle={sim.toggleSetting}
                        />
                    ) : null}

                    {contentView === 'profile' ? (
                        <ProfileView
                            panel={panel}
                            security={sim.security}
                            sessions={sim.sessions}
                            onToggleSecurity={sim.toggleSecurity}
                            onRevokeSession={sim.revokeSession}
                            onToast={sim.pushToast}
                        />
                    ) : null}
                </div>
            </div>

            <ToastStack toasts={sim.toasts} onDismiss={sim.dismissToast} />
        </div>
    );
}
