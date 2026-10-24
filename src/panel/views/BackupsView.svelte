<script lang="ts">
    import { untrack } from 'svelte';
    import { Download } from '@lucide/svelte';
    import type { PanelBackup, PanelConcept, PanelServer } from '@/data/types';
    import PanelCard from '../ui/PanelCard.svelte';
    import PanelSelect from '../ui/PanelSelect.svelte';
    import StatusText from '../ui/StatusText.svelte';

    interface Props {
        panel: PanelConcept;
        backups: PanelBackup[];
        servers: PanelServer[];
        busy: Record<string, boolean>;
        onCreate: (server: PanelServer) => void;
        onDownload: (backup: PanelBackup) => void;
        onRestore: (backup: PanelBackup) => void;
    }

    let { panel, backups, servers, busy, onCreate, onDownload, onRestore }: Props = $props();

    let serverId = $state(untrack(() => servers[0]?.id ?? ''));
    const server = $derived(servers.find((item) => item.id === serverId));
</script>

<PanelCard title="Backups" meta="{backups.length} snapshots">
    {#snippet actions()}
        <div class="panel-action-row">
            <PanelSelect
                class="panel-select"
                value={serverId}
                onchange={(event) => (serverId = event.currentTarget.value)}
            >
                {#each servers as item (item.id)}
                    <option value={item.id}>{item.name}</option>
                {/each}
            </PanelSelect>
            <button
                type="button"
                class="panel-mini-btn"
                disabled={!server || Boolean(busy[`backup-${serverId}`])}
                onclick={() => server && onCreate(server)}
            >
                Create backup
            </button>
        </div>
    {/snippet}
    <div class="panel-table-wrap">
        <table class="panel-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Server</th>
                    <th>Size</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {#each backups as item (item.id)}
                    <tr>
                        <td class="panel-mono">{item.name}</td>
                        <td>
                            {panel.servers.find((serverItem) => serverItem.id === item.serverId)
                                ?.name ?? item.serverId}
                        </td>
                        <td>{item.size}</td>
                        <td>{item.created}</td>
                        <td><StatusText label={item.status} /></td>
                        <td>
                            <div class="panel-table-actions">
                                <button
                                    type="button"
                                    class="panel-icon-btn"
                                    aria-label="Download {item.name}"
                                    onclick={() => onDownload(item)}
                                >
                                    <Download size={15} aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    class="panel-mini-btn"
                                    disabled={Boolean(busy[`restore-${item.id}`])}
                                    onclick={() => onRestore(item)}
                                >
                                    {busy[`restore-${item.id}`] ? 'Restoring…' : 'Restore'}
                                </button>
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</PanelCard>
