<script lang="ts">
    import type { PanelAuditEntry, PanelConcept, PanelServer } from '@/data/types';
    import ServerTypeIcon from '../ServerTypeIcon.svelte';
    import KindBadge from '../ui/KindBadge.svelte';
    import PanelCard from '../ui/PanelCard.svelte';
    import StatusText from '../ui/StatusText.svelte';
    import UptimeChalks from '../ui/UptimeChalks.svelte';

    interface Props {
        panel: PanelConcept;
        servers: PanelServer[];
        audit: PanelAuditEntry[];
        onNavigate: (view: string) => void;
        onOpenServer: (server: PanelServer) => void;
    }

    let { panel, servers, audit, onNavigate, onOpenServer }: Props = $props();

    const spotlight = $derived(servers.slice(0, 6));
</script>

<div class="panel-stack">
    <div class="panel-stat-grid">
        {#each panel.stats as stat (stat.label)}
            <button
                type="button"
                class="panel-stat panel-stat--clickable"
                onclick={() => onNavigate(stat.nav)}
            >
                <p class="panel-stat__label">{stat.label}</p>
                <p class="panel-stat__value">{stat.value}</p>
                <p class="panel-stat__hint">{stat.hint}</p>
            </button>
        {/each}
    </div>

    <div class="panel-split">
        <PanelCard title="Servers" meta="{servers.length} total">
            <div class="panel-table-wrap">
                <table class="panel-table panel-table--stable">
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
                        {#each spotlight as server (server.id)}
                            <tr>
                                <td>
                                    <button
                                        type="button"
                                        class="panel-row-link"
                                        onclick={() => onOpenServer(server)}
                                    >
                                        <span class="panel-type-icon">
                                            <ServerTypeIcon type={server.type} />
                                        </span>
                                        <span>
                                            <span class="panel-mono">{server.name}</span>
                                            <p class="panel-app__muted">{server.role}</p>
                                        </span>
                                    </button>
                                </td>
                                <td><KindBadge label={server.type} /></td>
                                <td>{server.region}</td>
                                <td><UptimeChalks chalks={server.chalks} /></td>
                                <td class="panel-status-cell">
                                    <StatusText label={server.status} />
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </PanelCard>

        <PanelCard title="Audit log" meta="Recent events">
            <ul class="panel-feed">
                {#each audit.slice(0, 8) as item (`${item.time}-${item.action}-${item.target}`)}
                    <li>
                        <span class="panel-mono">{item.time}</span>
                        {item.action}
                        <span class="panel-mono">{item.target}</span>
                        <p class="panel-app__muted">{item.actor}</p>
                    </li>
                {/each}
            </ul>
        </PanelCard>
    </div>
</div>
