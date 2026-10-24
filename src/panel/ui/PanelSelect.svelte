<script lang="ts">
    import { ChevronDown } from '@lucide/svelte';
    import type { Snippet } from 'svelte';
    import type { HTMLSelectAttributes } from 'svelte/elements';

    interface Props extends HTMLSelectAttributes {
        children: Snippet;
        class?: string;
        value?: string;
    }

    let { children, class: className = '', value = $bindable(), ...rest }: Props = $props();
</script>

<span class="panel-select-wrap">
    <select class="panel-select{className ? ` ${className}` : ''}" bind:value {...rest}>
        {@render children()}
    </select>
    <ChevronDown class="panel-select__icon" size={14} aria-hidden="true" />
</span>
