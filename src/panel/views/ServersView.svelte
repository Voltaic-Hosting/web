<script lang="ts">
    import { Play, RotateCcw, Square } from '@lucide/svelte';
    import type { PanelServer } from '@/data/types';
    import type { ServerFilter } from '../simulation.svelte';
    import ServerTypeIcon from '../ServerTypeIcon.svelte';
    import KindBadge from '../ui/KindBadge.svelte';
    import ServerResourceMeter from '../ui/ServerResourceMeter.svelte';
    import StatusText from '../ui/StatusText.svelte';
    import UptimeChalks from '../ui/UptimeChalks.svelte';

    interface Props {
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
    }

    let {
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
    }: Props = $props();

    const filters: ServerFilter[] = ['all', 'Bare metal', 'Container', 'MicroVM', 'Game Servers'];
</script>

<div class="panel-stack">
    <div class="panel-toolbar">
        <div class="panel-filter-row" role="group" aria-label="Server type">
            {#each filters as item (item)}
                <button
                    type="button"
                    class="panel-filter"
                    class:is-active={filter === item}
                    onclick={() => onFilter(item)}
                >
                    {item === 'all' ? 'All' : item}
                </button>
            {/each}
        </div>
        <input
            class="panel-search"
            type="search"
            value={query}
            oninput={(event) => onQuery(event.currentTarget.value)}
            placeholder="Filter servers"
            aria-label="Filter servers"
        />
    </div>

    <div class="panel-server-grid">
        {#each servers as server (server.id)}
            {@const online = server.status === 'online'}
            <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
            <article
                class="panel-server panel-server--clickable"
                role="button"
                tabindex="0"
                onclick={() => onOpen(server)}
                onkeydown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onOpen(server);
                    }
                }}
            >
                <div class="panel-server__top">
                    <div class="panel-row-link panel-row-link--static">
                        <span class="panel-type-icon" title={server.type}>
                            <ServerTypeIcon type={server.type} />
                        </span>
                        <span>
                            <p class="panel-mono">{server.name}</p>
                            <p class="panel-app__muted">{server.role} · {server.region}</p>
                        </span>
                    </div>
                    <div class="panel-server__badges">
                        <KindBadge label={server.type} />
                    </div>
                </div>
                <UptimeChalks chalks={server.chalks} live />
                <div class="panel-server__meters">
                    <ServerResourceMeter {server} kind="cpu" />
                    <ServerResourceMeter {server} kind="ram" />
                    <ServerResourceMeter {server} kind="disk" />
                </div>
                {#if server.type === 'Game' || server.type === 'Game Servers'}
                    <p class="panel-app__muted">
                        Players
                        <span class="panel-mono">{server.players ?? 0} / {server.slots ?? 0}</span>
                    </p>
                {/if}
                <div class="panel-server__meta">
                    <StatusText label={server.status} />
                </div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="panel-action-row"
                    onclick={(event) => event.stopPropagation()}
                    onkeydown={(event) => event.stopPropagation()}
                >
                    <button
                        type="button"
                        class="panel-mini-btn"
                        disabled={Boolean(busy[`${server.id}-online`]) || online}
                        onclick={() => onStart(server)}
                    >
                        <Play size={14} /> Start
                    </button>
                    <button
                        type="button"
                        class="panel-mini-btn"
                        disabled={Boolean(busy[`${server.id}-stopped`]) ||
                            server.status === 'stopped'}
                        onclick={() => onStop(server)}
                    >
                        <Square size={14} /> Stop
                    </button>
                    <button
                        type="button"
                        class="panel-mini-btn"
                        disabled={Boolean(busy[`${server.id}-restart`])}
                        onclick={() => onRestart(server)}
                    >
                        <RotateCcw size={14} /> Restart
                    </button>
                </div>
            </article>
        {/each}
    </div>
</div>
