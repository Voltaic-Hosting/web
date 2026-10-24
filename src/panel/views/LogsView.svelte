<script lang="ts">
    import { untrack } from 'svelte';
    import { Download } from '@lucide/svelte';
    import type { PanelLogEntry } from '@/data/types';
    import PanelCard from '../ui/PanelCard.svelte';
    import PanelSelect from '../ui/PanelSelect.svelte';

    interface Props {
        entries: PanelLogEntry[];
        logFiles: string[];
    }

    let { entries, logFiles }: Props = $props();

    let logfile = $state(untrack(() => logFiles[0]) ?? 'cluster/combined.log');

    const download = () => {
        const blob = new Blob(
            [
                entries
                    .map((entry) => `${entry.time} ${entry.level} ${entry.source} ${entry.message}`)
                    .join('\n'),
            ],
            { type: 'text/plain' },
        );
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = logfile.replace(/\//g, '_') + '.log';
        anchor.click();
        URL.revokeObjectURL(url);
    };
</script>

<PanelCard title="Raw log viewer" meta={logfile}>
    {#snippet actions()}
        <div class="panel-action-row">
            <PanelSelect
                class="panel-select"
                value={logfile}
                onchange={(event) => (logfile = event.currentTarget.value)}
                aria-label="Log file"
            >
                {#each logFiles as file (file)}
                    <option value={file}>{file}</option>
                {/each}
            </PanelSelect>
            <button
                type="button"
                class="panel-icon-btn"
                onclick={download}
                aria-label="Download log"
            >
                <Download size={16} />
            </button>
        </div>
    {/snippet}
    <pre class="panel-raw-log">{#each entries as entry (`${entry.time}-${entry.message}`)}<span
                class="panel-raw-log__line"
                ><span class="panel-mono">{entry.time}</span>
                <span class="panel-log__level panel-log__level--{entry.level}">{entry.level}</span>
                <span class="panel-mono">{entry.source}</span> {entry.message}
            </span>{/each}</pre>
</PanelCard>
