<script lang="ts">
    interface Props {
        chalks: string[];
        live?: boolean;
    }

    let { chalks, live = false }: Props = $props();

    const slots = $derived(chalks.slice(-8));

    function slotLabel(state: string): string {
        if (state === 'up') {
            return 'Up';
        }
        if (state === 'maintenance') {
            return 'Maintenance';
        }
        return 'Down';
    }
</script>

<div
    class="panel-chalks"
    class:panel-chalks--live={live}
    role="img"
    aria-label="Uptime chalks: {slots.join(', ')}"
>
    {#each slots as state, index (`${index}-${state}`)}
        <span
            class="panel-chalk panel-chalk--{state}"
            title="{slotLabel(state)} · sample {index + 1} of {slots.length}"
        ></span>
    {/each}
</div>
