<script lang="ts">
    import { untrack } from 'svelte';
    import {
        Check,
        Download,
        Pencil,
        Pause,
        Play,
        RotateCcw,
        Square,
        Trash2,
        UserPlus,
        X,
    } from '@lucide/svelte';
    import type { PanelConcept, PanelServer } from '@/data/types';
    import type { PanelSimulation } from './simulation.svelte';
    import FirewallRulesTable from './FirewallRulesTable.svelte';
    import ServerTypeIcon from './ServerTypeIcon.svelte';
    import KindBadge from './ui/KindBadge.svelte';
    import PanelCard from './ui/PanelCard.svelte';
    import PanelSelect from './ui/PanelSelect.svelte';
    import ServerResourceMeter from './ui/ServerResourceMeter.svelte';
    import StatusText from './ui/StatusText.svelte';
    import ToggleSwitch from './ui/ToggleSwitch.svelte';
    import UptimeChalks from './ui/UptimeChalks.svelte';

    type DetailTab = 'console' | 'backups' | 'subusers' | 'sftp' | 'files' | 'firewall';

    interface Props {
        panel: PanelConcept;
        server: PanelServer;
        sim: PanelSimulation;
        onBack: () => void;
    }

    let { panel, server, sim, onBack }: Props = $props();

    let tab = $state<DetailTab>('console');
    let logfile = $state(untrack(() => server.logfiles[0]) ?? 'console.log');
    let filePath = $state<string | null>(null);
    let draft = $state('');
    let subuserEmail = $state('');
    let subuserPerms = $state<string[]>(['console']);
    let subuserFormOpen = $state(false);
    let editingSubuserId = $state<string | null>(null);
    let editSubuserEmail = $state('');
    let editSubuserPerms = $state<string[]>([]);

    const subuserPermissionOptions = [
        'console',
        'files',
        'start',
        'stop',
        'backups',
        'sftp',
    ] as const;

    const logs = $derived(
        panel.logs
            .filter((entry) => entry.source === server.name || entry.source.includes(server.name))
            .concat(
                panel.logs.slice(0, 4).map((entry, index) => ({
                    ...entry,
                    source: server.name,
                    message: `[${logfile}] ${entry.message}`,
                    time: entry.time.replace(/\d$/, String(index)),
                })),
            ),
    );

    const serverBackups = $derived(sim.backups.filter((item) => item.serverId === server.id));
    const subusers = $derived(sim.subusers.filter((item) => item.serverId === server.id));
    const files = $derived(panel.files.filter((item) => item.serverId === server.id));
    const rules = $derived(sim.firewall.filter((item) => item.serverId === server.id));
    const online = $derived(server.status === 'online');
    const paused = $derived(server.status === 'paused');
    const stopped = $derived(server.status === 'stopped');

    const openFile = (path: string) => {
        const key = `${server.id}:${path}`;
        filePath = path;
        draft = panel.fileContents[key] ?? `# ${path}\n# Concept file contents\n`;
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
</script>

<div class="panel-stack">
    <div class="panel-detail-head">
        <button type="button" class="panel-mini-btn" onclick={onBack}>Back to servers</button>
        <div class="panel-detail-head__main">
            <div class="panel-detail-title">
                <span class="panel-type-icon" title={server.type}>
                    <ServerTypeIcon type={server.type} />
                </span>
                <div>
                    <p class="panel-mono">{server.name}</p>
                    <p class="panel-app__muted">
                        {server.role} · {server.region}{server.version
                            ? ` · ${server.version}`
                            : ''}
                    </p>
                </div>
            </div>
            <div class="panel-detail-head__side">
                <KindBadge label={server.type} />
                <StatusText label={server.status} />
                <UptimeChalks chalks={server.chalks} live />
            </div>
        </div>
        <div class="panel-action-row">
            <button
                type="button"
                class="panel-mini-btn"
                disabled={Boolean(sim.busy[`${server.id}-online`]) || online}
                onclick={() => sim.startServer(server)}
            >
                <Play size={14} /> Start
            </button>
            <button
                type="button"
                class="panel-mini-btn"
                disabled={Boolean(sim.busy[`${server.id}-stopped`]) || stopped}
                onclick={() => sim.stopServer(server)}
            >
                <Square size={14} /> Stop
            </button>
            <button
                type="button"
                class="panel-mini-btn"
                disabled={Boolean(sim.busy[`${server.id}-restart`])}
                onclick={() => sim.restartServer(server)}
            >
                <RotateCcw size={14} /> Restart
            </button>
            <button
                type="button"
                class="panel-mini-btn"
                disabled={Boolean(sim.busy[`${server.id}-paused`]) || paused || stopped}
                onclick={() => sim.pauseServer(server)}
            >
                <Pause size={14} /> Pause
            </button>
        </div>
    </div>

    <div class="panel-server__meters panel-detail-meters">
        <ServerResourceMeter {server} kind="cpu" />
        <ServerResourceMeter {server} kind="ram" />
        <ServerResourceMeter {server} kind="disk" />
        {#if server.type === 'Game' || server.type === 'Game Servers'}
            <p class="panel-app__muted">
                Players
                <span class="panel-mono">{server.players ?? 0} / {server.slots ?? 0}</span>
            </p>
        {/if}
    </div>

    <div class="panel-filter-row" role="tablist" aria-label="Server sections">
        {#each [['console', 'Console / Logs'], ['backups', 'Backups'], ['subusers', 'Subusers'], ['sftp', 'SFTP'], ['files', 'Files'], ['firewall', 'Firewall']] as const as [id, label] (id)}
            <button
                type="button"
                role="tab"
                class="panel-filter"
                class:is-active={tab === id}
                onclick={() => (tab = id)}
            >
                {label}
            </button>
        {/each}
    </div>

    {#if tab === 'console'}
        <PanelCard title="Raw logs" meta={logfile}>
            {#snippet actions()}
                <div class="panel-action-row">
                    <PanelSelect
                        class="panel-select"
                        value={logfile}
                        onchange={(event) => (logfile = event.currentTarget.value)}
                        aria-label="Log file"
                    >
                        {#each server.logfiles as file (file)}
                            <option value={file}>{file}</option>
                        {/each}
                    </PanelSelect>
                    <button
                        type="button"
                        class="panel-icon-btn"
                        onclick={downloadLogs}
                        aria-label="Download log"
                    >
                        <Download size={16} />
                    </button>
                </div>
            {/snippet}
            <pre class="panel-raw-log">{#each logs as entry (`${entry.time}-${entry.message}`)}<span
                        class="panel-raw-log__line"
                        ><span class="panel-mono">{entry.time}</span>
                        <span class="panel-log__level panel-log__level--{entry.level}"
                            >{entry.level}</span
                        >
                        {entry.message}
                    </span>{/each}</pre>
        </PanelCard>
    {/if}

    {#if tab === 'backups'}
        <PanelCard title="Backups" meta="{serverBackups.length} snapshots">
            {#snippet actions()}
                <button
                    type="button"
                    class="panel-mini-btn"
                    disabled={Boolean(sim.busy[`backup-${server.id}`])}
                    onclick={() => sim.createBackup(server)}
                >
                    Create backup
                </button>
            {/snippet}
            <div class="panel-table-wrap">
                <table class="panel-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Created</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each serverBackups as item (item.id)}
                            <tr>
                                <td class="panel-mono">{item.name}</td>
                                <td>{item.size}</td>
                                <td>{item.created}</td>
                                <td><StatusText label={item.status} /></td>
                                <td>
                                    <div class="panel-table-actions">
                                        <button
                                            type="button"
                                            class="panel-icon-btn"
                                            aria-label="Download {item.name}"
                                            onclick={() => sim.downloadBackup(item)}
                                        >
                                            <Download size={15} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            class="panel-icon-btn"
                                            aria-label="Restore {item.name}"
                                            disabled={Boolean(sim.busy[`restore-${item.id}`])}
                                            onclick={() => sim.restoreBackup(item)}
                                        >
                                            <RotateCcw size={15} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            class="panel-icon-btn panel-icon-btn--danger"
                                            aria-label="Delete {item.name}"
                                            onclick={() => sim.deleteBackup(item)}
                                        >
                                            <Trash2 size={15} aria-hidden="true" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </PanelCard>
    {/if}

    {#if tab === 'subusers'}
        <PanelCard title="Subusers" meta="{subusers.length} on this server">
            {#snippet actions()}
                <button
                    type="button"
                    class="panel-icon-btn"
                    aria-label="Add subuser"
                    onclick={() => (subuserFormOpen = !subuserFormOpen)}
                >
                    <UserPlus size={18} aria-hidden="true" />
                </button>
            {/snippet}
            {#if subuserFormOpen}
                <form
                    class="panel-user-form"
                    onsubmit={(event) => {
                        event.preventDefault();
                        if (!subuserEmail.trim()) {
                            return;
                        }
                        sim.addSubuser({
                            serverId: server.id,
                            email: subuserEmail.trim(),
                            perms: subuserPerms,
                        });
                        subuserEmail = '';
                        subuserPerms = ['console'];
                        subuserFormOpen = false;
                    }}
                >
                    <input
                        class="panel-search panel-search--wide"
                        type="email"
                        bind:value={subuserEmail}
                        placeholder="subuser@example.com"
                        aria-label="Subuser email"
                    />
                    <div class="panel-toggle-list">
                        {#each subuserPermissionOptions as perm (perm)}
                            <ToggleSwitch
                                label={perm}
                                checked={subuserPerms.includes(perm)}
                                onChange={() => {
                                    subuserPerms = subuserPerms.includes(perm)
                                        ? subuserPerms.filter((item) => item !== perm)
                                        : [...subuserPerms, perm];
                                }}
                            />
                        {/each}
                    </div>
                    <div class="panel-action-row">
                        <button type="submit" class="panel-mini-btn">Add subuser</button>
                        <button
                            type="button"
                            class="panel-mini-btn"
                            onclick={() => (subuserFormOpen = false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            {/if}
            <div class="panel-table-wrap">
                <table class="panel-table panel-table--fw">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Permissions</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each subusers as item (item.id)}
                            {@const editing = editingSubuserId === item.id}
                            <tr class:is-editing={editing}>
                                <td class="panel-mono">
                                    {#if editing}
                                        <input
                                            class="panel-search panel-search--cell"
                                            type="email"
                                            bind:value={editSubuserEmail}
                                        />
                                    {:else}
                                        {item.email}
                                    {/if}
                                </td>
                                <td>
                                    {#if editing}
                                        <div class="panel-toggle-list panel-toggle-list--compact">
                                            {#each subuserPermissionOptions as perm (perm)}
                                                <ToggleSwitch
                                                    label={perm}
                                                    checked={editSubuserPerms.includes(perm)}
                                                    onChange={() => {
                                                        editSubuserPerms =
                                                            editSubuserPerms.includes(perm)
                                                                ? editSubuserPerms.filter(
                                                                      (entry) => entry !== perm,
                                                                  )
                                                                : [...editSubuserPerms, perm];
                                                    }}
                                                />
                                            {/each}
                                        </div>
                                    {:else}
                                        {item.perms.join(', ')}
                                    {/if}
                                </td>
                                <td>
                                    <div class="panel-table-actions">
                                        {#if editing}
                                            <button
                                                type="button"
                                                class="panel-icon-btn"
                                                aria-label="Save subuser"
                                                onclick={() => {
                                                    if (!editSubuserEmail.trim()) {
                                                        return;
                                                    }
                                                    sim.updateSubuser(item.id, {
                                                        email: editSubuserEmail.trim(),
                                                        perms: editSubuserPerms,
                                                    });
                                                    editingSubuserId = null;
                                                }}
                                            >
                                                <Check size={15} aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                class="panel-icon-btn"
                                                aria-label="Cancel edit"
                                                onclick={() => (editingSubuserId = null)}
                                            >
                                                <X size={15} aria-hidden="true" />
                                            </button>
                                        {:else}
                                            <button
                                                type="button"
                                                class="panel-icon-btn"
                                                aria-label="Edit {item.email}"
                                                onclick={() => {
                                                    editingSubuserId = item.id;
                                                    editSubuserEmail = item.email;
                                                    editSubuserPerms = item.perms;
                                                }}
                                            >
                                                <Pencil size={15} aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                class="panel-icon-btn panel-icon-btn--danger"
                                                aria-label="Remove {item.email}"
                                                onclick={() => sim.removeSubuser(item.id)}
                                            >
                                                <Trash2 size={15} aria-hidden="true" />
                                            </button>
                                        {/if}
                                    </div>
                                </td>
                            </tr>
                        {/each}
                        {#if subusers.length === 0}
                            <tr>
                                <td colspan="3">No subusers on this server.</td>
                            </tr>
                        {/if}
                    </tbody>
                </table>
            </div>
        </PanelCard>
    {/if}

    {#if tab === 'sftp'}
        <PanelCard title="SFTP">
            <div class="panel-settings-list">
                <div class="panel-setting">
                    <p class="panel-setting__label">Host</p>
                    <p class="panel-mono">{server.sftp.host}</p>
                </div>
                <div class="panel-setting">
                    <p class="panel-setting__label">Port</p>
                    <p class="panel-mono">{server.sftp.port}</p>
                </div>
                <div class="panel-setting">
                    <p class="panel-setting__label">Username</p>
                    <p class="panel-mono">{server.sftp.user}</p>
                </div>
            </div>
            <div class="panel-action-row" style="margin-top: 0.85rem">
                <button
                    type="button"
                    class="panel-mini-btn"
                    onclick={() => sim.pushToast('SFTP password rotated (concept)')}
                >
                    Rotate password
                </button>
            </div>
        </PanelCard>
    {/if}

    {#if tab === 'files'}
        <div class="panel-files-layout">
            <PanelCard title="Files">
                <ul class="panel-file-list">
                    {#each files as file (file.path)}
                        <li>
                            <button
                                type="button"
                                class="panel-file-link"
                                class:is-active={filePath === file.path}
                                onclick={() =>
                                    file.kind === 'file'
                                        ? openFile(file.path)
                                        : sim.pushToast(`${file.path} is a directory`)}
                            >
                                <span class="panel-mono">{file.path}</span>
                                <span class="panel-app__muted">{file.size}</span>
                            </button>
                        </li>
                    {/each}
                </ul>
            </PanelCard>
            <PanelCard title={filePath ? `Edit ${filePath}` : 'Editor'}>
                {#if filePath}
                    <textarea class="panel-editor panel-editor--tall" bind:value={draft} rows="18"
                    ></textarea>
                    <div class="panel-action-row" style="margin-top: 0.75rem">
                        <button
                            type="button"
                            class="panel-mini-btn"
                            onclick={() => sim.pushToast(`Saved ${filePath}`)}
                        >
                            Save
                        </button>
                    </div>
                {:else}
                    <p class="panel-app__muted">Select a file to edit.</p>
                {/if}
            </PanelCard>
        </div>
    {/if}

    {#if tab === 'firewall'}
        <PanelCard title="Server firewall" meta="{rules.length} rules">
            <FirewallRulesTable
                {rules}
                serverId={server.id}
                onAdd={sim.addFirewallRule}
                onUpdate={sim.updateFirewallRule}
                onRemove={sim.removeFirewallRule}
            />
        </PanelCard>
    {/if}
</div>
