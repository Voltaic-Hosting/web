<script lang="ts">
    interface Props {
        history: string;
        large?: boolean;
    }

    let { history, large = false }: Props = $props();

    let hoverIndex = $state<number | null>(null);
    let tipStyle = $state('');
    let ticks = $state<Array<HTMLSpanElement | null>>([]);

    const slots = $derived(history.split(''));
    const downTotal = $derived(slots.filter((slot) => slot === 'd').length);
    const degradedTotal = $derived(slots.filter((slot) => slot === 'w').length);
    const upTotal = $derived(slots.length - downTotal - degradedTotal);

    $effect(() => {
        if (hoverIndex === null) {
            return;
        }

        const tick = ticks[hoverIndex];
        if (!tick) {
            return;
        }

        const rect = tick.getBoundingClientRect();
        const tipWidth = 220;
        const tipHeight = 88;
        const margin = 10;
        let left = rect.left + rect.width / 2;
        left = Math.min(
            window.innerWidth - margin - tipWidth / 2,
            Math.max(margin + tipWidth / 2, left),
        );

        let top = rect.top - margin;
        let transform = 'translate(-50%, -100%)';

        if (top - tipHeight < margin) {
            top = rect.bottom + margin;
            transform = 'translate(-50%, 0)';
        }

        tipStyle = `position: fixed; left: ${left}px; top: ${top}px; transform: ${transform}; z-index: 80;`;
    });
</script>

<div
    class="panel-history"
    class:panel-history--large={large}
    onmouseleave={() => (hoverIndex = null)}
    role="presentation"
>
    {#each slots as slot, index (`${slot}-${index}`)}
        {@const kind = slot === 'd' ? 'down' : slot === 'w' ? 'degraded' : 'up'}
        {@const day = slots.length - index}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <span
            bind:this={ticks[index]}
            class="panel-history__tick panel-history__tick--{kind}"
            onmouseenter={() => (hoverIndex = index)}
        >
            {#if hoverIndex === index}
                <span class="panel-history__tip" role="tooltip" style={tipStyle}>
                    <strong>Day -{day} · {kind}</strong>
                    {kind === 'down'
                        ? 'Downtime ~24h in this window'
                        : kind === 'degraded'
                          ? 'Partial outage / high latency'
                          : 'Healthy probes'}
                    <br />
                    Totals: {downTotal}d down · {degradedTotal}d degraded · {upTotal}d up
                </span>
            {/if}
        </span>
    {/each}
</div>
