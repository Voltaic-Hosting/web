<script lang="ts">
    import { Box, Cpu, Gamepad2, Server } from '@lucide/svelte';

    interface Props {
        type: string;
    }

    let { type }: Props = $props();

    const size = 16;
</script>

{#if type === 'Container'}
    <Box {size} aria-hidden="true" />
{:else if type === 'MicroVM'}
    <Cpu {size} aria-hidden="true" />
{:else if type === 'Game' || type === 'Game Servers'}
    <Gamepad2 {size} aria-hidden="true" />
{:else}
    <Server {size} aria-hidden="true" />
{/if}
