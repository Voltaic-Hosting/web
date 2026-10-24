<script lang="ts">
    import type { PanelFirewallRule, PanelServer } from '@/data/types';
    import FirewallRulesTable from '../FirewallRulesTable.svelte';
    import PanelCard from '../ui/PanelCard.svelte';
    import PanelSelect from '../ui/PanelSelect.svelte';

    interface Props {
        servers: PanelServer[];
        rules: PanelFirewallRule[];
        selectedId: string;
        onSelect: (id: string) => void;
        onAdd: (rule: Omit<PanelFirewallRule, 'id'>) => void;
        onUpdate: (id: string, patch: Omit<PanelFirewallRule, 'id'>) => void;
        onRemove: (id: string) => void;
    }

    let { servers, rules, selectedId, onSelect, onAdd, onUpdate, onRemove }: Props = $props();

    const filtered = $derived(rules.filter((rule) => rule.serverId === selectedId));
    const selected = $derived(servers.find((server) => server.id === selectedId));
</script>

<PanelCard title="Firewall" meta={selected ? selected.name : 'Select a server'}>
    {#snippet actions()}
        <PanelSelect
            class="panel-select"
            value={selectedId}
            onchange={(event) => onSelect(event.currentTarget.value)}
            aria-label="Server for firewall"
        >
            {#each servers as server (server.id)}
                <option value={server.id}>{server.name} ({server.type})</option>
            {/each}
        </PanelSelect>
    {/snippet}
    <FirewallRulesTable rules={filtered} serverId={selectedId} {onAdd} {onUpdate} {onRemove} />
</PanelCard>
