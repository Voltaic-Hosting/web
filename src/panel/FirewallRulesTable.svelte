<script lang="ts">
    import { Check, Pencil, Trash2, X } from '@lucide/svelte';
    import type { PanelFirewallRule } from '@/data/types';
    import PanelSelect from './ui/PanelSelect.svelte';

    type RulePayload = Pick<PanelFirewallRule, 'action' | 'source' | 'dest' | 'proto'>;

    interface Props {
        rules: PanelFirewallRule[];
        serverId: string;
        onAdd: (payload: RulePayload & { serverId: string }) => void;
        onUpdate: (id: string, payload: RulePayload & { serverId: string }) => void;
        onRemove: (id: string) => void;
    }

    let { rules, serverId, onAdd, onUpdate, onRemove }: Props = $props();

    function emptyDraft(): RulePayload {
        return { action: 'Allow', source: '', dest: '', proto: 'TCP' };
    }

    let addDraft = $state<RulePayload>(emptyDraft());
    let editingId = $state<string | null>(null);
    let editDraft = $state<RulePayload>(emptyDraft());

    const startEdit = (rule: PanelFirewallRule) => {
        editingId = rule.id;
        editDraft = {
            action: rule.action,
            source: rule.source,
            dest: rule.dest,
            proto: rule.proto,
        };
    };

    const cancelEdit = () => {
        editingId = null;
        editDraft = emptyDraft();
    };

    const saveEdit = () => {
        if (!editingId || !editDraft.source.trim() || !editDraft.dest.trim()) {
            return;
        }

        onUpdate(editingId, {
            serverId,
            action: editDraft.action,
            source: editDraft.source.trim(),
            dest: editDraft.dest.trim(),
            proto: editDraft.proto,
        });
        cancelEdit();
    };
</script>

<form
    class="panel-fw-form"
    onsubmit={(event) => {
        event.preventDefault();
        if (!addDraft.source.trim() || !addDraft.dest.trim()) {
            return;
        }
        onAdd({
            serverId,
            action: addDraft.action,
            source: addDraft.source.trim(),
            dest: addDraft.dest.trim(),
            proto: addDraft.proto,
        });
        addDraft = emptyDraft();
    }}
>
    <PanelSelect class="panel-select" bind:value={addDraft.action}>
        <option>Allow</option>
        <option>Deny</option>
    </PanelSelect>
    <input class="panel-search" placeholder="Source" bind:value={addDraft.source} />
    <input class="panel-search" placeholder="Dest port" bind:value={addDraft.dest} />
    <PanelSelect class="panel-select" bind:value={addDraft.proto}>
        <option>TCP</option>
        <option>UDP</option>
        <option>Any</option>
    </PanelSelect>
    <button type="submit" class="panel-mini-btn">Add rule</button>
</form>
<div class="panel-table-wrap">
    <table class="panel-table panel-table--fw">
        <thead>
            <tr>
                <th>Action</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Protocol</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {#each rules as rule (rule.id)}
                {@const editing = editingId === rule.id}
                <tr class:is-editing={editing}>
                    <td>
                        {#if editing}
                            <PanelSelect
                                class="panel-select panel-select--compact"
                                bind:value={editDraft.action}
                            >
                                <option>Allow</option>
                                <option>Deny</option>
                            </PanelSelect>
                        {:else}
                            <span class="panel-fw panel-fw--{rule.action.toLowerCase()}"
                                >{rule.action}</span
                            >
                        {/if}
                    </td>
                    <td>
                        {#if editing}
                            <input
                                class="panel-search panel-search--cell"
                                bind:value={editDraft.source}
                            />
                        {:else}
                            {rule.source}
                        {/if}
                    </td>
                    <td>
                        {#if editing}
                            <input
                                class="panel-search panel-search--cell"
                                bind:value={editDraft.dest}
                            />
                        {:else}
                            <span class="panel-mono">{rule.dest}</span>
                        {/if}
                    </td>
                    <td>
                        {#if editing}
                            <PanelSelect
                                class="panel-select panel-select--compact"
                                bind:value={editDraft.proto}
                            >
                                <option>TCP</option>
                                <option>UDP</option>
                                <option>Any</option>
                            </PanelSelect>
                        {:else}
                            {rule.proto}
                        {/if}
                    </td>
                    <td>
                        <div class="panel-table-actions">
                            {#if editing}
                                <button
                                    type="button"
                                    class="panel-icon-btn"
                                    aria-label="Save rule"
                                    onclick={saveEdit}
                                >
                                    <Check size={15} aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    class="panel-icon-btn"
                                    aria-label="Cancel edit"
                                    onclick={cancelEdit}
                                >
                                    <X size={15} aria-hidden="true" />
                                </button>
                            {:else}
                                <button
                                    type="button"
                                    class="panel-icon-btn"
                                    aria-label="Edit rule {rule.source}"
                                    onclick={() => startEdit(rule)}
                                >
                                    <Pencil size={15} aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    class="panel-icon-btn panel-icon-btn--danger"
                                    aria-label="Remove rule {rule.source}"
                                    onclick={() => onRemove(rule.id)}
                                >
                                    <Trash2 size={15} aria-hidden="true" />
                                </button>
                            {/if}
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
