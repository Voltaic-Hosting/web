<script lang="ts">
    import { untrack } from 'svelte';
    import type { PanelUptime, PanelUptimeMonitor } from '@/data/types';
    import HistoryBar from './HistoryBar.svelte';
    import PanelCard from './ui/PanelCard.svelte';
    import StatusText from './ui/StatusText.svelte';

    interface Props {
        uptime: PanelUptime;
        monitors: PanelUptimeMonitor[];
        busy: Record<string, boolean>;
        onCheckNow: (monitor: PanelUptimeMonitor) => void;
    }

    let { uptime, monitors, busy, onCheckNow }: Props = $props();

    let selectedId = $state(untrack(() => monitors[0]?.id ?? ''));
    const selected = $derived(monitors.find((monitor) => monitor.id === selectedId) ?? monitors[0]);
    const spark = $derived(selected ? latencySparkline(selected.latencyMs, selected.status) : []);

    function avgLatency(items: PanelUptimeMonitor[]): number {
        if (items.length === 0) {
            return 0;
        }
        return items.reduce((sum, monitor) => sum + monitor.latencyMs, 0) / items.length;
    }

    function sumErrors(items: PanelUptimeMonitor[]): number {
        return items.reduce((sum, monitor) => sum + monitor.errors24h, 0);
    }

    function latencySparkline(base: number, status: string): number[] {
        return Array.from({ length: 28 }, (_, index) => {
            const wave = Math.sin(index / 2.4) * (status === 'degraded' ? 18 : 8);
            const noise = ((index * 37) % 9) - 4;
            const ms = Math.max(6, base + wave + noise);
            const ceiling = status === 'degraded' ? 420 : 160;
            return Math.round((ms / ceiling) * 100);
        });
    }
</script>

<div class="panel-stack">
    <div class="panel-stat-grid">
        <article class="panel-stat">
            <p class="panel-stat__label">Overall uptime</p>
            <p class="panel-stat__value">{uptime.summary.overall}</p>
            <p class="panel-stat__hint">90 day window</p>
        </article>
        <article class="panel-stat">
            <p class="panel-stat__label">Monitors</p>
            <p class="panel-stat__value">{uptime.summary.monitors}</p>
            <p class="panel-stat__hint">HTTPS, TCP, DNS</p>
        </article>
        <article class="panel-stat">
            <p class="panel-stat__label">Avg latency</p>
            <p class="panel-stat__value">{Math.round(avgLatency(monitors))} ms</p>
            <p class="panel-stat__hint">rolling live sample</p>
        </article>
        <article class="panel-stat">
            <p class="panel-stat__label">Errors (24h)</p>
            <p class="panel-stat__value">{sumErrors(monitors)}</p>
            <p class="panel-stat__hint">{uptime.summary.incidents90d} incidents / 90d</p>
        </article>
    </div>

    <div class="panel-uptime-layout">
        <PanelCard title="Monitors" meta="Click a row for detail">
            <div class="panel-table-wrap">
                <table class="panel-table">
                    <thead>
                        <tr>
                            <th>Monitor</th>
                            <th>90d</th>
                            <th>Latency</th>
                            <th>Errors</th>
                            <th>History</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each monitors as monitor (monitor.id)}
                            <tr
                                class="panel-row-btn"
                                class:is-selected={selected?.id === monitor.id}
                                onclick={() => (selectedId = monitor.id)}
                            >
                                <td>
                                    <p class="panel-monitor-name">{monitor.name}</p>
                                    <p class="panel-mono panel-app__muted">{monitor.target}</p>
                                </td>
                                <td class="panel-mono">{monitor.uptime90d}</td>
                                <td class="panel-mono">{monitor.latencyMs} ms</td>
                                <td class="panel-mono">{monitor.errors24h}</td>
                                <td><HistoryBar history={monitor.history} /></td>
                                <td><StatusText label={monitor.status} /></td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </PanelCard>

        {#if selected}
            <PanelCard title={selected.name} meta={selected.lastCheck}>
                {#snippet actions()}
                    <button
                        type="button"
                        class="panel-app__ghost-btn"
                        disabled={Boolean(busy[`check-${selected.id}`])}
                        onclick={() => onCheckNow(selected)}
                    >
                        {busy[`check-${selected.id}`] ? 'Checking…' : 'Check now'}
                    </button>
                {/snippet}
                <div class="panel-uptime-detail">
                    <div class="panel-uptime-detail__grid">
                        <div>
                            <p class="panel-stat__label">Target</p>
                            <p class="panel-mono">{selected.target}</p>
                        </div>
                        <div>
                            <p class="panel-stat__label">Type</p>
                            <p>{selected.type}</p>
                        </div>
                        <div>
                            <p class="panel-stat__label">Latency</p>
                            <p class="panel-mono">{selected.latencyMs} ms</p>
                        </div>
                        <div>
                            <p class="panel-stat__label">Errors (24h)</p>
                            <p class="panel-mono">{selected.errors24h}</p>
                        </div>
                    </div>

                    <div>
                        <p class="panel-stat__label">Probe regions</p>
                        <div class="panel-chip-row">
                            {#each selected.regions as region (region)}
                                <span class="panel-mini-chip">{region}</span>
                            {/each}
                        </div>
                    </div>

                    <div>
                        <p class="panel-stat__label">90 day availability</p>
                        <HistoryBar history={selected.history} large />
                        <div class="panel-history-legend">
                            <span>
                                <i class="panel-history-swatch panel-history-swatch--up"></i> Up
                            </span>
                            <span>
                                <i class="panel-history-swatch panel-history-swatch--degraded"></i> Degraded
                            </span>
                            <span>
                                <i class="panel-history-swatch panel-history-swatch--down"></i> Down
                            </span>
                        </div>
                        <p class="panel-app__muted" style="margin-top: 0.45rem">
                            Hover a day pill for status, window, and downtime totals.
                        </p>
                    </div>

                    <div>
                        <p class="panel-stat__label">Latency samples</p>
                        <div class="panel-spark" aria-hidden="true">
                            {#each spark as value, index (`${selected.id}-${index}`)}
                                <span style="height: {value}%"></span>
                            {/each}
                        </div>
                        <p class="panel-app__muted">
                            Live jitter around {selected.latencyMs} ms · concept simulation
                        </p>
                    </div>
                </div>
            </PanelCard>
        {/if}
    </div>

    <PanelCard title="Recent incidents" meta="90 days">
        <div class="panel-table-wrap">
            <table class="panel-table">
                <thead>
                    <tr>
                        <th>Monitor</th>
                        <th>Started</th>
                        <th>Duration</th>
                        <th>Error</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    {#each uptime.incidents as incident (incident.id)}
                        <tr>
                            <td>{incident.monitor}</td>
                            <td class="panel-mono">{incident.started}</td>
                            <td class="panel-mono">{incident.duration}</td>
                            <td>{incident.error}</td>
                            <td>
                                <StatusText label={incident.resolved ? 'resolved' : 'open'} />
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </PanelCard>
</div>
