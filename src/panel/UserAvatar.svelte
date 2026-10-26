<script lang="ts">
    import { hashSeed, palettes } from './avatar';

    interface Props {
        seed: string;
        name: string;
        size?: number;
        color?: string | null;
        imageUrl?: string | null;
    }

    let { seed, name, size = 32, color, imageUrl }: Props = $props();

    const palette = $derived(palettes[hashSeed(seed || name) % palettes.length]);
    const fg = $derived(color ? color : palette[0]);
    const bg = $derived(color ? '#0b0c0f' : palette[1]);
    const initials = $derived(
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join(''),
    );
</script>

{#if imageUrl}
    <span
        class="panel-avatar panel-avatar--image"
        style:width="{size}px"
        style:height="{size}px"
        aria-hidden="true"
        title={name}
    >
        <img src={imageUrl} alt="" width={size} height={size} />
    </span>
{:else}
    <span
        class="panel-avatar"
        style:width="{size}px"
        style:height="{size}px"
        style:background="linear-gradient(135deg, {fg}, {bg})"
        style:font-size="{Math.max(12, size * 0.36)}px"
        aria-hidden="true"
        title={name}
    >
        {initials || '?'}
    </span>
{/if}
