<script lang="ts">
    import {
        formatCpuUsage,
        formatDiskUsage,
        formatRamUsage,
        serverResourceTotals,
    } from '../serverResources';
    import type { PanelServer } from '@/data/types';
    import Meter from './Meter.svelte';

    interface Props {
        server: PanelServer;
        kind: 'cpu' | 'ram' | 'disk';
    }

    let { server, kind }: Props = $props();

    const labels = { cpu: 'CPU', ram: 'RAM', disk: 'Storage' } as const;
    const totals = $derived(serverResourceTotals(server));
    const value = $derived(server[kind]);
    const detail = $derived(
        kind === 'cpu'
            ? formatCpuUsage(value, totals.cpuCores)
            : kind === 'ram'
              ? formatRamUsage(value, totals.ramGb)
              : formatDiskUsage(value, totals.diskGb),
    );
</script>

<div class="panel-labeled-meter">
    <div class="panel-labeled-meter__row">
        <span>{labels[kind]}</span>
        <span class="panel-mono">{detail}</span>
    </div>
    <Meter {value} />
</div>
