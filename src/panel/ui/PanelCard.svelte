<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        title: string;
        meta?: string;
        actions?: Snippet;
        children: Snippet;
    }

    let { title, meta, actions, children }: Props = $props();
</script>

<section class="panel-card">
    <div class="panel-card__head">
        <h3>{title}</h3>
        <div class="panel-card__head-right">
            {#if meta}
                <span class="panel-app__muted">{meta}</span>
            {/if}
            {@render actions?.()}
        </div>
    </div>
    {@render children()}
</section>
