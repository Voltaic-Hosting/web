<script lang="ts">
    import { untrack } from 'svelte';
    import { SvelteMap } from 'svelte/reactivity';
    import type { PanelDocPage } from '@/data/types';

    interface Props {
        docs: PanelDocPage[];
    }

    let { docs }: Props = $props();

    let activeId = $state(untrack(() => docs[0]?.id ?? ''));
    let query = $state('');

    const filtered = $derived.by(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            return docs;
        }
        return docs.filter(
            (doc) =>
                doc.section.toLowerCase().includes(q) ||
                doc.title.toLowerCase().includes(q) ||
                doc.blurb.toLowerCase().includes(q) ||
                doc.body.toLowerCase().includes(q),
        );
    });

    const sections = $derived.by(() => {
        const grouped = new SvelteMap<string, PanelDocPage[]>();
        for (const doc of filtered) {
            const current = grouped.get(doc.section) ?? [];
            current.push(doc);
            grouped.set(doc.section, current);
        }
        return [...grouped.entries()];
    });

    const active = $derived(
        filtered.find((doc) => doc.id === activeId) ?? filtered[0] ?? docs[0] ?? null,
    );
</script>

<div class="panel-docs-shell">
    <aside class="panel-docs-sidebar">
        <div class="panel-docs-sidebar__head">
            <p class="panel-docs-sidebar__title">Documentation</p>
            <input
                class="panel-search"
                type="search"
                bind:value={query}
                placeholder="Search docs"
                aria-label="Search documentation"
            />
        </div>
        <nav class="panel-docs-sidebar__nav" aria-label="Documentation">
            {#each sections as [section, pages] (section)}
                <div class="panel-docs-section">
                    <p class="panel-docs-section__title">{section}</p>
                    <ul class="panel-docs-section__list">
                        {#each pages as doc (doc.id)}
                            <li>
                                <button
                                    type="button"
                                    class="panel-docs-link"
                                    class:is-active={active?.id === doc.id}
                                    onclick={() => (activeId = doc.id)}
                                >
                                    {doc.title}
                                </button>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
            {#if sections.length === 0}
                <p class="panel-app__muted">No docs match that search.</p>
            {/if}
        </nav>
    </aside>
    <article class="panel-docs-article">
        <h3 class="panel-docs-article__title">{active?.title ?? 'Documentation'}</h3>
        <p class="panel-docs-article__lede">{active?.blurb}</p>
        <div class="panel-docs-article__body">
            {#each (active?.body ?? '').split('\n') as line, index (`${index}-${line}`)}
                <p>{line || ' '}</p>
            {/each}
        </div>
    </article>
</div>
