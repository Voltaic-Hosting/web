<script lang="ts">
    import { untrack } from 'svelte';
    import type { PanelLocation, PanelServer } from '@/data/types';
    import LabeledMeter from '../ui/LabeledMeter.svelte';
    import PanelCard from '../ui/PanelCard.svelte';
    import StatusText from '../ui/StatusText.svelte';

    interface Props {
        locations: PanelLocation[];
        servers: PanelServer[];
        onOpenServer: (server: PanelServer) => void;
        onToast: (message: string) => void;
    }

    let { locations, servers, onOpenServer, onToast }: Props = $props();

    let selectedId = $state(untrack(() => locations[0]?.id ?? ''));
    let statuses = $state<Record<string, string>>(
        untrack(() =>
            Object.fromEntries(locations.map((location) => [location.id, location.status])),
        ),
    );

    const selected = $derived(
        locations.find((location) => location.id === selectedId) ?? locations[0],
    );
    const localServers = $derived(servers.filter((server) => server.locationId === selected?.id));
    const capacity = $derived(Number.parseInt(selected?.capacity ?? '0', 10) || 0);
</script>

<div class="panel-locations-layout panel-split">
    <div class="panel-server-grid">
        {#each locations as location (location.id)}
            {@const status = statuses[location.id] ?? location.status}
            {@const fill = Number.parseInt(location.capacity, 10) || 0}
            <article class="panel-server" class:is-selected={selectedId === location.id}>
                <button
                    type="button"
                    class="panel-row-link"
                    style="width: 100%"
                    onclick={() => (selectedId = location.id)}
                >
                    <div class="panel-server__top" style="width: 100%">
                        <div>
                            <p class="panel-mono">{location.code}</p>
                            <p class="panel-app__muted">{location.name} · {location.provider}</p>
                        </div>
                        <StatusText label={status} />
                    </div>
                </button>
                <LabeledMeter label="Capacity" value={fill} />
                <div class="panel-server__meta">
                    <span>{location.servers} servers</span>
                    <span>{location.capacity} used</span>
                </div>
                <div class="panel-action-row">
                    <button
                        type="button"
                        class="panel-mini-btn"
                        onclick={() => {
                            selectedId = location.id;
                            onToast(`Probing ${location.code} (concept)`);
                        }}
                    >
                        Probe
                    </button>
                    <button
                        type="button"
                        class="panel-mini-btn"
                        onclick={() => {
                            const nextStatus =
                                statuses[location.id] === 'maintenance' ? 'online' : 'maintenance';
                            statuses = { ...statuses, [location.id]: nextStatus };
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
        {/each}
    </div>

    <PanelCard
        title={selected ? `${selected.code} · ${selected.name}` : 'Location'}
        meta={selected?.provider}
    >
        {#if selected}
            <div class="panel-location-detail">
                <LabeledMeter label="Rack capacity" value={capacity} />
                <div class="panel-location-actions">
                    <button
                        type="button"
                        class="panel-mini-btn"
                        onclick={() => onToast(`Capacity report for ${selected.code}`)}
                    >
                        Capacity report
                    </button>
                    <button
                        type="button"
                        class="panel-mini-btn"
                        onclick={() => onToast(`Drain schedule queued for ${selected.code}`)}
                    >
                        Queue drain
                    </button>
                    <button
                        type="button"
                        class="panel-mini-btn"
                        onclick={() => onToast(`Network map opened for ${selected.code} (concept)`)}
                    >
                        Network map
                    </button>
                </div>
                <div>
                    <p class="panel-stat__label">Servers in this location</p>
                    <ul class="panel-location-servers">
                        {#each localServers as server (server.id)}
                            <li>
                                <button type="button" onclick={() => onOpenServer(server)}>
                                    <span class="panel-mono">{server.name}</span>
                                    <StatusText label={server.status} />
                                </button>
                            </li>
                        {/each}
                        {#if localServers.length === 0}
                            <li class="panel-app__muted">No servers mapped here.</li>
                        {/if}
                    </ul>
                </div>
            </div>
        {/if}
    </PanelCard>
</div>
