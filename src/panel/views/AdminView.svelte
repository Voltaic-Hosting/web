<script lang="ts">
    import type { PanelAuditEntry, PanelUser } from '@/data/types';
    import PanelCard from '../ui/PanelCard.svelte';
    import UsersView from './UsersView.svelte';

    interface Props {
        audit: PanelAuditEntry[];
        users: PanelUser[];
        permissionOptions: string[];
        onAdd: (user: { name: string; email: string; role: string; perms: string[] }) => void;
        onUpdatePerms: (userId: string, perms: string[]) => void;
        onViewAs?: (user: PanelUser) => void;
    }

    let { audit, users, permissionOptions, onAdd, onUpdatePerms, onViewAs }: Props = $props();

    let auditQuery = $state('');

    const filteredAudit = $derived.by(() => {
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
    });
</script>

<div class="panel-stack">
    <PanelCard title="Audit logs" meta="{filteredAudit.length} of {audit.length}">
        {#snippet actions()}
            <input
                class="panel-search"
                type="search"
                bind:value={auditQuery}
                placeholder="Search audit"
                aria-label="Search audit logs"
            />
        {/snippet}
        <div class="panel-table-wrap">
            <table class="panel-table">
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
                    {#each filteredAudit as entry (`${entry.time}-${entry.action}-${entry.target}-${entry.ip}`)}
                        <tr>
                            <td class="panel-mono">{entry.time}</td>
                            <td class="panel-mono">{entry.actor}</td>
                            <td>{entry.action}</td>
                            <td class="panel-mono">{entry.target}</td>
                            <td class="panel-mono">{entry.ip}</td>
                        </tr>
                    {/each}
                    {#if filteredAudit.length === 0}
                        <tr>
                            <td colspan="5">No audit events match that search.</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    </PanelCard>
    <UsersView {users} {permissionOptions} {onAdd} {onUpdatePerms} {onViewAs} />
</div>
