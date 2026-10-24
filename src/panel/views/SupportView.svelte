<script lang="ts">
    import { untrack } from 'svelte';
    import { Plus } from '@lucide/svelte';
    import type { PanelTicket } from '@/data/types';
    import PanelCard from '../ui/PanelCard.svelte';
    import PanelSelect from '../ui/PanelSelect.svelte';
    import StatusText from '../ui/StatusText.svelte';

    interface Props {
        tickets: PanelTicket[];
        onCreate: (subject: string, priority: string, body: string) => void;
        onClose: (id: string) => void;
    }

    let { tickets, onCreate, onClose }: Props = $props();

    let subject = $state('');
    let priority = $state('Normal');
    let body = $state('');
    let selected = $state(untrack(() => tickets[0]?.id ?? ''));

    const active = $derived(tickets.find((ticket) => ticket.id === selected) ?? tickets[0]);
</script>

<div class="panel-split">
    <PanelCard title="Tickets" meta="{tickets.length} recent">
        <form
            class="panel-user-form"
            onsubmit={(event) => {
                event.preventDefault();
                if (!subject.trim()) {
                    return;
                }
                onCreate(subject.trim(), priority, body.trim() || 'No details provided.');
                subject = '';
                body = '';
            }}
        >
            <input class="panel-search" placeholder="Subject" bind:value={subject} />
            <PanelSelect
                class="panel-select"
                value={priority}
                onchange={(event) => (priority = event.currentTarget.value)}
            >
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
            </PanelSelect>
            <textarea class="panel-editor" rows="3" placeholder="Details" bind:value={body}
            ></textarea>
            <button type="submit" class="panel-mini-btn"><Plus size={14} /> Open ticket</button>
        </form>
        <div class="panel-table-wrap">
            <table class="panel-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Subject</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {#each tickets as ticket (ticket.id)}
                        <tr>
                            <td>
                                <button
                                    type="button"
                                    class="panel-row-link panel-mono"
                                    onclick={() => (selected = ticket.id)}
                                >
                                    #{ticket.id}
                                </button>
                            </td>
                            <td>{ticket.subject}</td>
                            <td><StatusText label={ticket.status} /></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </PanelCard>

    <PanelCard title={active ? `#${active.id}` : 'Ticket'} meta={active?.updated}>
        {#if active}
            <p>{active.subject}</p>
            <p class="panel-app__muted" style="margin-top: 0.5rem">Priority {active.priority}</p>
            <p style="margin-top: 0.85rem; line-height: 1.5">{active.body}</p>
            <div class="panel-action-row" style="margin-top: 1rem">
                {#if active.status !== 'resolved'}
                    <button type="button" class="panel-mini-btn" onclick={() => onClose(active.id)}>
                        Close ticket
                    </button>
                {:else}
                    <StatusText label="resolved" />
                {/if}
            </div>
        {/if}
    </PanelCard>
</div>
