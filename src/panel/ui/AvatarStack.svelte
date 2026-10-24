<script lang="ts">
    import type { PanelChatMember } from '@/data/types';
    import UserAvatar from '../UserAvatar.svelte';

    interface Props {
        members: PanelChatMember[];
        size?: number;
        max?: number;
    }

    let { members, size = 28, max = 5 }: Props = $props();

    const visible = $derived(members.slice(0, max));
    const overflow = $derived(members.length - visible.length);
</script>

<div class="panel-avatar-stack" aria-label="{members.length} members">
    {#each visible as member, index (member.id)}
        <span class="panel-avatar-stack__item" style:z-index={visible.length - index}>
            <UserAvatar
                seed={member.avatarSeed}
                name={member.name}
                {size}
                color={member.avatarColor}
            />
            <span class="panel-avatar-stack__tip" role="tooltip">{member.name}</span>
        </span>
    {/each}
    {#if overflow > 0}
        <span class="panel-avatar-stack__more panel-mono">+{overflow}</span>
    {/if}
</div>
