import {
    Download,
    Eye,
    KeyRound,
    Play,
    Plus,
    RotateCcw,
    Square,
    UserPlus,
    Binary,
} from 'lucide-react';
import { Fragment, useMemo, useRef, useState } from 'react';
import { UserAvatar, avatarColorOptions } from '@/Components/panel/avatar';
import { FirewallRulesTable } from '@/Components/panel/FirewallRulesTable';
import { ServerTypeIcon } from '@/Components/panel/icons';
import {
    KindBadge,
    LabeledMeter,
    PanelCard,
    PanelSelect,
    PasswordStrength,
    ServerResourceMeter,
    StatusText,
    ToggleSwitch,
    UptimeChalks,
} from '@/Components/panel/ui';
import type { PanelSimulation, ServerFilter } from '@/Components/panel/usePanelSimulation';
import type { PanelConcept, PanelLocation, PanelProfile, PanelServer, PanelUser } from '@/types';

export function OverviewView({
    panel,
    servers,
    audit,
    onNavigate,
    onOpenServer,
}: {
    panel: PanelConcept;
    servers: PanelServer[];
    audit: PanelSimulation['audit'];
    onNavigate: (view: string) => void;
    onOpenServer: (server: PanelServer) => void;
}) {
    const spotlight = servers.slice(0, 6);

    return (
        <div className="panel-stack">
            <div className="panel-stat-grid">
                {panel.stats.map((stat) => (
                    <button
                        key={stat.label}
                        type="button"
                        className="panel-stat panel-stat--clickable"
                        onClick={() => onNavigate(stat.nav)}
                    >
                        <p className="panel-stat__label">{stat.label}</p>
                        <p className="panel-stat__value">{stat.value}</p>
                        <p className="panel-stat__hint">{stat.hint}</p>
                    </button>
                ))}
            </div>

            <div className="panel-split">
                <PanelCard title="Servers" meta={`${servers.length} total`}>
                    <div className="panel-table-wrap">
                        <table className="panel-table panel-table--stable">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Region</th>
                                    <th>Health</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spotlight.map((server) => (
                                    <tr key={server.id}>
                                        <td>
                                            <button
                                                type="button"
                                                className="panel-row-link"
                                                onClick={() => onOpenServer(server)}
                                            >
                                                <span className="panel-type-icon">
                                                    <ServerTypeIcon type={server.type} />
                                                </span>
                                                <span>
                                                    <span className="panel-mono">
                                                        {server.name}
                                                    </span>
                                                    <p className="panel-app__muted">
                                                        {server.role}
                                                    </p>
                                                </span>
                                            </button>
                                        </td>
                                        <td>
                                            <KindBadge label={server.type} />
                                        </td>
                                        <td>{server.region}</td>
                                        <td>
                                            <UptimeChalks chalks={server.chalks} />
                                        </td>
                                        <td className="panel-status-cell">
                                            <StatusText label={server.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </PanelCard>

                <PanelCard title="Audit log" meta="Recent events">
                    <ul className="panel-feed">
                        {audit.slice(0, 8).map((item) => (
                            <li key={`${item.time}-${item.action}-${item.target}`}>
                                <span className="panel-mono">{item.time}</span> {item.action}{' '}
                                <span className="panel-mono">{item.target}</span>
                                <p className="panel-app__muted">{item.actor}</p>
                            </li>
                        ))}
                    </ul>
                </PanelCard>
            </div>
        </div>
    );
}

export function ServersView({
    servers,
    filter,
    onFilter,
    query,
    onQuery,
    busy,
    onOpen,
    onStart,
    onStop,
    onRestart,
}: {
    servers: PanelServer[];
    filter: ServerFilter;
    onFilter: (value: ServerFilter) => void;
    query: string;
    onQuery: (value: string) => void;
    busy: Record<string, boolean>;
    onOpen: (server: PanelServer) => void;
    onStart: (server: PanelServer) => void;
    onStop: (server: PanelServer) => void;
    onRestart: (server: PanelServer) => void;
}) {
    const filters: ServerFilter[] = ['all', 'Bare metal', 'Container', 'MicroVM', 'Game Servers'];

    return (
        <div className="panel-stack">
            <div className="panel-toolbar">
                <div className="panel-filter-row" role="group" aria-label="Server type">
                    {filters.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={`panel-filter${filter === item ? ' is-active' : ''}`}
                            onClick={() => onFilter(item)}
                        >
                            {item === 'all' ? 'All' : item}
                        </button>
                    ))}
                </div>
                <input
                    className="panel-search"
                    type="search"
                    value={query}
                    onChange={(event) => onQuery(event.target.value)}
                    placeholder="Filter servers"
                    aria-label="Filter servers"
                />
            </div>

            <div className="panel-server-grid">
                {servers.map((server) => {
                    const online = server.status === 'online';
                    return (
                        <article
                            key={server.id}
                            className="panel-server panel-server--clickable"
                            role="button"
                            tabIndex={0}
                            onClick={() => onOpen(server)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    onOpen(server);
                                }
                            }}
                        >
                            <div className="panel-server__top">
                                <div className="panel-row-link panel-row-link--static">
                                    <span className="panel-type-icon" title={server.type}>
                                        <ServerTypeIcon type={server.type} />
                                    </span>
                                    <span>
                                        <p className="panel-mono">{server.name}</p>
                                        <p className="panel-app__muted">
                                            {server.role} · {server.region}
                                        </p>
                                    </span>
                                </div>
                                <div className="panel-server__badges">
                                    <KindBadge label={server.type} />
                                </div>
                            </div>
                            <UptimeChalks chalks={server.chalks} live />
                            <div className="panel-server__meters">
                                <ServerResourceMeter server={server} kind="cpu" />
                                <ServerResourceMeter server={server} kind="ram" />
                                <ServerResourceMeter server={server} kind="disk" />
                            </div>
                            {server.type === 'Game' || server.type === 'Game Servers' ? (
                                <p className="panel-app__muted">
                                    Players{' '}
                                    <span className="panel-mono">
                                        {server.players ?? 0} / {server.slots ?? 0}
                                    </span>
                                </p>
                            ) : null}
                            <div className="panel-server__meta">
                                <StatusText label={server.status} />
                            </div>
                            <div
                                className="panel-action-row"
                                onClick={(event) => event.stopPropagation()}
                                onKeyDown={(event) => event.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    className="panel-mini-btn"
                                    disabled={Boolean(busy[`${server.id}-online`]) || online}
                                    onClick={() => onStart(server)}
                                >
                                    <Play size={14} /> Start
                                </button>
                                <button
                                    type="button"
                                    className="panel-mini-btn"
                                    disabled={
                                        Boolean(busy[`${server.id}-stopped`]) ||
                                        server.status === 'stopped'
                                    }
                                    onClick={() => onStop(server)}
                                >
                                    <Square size={14} /> Stop
                                </button>
                                <button
                                    type="button"
                                    className="panel-mini-btn"
                                    disabled={Boolean(busy[`${server.id}-restart`])}
                                    onClick={() => onRestart(server)}
                                >
                                    <RotateCcw size={14} /> Restart
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

export function FirewallView({
    servers,
    rules,
    selectedId,
    onSelect,
    onAdd,
    onUpdate,
    onRemove,
}: {
    servers: PanelServer[];
    rules: PanelSimulation['firewall'];
    selectedId: string;
    onSelect: (id: string) => void;
    onAdd: PanelSimulation['addFirewallRule'];
    onUpdate: PanelSimulation['updateFirewallRule'];
    onRemove: PanelSimulation['removeFirewallRule'];
}) {
    const filtered = rules.filter((rule) => rule.server_id === selectedId);
    const selected = servers.find((server) => server.id === selectedId);

    return (
        <PanelCard
            title="Firewall"
            meta={selected ? selected.name : 'Select a server'}
            actions={
                <PanelSelect
                    className="panel-select"
                    value={selectedId}
                    onChange={(event) => onSelect(event.target.value)}
                    aria-label="Server for firewall"
                >
                    {servers.map((server) => (
                        <option key={server.id} value={server.id}>
                            {server.name} ({server.type})
                        </option>
                    ))}
                </PanelSelect>
            }
        >
            <FirewallRulesTable
                rules={filtered}
                serverId={selectedId}
                onAdd={onAdd}
                onUpdate={onUpdate}
                onRemove={onRemove}
            />
        </PanelCard>
    );
}

export function BackupsView({
    panel,
    backups,
    servers,
    busy,
    onCreate,
    onDownload,
    onRestore,
}: {
    panel: PanelConcept;
    backups: PanelSimulation['backups'];
    servers: PanelServer[];
    busy: Record<string, boolean>;
    onCreate: (server: PanelServer) => void;
    onDownload: PanelSimulation['downloadBackup'];
    onRestore: PanelSimulation['restoreBackup'];
}) {
    const [serverId, setServerId] = useState(servers[0]?.id ?? '');
    const server = servers.find((item) => item.id === serverId);

    return (
        <PanelCard
            title="Backups"
            meta={`${backups.length} snapshots`}
            actions={
                <div className="panel-action-row">
                    <PanelSelect
                        className="panel-select"
                        value={serverId}
                        onChange={(event) => setServerId(event.target.value)}
                    >
                        {servers.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </PanelSelect>
                    <button
                        type="button"
                        className="panel-mini-btn"
                        disabled={!server || Boolean(busy[`backup-${serverId}`])}
                        onClick={() => server && onCreate(server)}
                    >
                        Create backup
                    </button>
                </div>
            }
        >
            <div className="panel-table-wrap">
                <table className="panel-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Server</th>
                            <th>Size</th>
                            <th>Created</th>
                            <th>Status</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {backups.map((item) => (
                            <tr key={item.id}>
                                <td className="panel-mono">{item.name}</td>
                                <td>
                                    {panel.servers.find(
                                        (serverItem) => serverItem.id === item.server_id,
                                    )?.name ?? item.server_id}
                                </td>
                                <td>{item.size}</td>
                                <td>{item.created}</td>
                                <td>
                                    <StatusText label={item.status} />
                                </td>
                                <td>
                                    <div className="panel-table-actions">
                                        <button
                                            type="button"
                                            className="panel-icon-btn"
                                            aria-label={`Download ${item.name}`}
                                            onClick={() => onDownload(item)}
                                        >
                                            <Download size={15} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            className="panel-mini-btn"
                                            disabled={Boolean(busy[`restore-${item.id}`])}
                                            onClick={() => onRestore(item)}
                                        >
                                            {busy[`restore-${item.id}`] ? 'Restoring…' : 'Restore'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PanelCard>
    );
}

export function LocationsView({
    locations,
    servers,
    onOpenServer,
    onToast,
}: {
    locations: PanelLocation[];
    servers: PanelServer[];
    onOpenServer: (server: PanelServer) => void;
    onToast: (message: string) => void;
}) {
    const [selectedId, setSelectedId] = useState(locations[0]?.id ?? '');
    const [statuses, setStatuses] = useState<Record<string, string>>(() =>
        Object.fromEntries(locations.map((location) => [location.id, location.status])),
    );

    const selected = locations.find((location) => location.id === selectedId) ?? locations[0];
    const localServers = useMemo(
        () => servers.filter((server) => server.location_id === selected?.id),
        [selected?.id, servers],
    );
    const capacity = Number.parseInt(selected?.capacity ?? '0', 10) || 0;

    return (
        <div className="panel-locations-layout panel-split">
            <div className="panel-server-grid">
                {locations.map((location) => {
                    const status = statuses[location.id] ?? location.status;
                    const fill = Number.parseInt(location.capacity, 10) || 0;
                    return (
                        <article
                            key={location.id}
                            className={`panel-server${selectedId === location.id ? ' is-selected' : ''}`}
                        >
                            <button
                                type="button"
                                className="panel-row-link"
                                style={{ width: '100%' }}
                                onClick={() => setSelectedId(location.id)}
                            >
                                <div className="panel-server__top" style={{ width: '100%' }}>
                                    <div>
                                        <p className="panel-mono">{location.code}</p>
                                        <p className="panel-app__muted">
                                            {location.name} · {location.provider}
                                        </p>
                                    </div>
                                    <StatusText label={status} />
                                </div>
                            </button>
                            <LabeledMeter label="Capacity" value={fill} />
                            <div className="panel-server__meta">
                                <span>{location.servers} servers</span>
                                <span>{location.capacity} used</span>
                            </div>
                            <div className="panel-action-row">
                                <button
                                    type="button"
                                    className="panel-mini-btn"
                                    onClick={() => {
                                        setSelectedId(location.id);
                                        onToast(`Probing ${location.code} (concept)`);
                                    }}
                                >
                                    Probe
                                </button>
                                <button
                                    type="button"
                                    className="panel-mini-btn"
                                    onClick={() => {
                                        setStatuses((current) => {
                                            const nextStatus =
                                                current[location.id] === 'maintenance'
                                                    ? 'online'
                                                    : 'maintenance';
                                            return {
                                                ...current,
                                                [location.id]: nextStatus,
                                            };
                                        });
                                        const nextStatus =
                                            statuses[location.id] === 'maintenance'
                                                ? 'online'
                                                : 'maintenance';
                                        onToast(
                                            nextStatus === 'maintenance'
                                                ? `${location.code} marked maintenance`
                                                : `${location.code} back online`,
                                        );
                                    }}
                                >
                                    {status === 'maintenance' ? 'End maintenance' : 'Maintenance'}
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            <PanelCard
                title={selected ? `${selected.code} · ${selected.name}` : 'Location'}
                meta={selected?.provider}
            >
                {selected ? (
                    <div className="panel-location-detail">
                        <LabeledMeter label="Rack capacity" value={capacity} />
                        <div className="panel-location-actions">
                            <button
                                type="button"
                                className="panel-mini-btn"
                                onClick={() => onToast(`Capacity report for ${selected.code}`)}
                            >
                                Capacity report
                            </button>
                            <button
                                type="button"
                                className="panel-mini-btn"
                                onClick={() =>
                                    onToast(`Drain schedule queued for ${selected.code}`)
                                }
                            >
                                Queue drain
                            </button>
                            <button
                                type="button"
                                className="panel-mini-btn"
                                onClick={() =>
                                    onToast(`Network map opened for ${selected.code} (concept)`)
                                }
                            >
                                Network map
                            </button>
                        </div>
                        <div>
                            <p className="panel-stat__label">Servers in this location</p>
                            <ul className="panel-location-servers">
                                {localServers.map((server) => (
                                    <li key={server.id}>
                                        <button type="button" onClick={() => onOpenServer(server)}>
                                            <span className="panel-mono">{server.name}</span>
                                            <StatusText label={server.status} />
                                        </button>
                                    </li>
                                ))}
                                {localServers.length === 0 ? (
                                    <li className="panel-app__muted">No servers mapped here.</li>
                                ) : null}
                            </ul>
                        </div>
                    </div>
                ) : null}
            </PanelCard>
        </div>
    );
}

export function LogsView({
    entries,
    logFiles,
}: {
    entries: PanelConcept['logs'];
    logFiles: string[];
}) {
    const [logfile, setLogfile] = useState(logFiles[0] ?? 'cluster/combined.log');

    const download = () => {
        const blob = new Blob(
            [
                entries
                    .map((entry) => `${entry.time} ${entry.level} ${entry.source} ${entry.message}`)
                    .join('\n'),
            ],
            { type: 'text/plain' },
        );
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = logfile.replace(/\//g, '_') + '.log';
        anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <PanelCard
            title="Raw log viewer"
            meta={logfile}
            actions={
                <div className="panel-action-row">
                    <PanelSelect
                        className="panel-select"
                        value={logfile}
                        onChange={(event) => setLogfile(event.target.value)}
                        aria-label="Log file"
                    >
                        {logFiles.map((file) => (
                            <option key={file} value={file}>
                                {file}
                            </option>
                        ))}
                    </PanelSelect>
                    <button
                        type="button"
                        className="panel-icon-btn"
                        onClick={download}
                        aria-label="Download log"
                    >
                        <Download size={16} />
                    </button>
                </div>
            }
        >
            <pre className="panel-raw-log">
                {entries.map((entry) => (
                    <span key={`${entry.time}-${entry.message}`} className="panel-raw-log__line">
                        <span className="panel-mono">{entry.time}</span>{' '}
                        <span className={`panel-log__level panel-log__level--${entry.level}`}>
                            {entry.level}
                        </span>{' '}
                        <span className="panel-mono">{entry.source}</span> {entry.message}
                        {'\n'}
                    </span>
                ))}
            </pre>
        </PanelCard>
    );
}

export function UsersView({
    users,
    permissionOptions,
    onAdd,
    onUpdatePerms,
    onViewAs,
}: {
    users: PanelUser[];
    permissionOptions: string[];
    onAdd: PanelSimulation['addUser'];
    onUpdatePerms: PanelSimulation['updateUserPerms'];
    onViewAs?: (user: PanelUser) => void;
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Operator');
    const [perms, setPerms] = useState<string[]>(['servers']);
    const [editId, setEditId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) {
            return users;
        }
        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(q) ||
                user.email.toLowerCase().includes(q) ||
                user.role.toLowerCase().includes(q) ||
                user.perms.join(' ').toLowerCase().includes(q),
        );
    }, [search, users]);

    return (
        <PanelCard
            title="Users"
            meta={`${filtered.length} of ${users.length}`}
            actions={
                <div className="panel-action-row">
                    <input
                        className="panel-search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search users"
                        aria-label="Search users"
                    />
                    <button
                        type="button"
                        className="panel-icon-btn"
                        aria-label="Add user"
                        onClick={() => setOpen((value) => !value)}
                    >
                        <UserPlus size={18} />
                    </button>
                </div>
            }
        >
            {open ? (
                <form
                    className="panel-user-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (!name.trim() || !email.trim()) {
                            return;
                        }
                        onAdd({ name: name.trim(), email: email.trim(), role, perms });
                        setName('');
                        setEmail('');
                        setOpen(false);
                    }}
                >
                    <input
                        className="panel-search"
                        placeholder="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <input
                        className="panel-search"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <PanelSelect value={role} onChange={(event) => setRole(event.target.value)}>
                        <option>Owner</option>
                        <option>Admin</option>
                        <option>Operator</option>
                        <option>Reseller</option>
                        <option>Read only</option>
                        <option>Service</option>
                    </PanelSelect>
                    <div className="panel-perm-grid">
                        {permissionOptions.map((perm) => (
                            <ToggleSwitch
                                key={perm}
                                label={perm}
                                checked={perms.includes(perm)}
                                onChange={() =>
                                    setPerms((current) =>
                                        current.includes(perm)
                                            ? current.filter((item) => item !== perm)
                                            : [...current, perm],
                                    )
                                }
                            />
                        ))}
                    </div>
                    <button type="submit" className="panel-mini-btn">
                        Invite user
                    </button>
                </form>
            ) : null}

            <div className="panel-table-wrap">
                <table className="panel-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Permissions</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="panel-user-cell">
                                        <UserAvatar
                                            seed={user.avatar_seed}
                                            name={user.name}
                                            size={28}
                                        />
                                        <span>
                                            {user.name}
                                            <p className="panel-mono panel-app__muted">
                                                {user.email}
                                            </p>
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <KindBadge label={user.role} />
                                </td>
                                <td>
                                    <StatusText label={user.status} />
                                </td>
                                <td>{user.perms.join(', ')}</td>
                                <td>
                                    <div className="panel-action-row">
                                        <button
                                            type="button"
                                            className="panel-mini-btn"
                                            onClick={() =>
                                                setEditId(editId === user.id ? null : user.id)
                                            }
                                        >
                                            Permissions
                                        </button>
                                        {onViewAs && user.role !== 'Service' ? (
                                            <button
                                                type="button"
                                                className="panel-mini-btn"
                                                onClick={() => onViewAs(user)}
                                            >
                                                <Eye size={14} /> View as
                                            </button>
                                        ) : null}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5}>No users match that search.</td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>

            {editId ? (
                <div className="panel-perm-grid" style={{ marginTop: '0.85rem' }}>
                    {permissionOptions.map((perm) => {
                        const user = users.find((item) => item.id === editId);
                        if (!user) {
                            return null;
                        }
                        return (
                            <ToggleSwitch
                                key={perm}
                                label={perm}
                                checked={user.perms.includes(perm)}
                                onChange={() => {
                                    const next = user.perms.includes(perm)
                                        ? user.perms.filter((item) => item !== perm)
                                        : [...user.perms, perm];
                                    onUpdatePerms(user.id, next);
                                }}
                            />
                        );
                    })}
                </div>
            ) : null}
        </PanelCard>
    );
}

export function SupportView({
    tickets,
    onCreate,
    onClose,
}: {
    tickets: PanelSimulation['tickets'];
    onCreate: PanelSimulation['createTicket'];
    onClose: PanelSimulation['closeTicket'];
}) {
    const [subject, setSubject] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [body, setBody] = useState('');
    const [selected, setSelected] = useState(tickets[0]?.id ?? '');

    const active = useMemo(
        () => tickets.find((ticket) => ticket.id === selected) ?? tickets[0],
        [selected, tickets],
    );

    return (
        <div className="panel-split">
            <PanelCard title="Tickets" meta={`${tickets.length} recent`}>
                <form
                    className="panel-user-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (!subject.trim()) {
                            return;
                        }
                        onCreate(subject.trim(), priority, body.trim() || 'No details provided.');
                        setSubject('');
                        setBody('');
                    }}
                >
                    <input
                        className="panel-search"
                        placeholder="Subject"
                        value={subject}
                        onChange={(event) => setSubject(event.target.value)}
                    />
                    <PanelSelect
                        className="panel-select"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                    >
                        <option>Low</option>
                        <option>Normal</option>
                        <option>High</option>
                    </PanelSelect>
                    <textarea
                        className="panel-editor"
                        rows={3}
                        placeholder="Details"
                        value={body}
                        onChange={(event) => setBody(event.target.value)}
                    />
                    <button type="submit" className="panel-mini-btn">
                        <Plus size={14} /> Open ticket
                    </button>
                </form>
                <div className="panel-table-wrap">
                    <table className="panel-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Subject</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>
                                        <button
                                            type="button"
                                            className="panel-row-link panel-mono"
                                            onClick={() => setSelected(ticket.id)}
                                        >
                                            #{ticket.id}
                                        </button>
                                    </td>
                                    <td>{ticket.subject}</td>
                                    <td>
                                        <StatusText label={ticket.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PanelCard>

            <PanelCard title={active ? `#${active.id}` : 'Ticket'} meta={active?.updated}>
                {active ? (
                    <>
                        <p>{active.subject}</p>
                        <p className="panel-app__muted" style={{ marginTop: '0.5rem' }}>
                            Priority {active.priority}
                        </p>
                        <p style={{ marginTop: '0.85rem', lineHeight: 1.5 }}>{active.body}</p>
                        <div className="panel-action-row" style={{ marginTop: '1rem' }}>
                            {active.status !== 'resolved' ? (
                                <button
                                    type="button"
                                    className="panel-mini-btn"
                                    onClick={() => onClose(active.id)}
                                >
                                    Close ticket
                                </button>
                            ) : (
                                <StatusText label="resolved" />
                            )}
                        </div>
                    </>
                ) : null}
            </PanelCard>
        </div>
    );
}

export function DocsView({ docs }: { docs: PanelConcept['docs'] }) {
    const [activeId, setActiveId] = useState(docs[0]?.id ?? '');
    const [query, setQuery] = useState('');
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            return docs;
        }
        return docs.filter(
            (doc) =>
                doc.section.toLowerCase().includes(q) ||
                doc.title.toLowerCase().includes(q) ||
                doc.blurb.toLowerCase().includes(q) ||
                doc.body.toLowerCase().includes(q),
        );
    }, [docs, query]);

    const sections = useMemo(() => {
        const grouped = new Map<string, PanelConcept['docs']>();
        for (const doc of filtered) {
            const current = grouped.get(doc.section) ?? [];
            current.push(doc);
            grouped.set(doc.section, current);
        }
        return [...grouped.entries()];
    }, [filtered]);

    const active = filtered.find((doc) => doc.id === activeId) ?? filtered[0] ?? docs[0] ?? null;

    return (
        <div className="panel-docs-shell">
            <aside className="panel-docs-sidebar">
                <div className="panel-docs-sidebar__head">
                    <p className="panel-docs-sidebar__title">Documentation</p>
                    <input
                        className="panel-search"
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search docs"
                        aria-label="Search documentation"
                    />
                </div>
                <nav className="panel-docs-sidebar__nav" aria-label="Documentation">
                    {sections.map(([section, pages]) => (
                        <div key={section} className="panel-docs-section">
                            <p className="panel-docs-section__title">{section}</p>
                            <ul className="panel-docs-section__list">
                                {pages.map((doc) => (
                                    <li key={doc.id}>
                                        <button
                                            type="button"
                                            className={`panel-docs-link${active?.id === doc.id ? ' is-active' : ''}`}
                                            onClick={() => setActiveId(doc.id)}
                                        >
                                            {doc.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {sections.length === 0 ? (
                        <p className="panel-app__muted">No docs match that search.</p>
                    ) : null}
                </nav>
            </aside>
            <article className="panel-docs-article">
                <p className="panel-docs-article__eyebrow">{active?.section}</p>
                <h3 className="panel-docs-article__title">{active?.title ?? 'Documentation'}</h3>
                <p className="panel-docs-article__lede">{active?.blurb}</p>
                <div className="panel-docs-article__body">
                    {(active?.body ?? '').split('\n').map((line, index) => (
                        <p key={`${index}-${line}`}>{line || '\u00a0'}</p>
                    ))}
                </div>
            </article>
        </div>
    );
}

export function ApiView({
    keys,
    endpoints,
    onCreate,
    onRevoke,
}: {
    keys: PanelSimulation['apiKeys'];
    endpoints: PanelConcept['api_docs'];
    onCreate: PanelSimulation['createApiKey'];
    onRevoke: PanelSimulation['revokeApiKey'];
}) {
    const [name, setName] = useState('');
    const [openId, setOpenId] = useState<string | null>(keys[0]?.id ?? null);

    return (
        <div className="panel-stack">
            <PanelCard
                title="API keys"
                meta={`${keys.length} active`}
                actions={
                    <form
                        className="panel-action-row"
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (!name.trim()) {
                                return;
                            }
                            onCreate(name.trim());
                            setName('');
                        }}
                    >
                        <input
                            className="panel-search"
                            placeholder="Key name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                        <button type="submit" className="panel-mini-btn">
                            <KeyRound size={14} /> Create
                        </button>
                    </form>
                }
            >
                <div className="panel-api-keys">
                    {keys.map((key) => {
                        const open = openId === key.id;
                        return (
                            <details
                                key={key.id}
                                className="panel-api-key"
                                open={open}
                                onToggle={(event) => {
                                    if (event.currentTarget.open) {
                                        setOpenId(key.id);
                                    } else if (openId === key.id) {
                                        setOpenId(null);
                                    }
                                }}
                            >
                                <summary className="panel-api-key__summary">
                                    <span>
                                        <strong>{key.name}</strong>
                                        <span className="panel-mono panel-app__muted">
                                            {' '}
                                            {key.prefix}…
                                        </span>
                                    </span>
                                    <span className="panel-app__muted">
                                        {key.last_used}
                                        {key.last_ip !== '—' ? ` · ${key.last_ip}` : ''}
                                    </span>
                                </summary>
                                <div className="panel-api-key__body">
                                    <div className="panel-settings-list">
                                        <div className="panel-setting">
                                            <p className="panel-setting__label">Created</p>
                                            <p className="panel-mono">{key.created}</p>
                                        </div>
                                        <div className="panel-setting">
                                            <p className="panel-setting__label">Last used</p>
                                            <p className="panel-mono">{key.last_used}</p>
                                        </div>
                                        <div className="panel-setting">
                                            <p className="panel-setting__label">Last IP</p>
                                            <p className="panel-mono">{key.last_ip}</p>
                                        </div>
                                        <div className="panel-setting">
                                            <p className="panel-setting__label">Scopes</p>
                                            <p>{key.scopes.join(', ')}</p>
                                        </div>
                                    </div>
                                    <div
                                        className="panel-action-row"
                                        style={{ marginTop: '0.75rem' }}
                                    >
                                        <button
                                            type="button"
                                            className="panel-mini-btn"
                                            onClick={() => onRevoke(key.id)}
                                        >
                                            Revoke
                                        </button>
                                    </div>
                                </div>
                            </details>
                        );
                    })}
                </div>
            </PanelCard>

            <PanelCard title="API reference" meta={`${endpoints.length} endpoints`}>
                <div className="panel-table-wrap">
                    <table className="panel-table">
                        <thead>
                            <tr>
                                <th>Method</th>
                                <th>Path</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {endpoints.map((endpoint) => (
                                <tr key={`${endpoint.method}-${endpoint.path}`}>
                                    <td>
                                        <span
                                            className={`panel-api-method panel-api-method--${endpoint.method.toLowerCase()}`}
                                        >
                                            {endpoint.method}
                                        </span>
                                    </td>
                                    <td className="panel-mono">{endpoint.path}</td>
                                    <td>{endpoint.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="panel-app__muted" style={{ marginTop: '0.85rem' }}>
                    Authenticate with `Authorization: Bearer vt_live_…`. Concept docs only.
                </p>
            </PanelCard>
        </div>
    );
}

export function AdminView({
    audit,
    users,
    permissionOptions,
    onAdd,
    onUpdatePerms,
    onViewAs,
}: {
    audit: PanelSimulation['audit'];
    users: PanelUser[];
    permissionOptions: string[];
    onAdd: PanelSimulation['addUser'];
    onUpdatePerms: PanelSimulation['updateUserPerms'];
    onViewAs?: (user: PanelUser) => void;
}) {
    const [auditQuery, setAuditQuery] = useState('');
    const filteredAudit = useMemo(() => {
        const q = auditQuery.trim().toLowerCase();
        if (!q) {
            return audit;
        }
        return audit.filter(
            (entry) =>
                entry.actor.toLowerCase().includes(q) ||
                entry.action.toLowerCase().includes(q) ||
                entry.target.toLowerCase().includes(q) ||
                entry.ip.toLowerCase().includes(q),
        );
    }, [audit, auditQuery]);

    return (
        <div className="panel-stack">
            <PanelCard
                title="Audit logs"
                meta={`${filteredAudit.length} of ${audit.length}`}
                actions={
                    <input
                        className="panel-search"
                        type="search"
                        value={auditQuery}
                        onChange={(event) => setAuditQuery(event.target.value)}
                        placeholder="Search audit"
                        aria-label="Search audit logs"
                    />
                }
            >
                <div className="panel-table-wrap">
                    <table className="panel-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Actor</th>
                                <th>Action</th>
                                <th>Target</th>
                                <th>IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAudit.map((entry) => (
                                <tr
                                    key={`${entry.time}-${entry.action}-${entry.target}-${entry.ip}`}
                                >
                                    <td className="panel-mono">{entry.time}</td>
                                    <td className="panel-mono">{entry.actor}</td>
                                    <td>{entry.action}</td>
                                    <td className="panel-mono">{entry.target}</td>
                                    <td className="panel-mono">{entry.ip}</td>
                                </tr>
                            ))}
                            {filteredAudit.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>No audit events match that search.</td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </PanelCard>
            <UsersView
                users={users}
                permissionOptions={permissionOptions}
                onAdd={onAdd}
                onUpdatePerms={onUpdatePerms}
                onViewAs={onViewAs}
            />
        </div>
    );
}

export function ProfileView({
    profile,
    panel,
    security,
    sessions,
    onUpdateProfile,
    onUploadAvatar,
    onResetAvatar,
    onToggleSecurity,
    onRevokeSession,
    onToast,
}: {
    profile: PanelProfile;
    panel: PanelConcept;
    security: PanelSimulation['security'];
    sessions: PanelSimulation['sessions'];
    onUpdateProfile: PanelSimulation['updateProfile'];
    onUploadAvatar: PanelSimulation['uploadAvatarImage'];
    onResetAvatar: PanelSimulation['resetAvatar'];
    onToggleSecurity: PanelSimulation['toggleSecurity'];
    onRevokeSession: PanelSimulation['revokeSession'];
    onToast: (message: string) => void;
}) {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [yubikeyVerified, setYubikeyVerified] = useState(false);
    const [passkeyVerified, setPasskeyVerified] = useState(false);
    const [setup, setSetup] = useState<null | 'totp' | 'yubikey' | 'passkey'>(null);
    const [setupCode, setSetupCode] = useState('');
    const [uaOpen, setUaOpen] = useState<string | null>(null);

    const requestAuth = (key: 'totp' | 'yubikey' | 'passkey') => {
        if (security[key]) {
            onToggleSecurity(key);
            setSetup(null);
            return;
        }
        setSetup(key);
        setSetupCode('');
    };

    const completeSetup = () => {
        if (!setup) {
            return;
        }
        if (setup === 'totp' && setupCode.trim().length < 6) {
            onToast('Enter the 6-digit code from your authenticator');
            return;
        }
        if (!security[setup]) {
            onToggleSecurity(setup);
        }
        onToast(
            setup === 'totp'
                ? 'Authenticator app enrolled'
                : setup === 'yubikey'
                  ? 'YubiKey registered'
                  : 'Passkey registered',
        );
        setSetup(null);
        setSetupCode('');
    };

    const passwordChecksPass =
        currentPassword.trim().length > 0 &&
        newPassword.trim().length > 0 &&
        (!security.totp || authCode.trim().length >= 6) &&
        (!security.yubikey || yubikeyVerified) &&
        (!security.passkey || passkeyVerified);

    const submitPasswordChange = () => {
        if (!currentPassword.trim()) {
            onToast('Enter your current password');
            return;
        }
        if (!newPassword.trim()) {
            onToast('Enter a new password');
            return;
        }
        if (security.totp && authCode.trim().length < 6) {
            onToast('Enter the 6-digit code from your authenticator');
            return;
        }
        if (security.yubikey && !yubikeyVerified) {
            onToast('Verify your YubiKey before changing the password');
            return;
        }
        if (security.passkey && !passkeyVerified) {
            onToast('Verify your passkey before changing the password');
            return;
        }
        onToast('Password updated (concept)');
        setCurrentPassword('');
        setNewPassword('');
        setAuthCode('');
        setYubikeyVerified(false);
        setPasskeyVerified(false);
    };

    return (
        <div className="panel-stack">
            <PanelCard title="Profile">
                <div className="panel-profile-edit">
                    <div className="panel-avatar-upload">
                        <input
                            ref={avatarInputRef}
                            className="panel-avatar-upload__input"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                    onUploadAvatar(file);
                                }
                                event.currentTarget.value = '';
                            }}
                        />
                        <button
                            type="button"
                            className="panel-avatar-upload__trigger"
                            aria-label="Change profile photo"
                            onClick={() => avatarInputRef.current?.click()}
                        >
                            <UserAvatar
                                seed={profile.avatar_seed}
                                name={profile.name}
                                size={56}
                                color={profile.avatar_color}
                                imageUrl={profile.avatar_image}
                            />
                            <span className="panel-avatar-upload__overlay">Change</span>
                        </button>
                        <button
                            type="button"
                            className="panel-link-btn panel-avatar-upload__reset"
                            onClick={onResetAvatar}
                        >
                            Reset avatar
                        </button>
                    </div>
                    <div className="panel-profile-edit__fields">
                        <label className="panel-profile-field">
                            <span className="panel-setting__label">Display name</span>
                            <input
                                className="panel-search"
                                value={profile.name}
                                onChange={(event) => onUpdateProfile({ name: event.target.value })}
                            />
                        </label>
                        <label className="panel-profile-field">
                            <span className="panel-setting__label">Email</span>
                            <input
                                className="panel-search"
                                type="email"
                                value={profile.email}
                                onChange={(event) => onUpdateProfile({ email: event.target.value })}
                            />
                        </label>
                        <label className="panel-profile-field">
                            <span className="panel-setting__label">Avatar seed</span>
                            <input
                                className="panel-search"
                                value={profile.avatar_seed}
                                onChange={(event) =>
                                    onUpdateProfile({ avatar_seed: event.target.value })
                                }
                            />
                        </label>
                        <div className="panel-profile-field">
                            <span className="panel-setting__label">Avatar color</span>
                            <div className="panel-avatar-swatches">
                                <button
                                    type="button"
                                    className={`panel-avatar-swatch${profile.avatar_color === null ? ' is-active' : ''}`}
                                    aria-label="Use generated avatar color"
                                    onClick={() => onUpdateProfile({ avatar_color: null })}
                                >
                                    Auto
                                </button>
                                {avatarColorOptions.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`panel-avatar-swatch panel-avatar-swatch--color${profile.avatar_color === color ? ' is-active' : ''}`}
                                        style={{ background: color }}
                                        aria-label={`Use avatar color ${color}`}
                                        onClick={() => onUpdateProfile({ avatar_color: color })}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="panel-app__muted">
                            {profile.role} · {profile.org} · {profile.plan}
                        </p>
                        <p className="panel-app__muted">
                            Changes save automatically in this browser.
                        </p>
                    </div>
                </div>
                <form
                    className="panel-user-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        submitPasswordChange();
                    }}
                >
                    <p className="panel-setting__label">{panel.security.password_hint}</p>
                    <input
                        className="panel-search"
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        autoComplete="current-password"
                    />
                    <input
                        className="panel-search"
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        autoComplete="new-password"
                    />
                    <PasswordStrength password={newPassword} />
                    {security.totp ? (
                        <input
                            className="panel-search"
                            inputMode="numeric"
                            placeholder="Authenticator code"
                            value={authCode}
                            onChange={(event) => setAuthCode(event.target.value)}
                            aria-label="Authenticator code"
                        />
                    ) : null}
                    {security.yubikey ? (
                        <button
                            type="button"
                            className={`panel-mini-btn${yubikeyVerified ? ' is-active' : ''}`}
                            onClick={() => {
                                setYubikeyVerified(true);
                                onToast('YubiKey verified (concept)');
                            }}
                        >
                            {yubikeyVerified ? 'YubiKey verified' : 'Verify YubiKey'}
                        </button>
                    ) : null}
                    {security.passkey ? (
                        <button
                            type="button"
                            className={`panel-mini-btn${passkeyVerified ? ' is-active' : ''}`}
                            onClick={() => {
                                setPasskeyVerified(true);
                                onToast('Passkey verified (concept)');
                            }}
                        >
                            {passkeyVerified ? 'Passkey verified' : 'Verify passkey'}
                        </button>
                    ) : null}
                    <button type="submit" className="panel-mini-btn" disabled={!passwordChecksPass}>
                        Change password
                    </button>
                </form>
            </PanelCard>

            <PanelCard title="Authentication">
                <div className="panel-toggle-list">
                    <ToggleSwitch
                        label="Authenticator app (2FA)"
                        checked={security.totp}
                        onChange={() => requestAuth('totp')}
                    />
                    <ToggleSwitch
                        label="Hardware key (YubiKey)"
                        checked={security.yubikey}
                        onChange={() => requestAuth('yubikey')}
                    />
                    <ToggleSwitch
                        label="Passkey"
                        checked={security.passkey}
                        onChange={() => requestAuth('passkey')}
                    />
                </div>

                {setup ? (
                    <div className="panel-auth-setup">
                        {setup === 'totp' ? (
                            <>
                                <p>
                                    Scan this concept secret in your authenticator app, then enter
                                    the code it shows.
                                </p>
                                <code className="panel-auth-setup__code">VTIC-7K2M-NQ9P-4RHW</code>
                                <input
                                    className="panel-search"
                                    inputMode="numeric"
                                    placeholder="6-digit code"
                                    value={setupCode}
                                    onChange={(event) => setSetupCode(event.target.value)}
                                    aria-label="Authenticator code"
                                />
                            </>
                        ) : null}
                        {setup === 'yubikey' ? (
                            <p>
                                Insert your YubiKey and tap the gold contact when the browser asks
                                for a security key. This is a concept flow only.
                            </p>
                        ) : null}
                        {setup === 'passkey' ? (
                            <p>
                                Use your device unlock (fingerprint, face, or PIN) when the browser
                                prompts for a passkey. This is a concept flow only.
                            </p>
                        ) : null}
                        <div className="panel-action-row">
                            <button
                                type="button"
                                className="panel-mini-btn"
                                onClick={completeSetup}
                            >
                                {setup === 'totp' ? 'Verify and enable' : 'Complete setup'}
                            </button>
                            <button
                                type="button"
                                className="panel-mini-btn"
                                onClick={() => setSetup(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : null}
            </PanelCard>

            <PanelCard title="Browser sessions">
                <div className="panel-table-wrap">
                    <table className="panel-table">
                        <thead>
                            <tr>
                                <th>Device</th>
                                <th>IP</th>
                                <th>Location</th>
                                <th>Active</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session) => (
                                <Fragment key={session.id}>
                                    <tr>
                                        <td>
                                            {session.device}
                                            {session.current ? ' (this device)' : ''}
                                        </td>
                                        <td className="panel-mono">{session.ip}</td>
                                        <td>{session.location}</td>
                                        <td>{session.last_active}</td>
                                        <td>
                                            <div className="panel-session-actions">
                                                <button
                                                    type="button"
                                                    className="panel-icon-btn"
                                                    aria-label={`Show user agent for ${session.device}`}
                                                    aria-expanded={uaOpen === session.id}
                                                    onClick={() =>
                                                        setUaOpen(
                                                            uaOpen === session.id
                                                                ? null
                                                                : session.id,
                                                        )
                                                    }
                                                >
                                                    <Binary size={16} />
                                                </button>
                                                {!session.current ? (
                                                    <button
                                                        type="button"
                                                        className="panel-mini-btn"
                                                        onClick={() => onRevokeSession(session.id)}
                                                    >
                                                        Revoke
                                                    </button>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                    {uaOpen === session.id ? (
                                        <tr className="panel-ua-row">
                                            <td colSpan={5}>{session.user_agent}</td>
                                        </tr>
                                    ) : null}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PanelCard>
        </div>
    );
}

export function SettingsView({
    settings,
    toggles,
    onToggle,
    onResetDefaults,
}: {
    settings: PanelConcept['settings'];
    toggles: PanelSimulation['toggles'];
    onToggle: PanelSimulation['toggleSetting'];
    onResetDefaults: PanelSimulation['resetSettingsDefaults'];
}) {
    return (
        <div className="panel-stack">
            <PanelCard title="Organization">
                <div className="panel-settings-list">
                    {settings.map((item) => (
                        <div key={item.key} className="panel-setting">
                            <p className="panel-setting__label">{item.label}</p>
                            <p className="panel-mono">{item.value}</p>
                        </div>
                    ))}
                </div>
            </PanelCard>
            <PanelCard
                title="Preferences"
                actions={
                    <button type="button" className="panel-mini-btn" onClick={onResetDefaults}>
                        Reset to defaults
                    </button>
                }
            >
                <div className="panel-toggle-list">
                    {toggles.map((item) => (
                        <ToggleSwitch
                            key={item.key}
                            label={item.label}
                            checked={item.enabled}
                            onChange={() => onToggle(item)}
                        />
                    ))}
                </div>
            </PanelCard>
        </div>
    );
}
