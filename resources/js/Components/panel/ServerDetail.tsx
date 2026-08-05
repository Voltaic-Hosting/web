import { Download, Pause, Play, RotateCcw, Square } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ServerTypeIcon } from '@/Components/panel/icons';
import {
    KindBadge,
    LabeledMeter,
    PanelCard,
    PanelSelect,
    StatusText,
    UptimeChalks,
} from '@/Components/panel/ui';
import type { PanelSimulation } from '@/Components/panel/usePanelSimulation';
import type { PanelConcept, PanelServer } from '@/types';

type DetailTab = 'console' | 'backups' | 'subusers' | 'sftp' | 'files' | 'firewall';

interface ServerDetailProps {
    panel: PanelConcept;
    server: PanelServer;
    sim: PanelSimulation;
    onBack: () => void;
}

export default function ServerDetail({ panel, server, sim, onBack }: ServerDetailProps) {
    const [tab, setTab] = useState<DetailTab>('console');
    const [logfile, setLogfile] = useState(server.logfiles[0] ?? 'console.log');
    const [filePath, setFilePath] = useState<string | null>(null);
    const [draft, setDraft] = useState('');
    const [fwAction, setFwAction] = useState('Allow');
    const [fwSource, setFwSource] = useState('');
    const [fwDest, setFwDest] = useState('');
    const [fwProto, setFwProto] = useState('TCP');

    const logs = useMemo(() => {
        return panel.logs
            .filter((entry) => entry.source === server.name || entry.source.includes(server.name))
            .concat(
                panel.logs.slice(0, 4).map((entry, index) => ({
                    ...entry,
                    source: server.name,
                    message: `[${logfile}] ${entry.message}`,
                    time: entry.time.replace(/\d$/, String(index)),
                })),
            );
    }, [logfile, panel.logs, server.name]);

    const serverBackups = sim.backups.filter((item) => item.server_id === server.id);
    const subusers = panel.subusers.filter((item) => item.server_id === server.id);
    const files = panel.files.filter((item) => item.server_id === server.id);
    const rules = sim.firewall.filter((item) => item.server_id === server.id);
    const online = server.status === 'online';
    const paused = server.status === 'paused';
    const stopped = server.status === 'stopped';

    const openFile = (path: string) => {
        const key = `${server.id}:${path}`;
        setFilePath(path);
        setDraft(panel.file_contents[key] ?? `# ${path}\n# Concept file contents\n`);
    };

    const downloadLogs = () => {
        const blob = new Blob(
            [logs.map((entry) => `${entry.time} ${entry.level} ${entry.message}`).join('\n')],
            { type: 'text/plain' },
        );
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${server.name}-${logfile.replace(/\//g, '_')}.log`;
        anchor.click();
        URL.revokeObjectURL(url);
        sim.pushToast(`Downloaded ${logfile}`);
    };

    return (
        <div className="panel-stack">
            <div className="panel-detail-head">
                <button type="button" className="panel-mini-btn" onClick={onBack}>
                    Back to servers
                </button>
                <div className="panel-detail-head__main">
                    <div className="panel-detail-title">
                        <span className="panel-type-icon" title={server.type}>
                            <ServerTypeIcon type={server.type} />
                        </span>
                        <div>
                            <p className="panel-mono">{server.name}</p>
                            <p className="panel-app__muted">
                                {server.role} · {server.region}
                                {server.version ? ` · ${server.version}` : ''}
                            </p>
                        </div>
                    </div>
                    <div className="panel-detail-head__side">
                        <KindBadge label={server.type} />
                        <StatusText label={server.status} />
                        <UptimeChalks chalks={server.chalks} live />
                    </div>
                </div>
                <div className="panel-action-row">
                    <button
                        type="button"
                        className="panel-mini-btn"
                        disabled={Boolean(sim.busy[`${server.id}-online`]) || online}
                        onClick={() => sim.startServer(server)}
                    >
                        <Play size={14} /> Start
                    </button>
                    <button
                        type="button"
                        className="panel-mini-btn"
                        disabled={Boolean(sim.busy[`${server.id}-stopped`]) || stopped}
                        onClick={() => sim.stopServer(server)}
                    >
                        <Square size={14} /> Stop
                    </button>
                    <button
                        type="button"
                        className="panel-mini-btn"
                        disabled={Boolean(sim.busy[`${server.id}-restart`])}
                        onClick={() => sim.restartServer(server)}
                    >
                        <RotateCcw size={14} /> Restart
                    </button>
                    <button
                        type="button"
                        className="panel-mini-btn"
                        disabled={Boolean(sim.busy[`${server.id}-paused`]) || paused || stopped}
                        onClick={() => sim.pauseServer(server)}
                    >
                        <Pause size={14} /> Pause
                    </button>
                </div>
            </div>

            <div className="panel-server__meters panel-detail-meters">
                <LabeledMeter label="CPU" value={server.cpu} />
                <LabeledMeter label="RAM" value={server.ram} />
                <LabeledMeter label="Disk" value={server.disk} />
                {server.type === 'Game' || server.type === 'Game Servers' ? (
                    <p className="panel-app__muted">
                        Players{' '}
                        <span className="panel-mono">
                            {server.players ?? 0} / {server.slots ?? 0}
                        </span>
                    </p>
                ) : null}
            </div>

            <div className="panel-filter-row" role="tablist" aria-label="Server sections">
                {(
                    [
                        ['console', 'Console / Logs'],
                        ['backups', 'Backups'],
                        ['subusers', 'Subusers'],
                        ['sftp', 'SFTP'],
                        ['files', 'Files'],
                        ['firewall', 'Firewall'],
                    ] as const
                ).map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        className={`panel-filter${tab === id ? ' is-active' : ''}`}
                        onClick={() => setTab(id)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {tab === 'console' ? (
                <PanelCard
                    title="Raw logs"
                    meta={logfile}
                    actions={
                        <div className="panel-action-row">
                            <PanelSelect
                                className="panel-select"
                                value={logfile}
                                onChange={(event) => setLogfile(event.target.value)}
                                aria-label="Log file"
                            >
                                {server.logfiles.map((file) => (
                                    <option key={file} value={file}>
                                        {file}
                                    </option>
                                ))}
                            </PanelSelect>
                            <button
                                type="button"
                                className="panel-icon-btn"
                                onClick={downloadLogs}
                                aria-label="Download log"
                            >
                                <Download size={16} />
                            </button>
                        </div>
                    }
                >
                    <pre className="panel-raw-log">
                        {logs.map((entry) => (
                            <span
                                key={`${entry.time}-${entry.message}`}
                                className="panel-raw-log__line"
                            >
                                <span className="panel-mono">{entry.time}</span>{' '}
                                <span
                                    className={`panel-log__level panel-log__level--${entry.level}`}
                                >
                                    {entry.level}
                                </span>{' '}
                                {entry.message}
                                {'\n'}
                            </span>
                        ))}
                    </pre>
                </PanelCard>
            ) : null}

            {tab === 'backups' ? (
                <PanelCard
                    title="Backups"
                    meta={`${serverBackups.length} snapshots`}
                    actions={
                        <button
                            type="button"
                            className="panel-mini-btn"
                            disabled={Boolean(sim.busy[`backup-${server.id}`])}
                            onClick={() => sim.createBackup(server)}
                        >
                            Create backup
                        </button>
                    }
                >
                    <div className="panel-table-wrap">
                        <table className="panel-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Size</th>
                                    <th>Created</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serverBackups.map((item) => (
                                    <tr key={item.id}>
                                        <td className="panel-mono">{item.name}</td>
                                        <td>{item.size}</td>
                                        <td>{item.created}</td>
                                        <td>
                                            <StatusText label={item.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </PanelCard>
            ) : null}

            {tab === 'subusers' ? (
                <PanelCard title="Subusers" meta={`${subusers.length} on this server`}>
                    <div className="panel-table-wrap">
                        <table className="panel-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Permissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subusers.map((item) => (
                                    <tr key={item.id}>
                                        <td className="panel-mono">{item.email}</td>
                                        <td>{item.perms.join(', ')}</td>
                                    </tr>
                                ))}
                                {subusers.length === 0 ? (
                                    <tr>
                                        <td colSpan={2}>No subusers on this server.</td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </PanelCard>
            ) : null}

            {tab === 'sftp' ? (
                <PanelCard title="SFTP">
                    <div className="panel-settings-list">
                        <div className="panel-setting">
                            <p className="panel-setting__label">Host</p>
                            <p className="panel-mono">{server.sftp.host}</p>
                        </div>
                        <div className="panel-setting">
                            <p className="panel-setting__label">Port</p>
                            <p className="panel-mono">{server.sftp.port}</p>
                        </div>
                        <div className="panel-setting">
                            <p className="panel-setting__label">Username</p>
                            <p className="panel-mono">{server.sftp.user}</p>
                        </div>
                    </div>
                    <div className="panel-action-row" style={{ marginTop: '0.85rem' }}>
                        <button
                            type="button"
                            className="panel-mini-btn"
                            onClick={() => sim.pushToast('SFTP password rotated (concept)')}
                        >
                            Rotate password
                        </button>
                    </div>
                </PanelCard>
            ) : null}

            {tab === 'files' ? (
                <div className="panel-files-layout">
                    <PanelCard title="Files">
                        <ul className="panel-file-list">
                            {files.map((file) => (
                                <li key={file.path}>
                                    <button
                                        type="button"
                                        className={`panel-file-link${filePath === file.path ? ' is-active' : ''}`}
                                        onClick={() =>
                                            file.kind === 'file'
                                                ? openFile(file.path)
                                                : sim.pushToast(`${file.path} is a directory`)
                                        }
                                    >
                                        <span className="panel-mono">{file.path}</span>
                                        <span className="panel-app__muted">{file.size}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </PanelCard>
                    <PanelCard title={filePath ? `Edit ${filePath}` : 'Editor'}>
                        {filePath ? (
                            <>
                                <textarea
                                    className="panel-editor panel-editor--tall"
                                    value={draft}
                                    onChange={(event) => setDraft(event.target.value)}
                                    rows={18}
                                />
                                <div className="panel-action-row" style={{ marginTop: '0.75rem' }}>
                                    <button
                                        type="button"
                                        className="panel-mini-btn"
                                        onClick={() => sim.pushToast(`Saved ${filePath}`)}
                                    >
                                        Save
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="panel-app__muted">Select a file to edit.</p>
                        )}
                    </PanelCard>
                </div>
            ) : null}

            {tab === 'firewall' ? (
                <PanelCard title="Server firewall" meta={`${rules.length} rules`}>
                    <form
                        className="panel-fw-form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (!fwSource.trim() || !fwDest.trim()) {
                                return;
                            }
                            sim.addFirewallRule({
                                server_id: server.id,
                                action: fwAction,
                                source: fwSource.trim(),
                                dest: fwDest.trim(),
                                proto: fwProto,
                            });
                            setFwSource('');
                            setFwDest('');
                        }}
                    >
                        <PanelSelect
                            className="panel-select"
                            value={fwAction}
                            onChange={(event) => setFwAction(event.target.value)}
                        >
                            <option>Allow</option>
                            <option>Deny</option>
                        </PanelSelect>
                        <input
                            className="panel-search"
                            placeholder="Source"
                            value={fwSource}
                            onChange={(event) => setFwSource(event.target.value)}
                        />
                        <input
                            className="panel-search"
                            placeholder="Dest port"
                            value={fwDest}
                            onChange={(event) => setFwDest(event.target.value)}
                        />
                        <PanelSelect
                            className="panel-select"
                            value={fwProto}
                            onChange={(event) => setFwProto(event.target.value)}
                        >
                            <option>TCP</option>
                            <option>UDP</option>
                            <option>Any</option>
                        </PanelSelect>
                        <button type="submit" className="panel-mini-btn">
                            Add rule
                        </button>
                    </form>
                    <div className="panel-table-wrap">
                        <table className="panel-table">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Source</th>
                                    <th>Dest</th>
                                    <th>Proto</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {rules.map((rule) => (
                                    <tr key={rule.id}>
                                        <td>
                                            <span
                                                className={`panel-fw panel-fw--${rule.action.toLowerCase()}`}
                                            >
                                                {rule.action}
                                            </span>
                                        </td>
                                        <td>{rule.source}</td>
                                        <td className="panel-mono">{rule.dest}</td>
                                        <td>{rule.proto}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="panel-mini-btn"
                                                onClick={() => sim.removeFirewallRule(rule.id)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </PanelCard>
            ) : null}
        </div>
    );
}
