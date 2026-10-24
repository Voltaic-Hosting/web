<script lang="ts">
    import { ArrowLeft, MessageSquare, MessageSquarePlus, Users } from '@lucide/svelte';
    import type { PanelChatChannel, PanelChatMember, PanelProfile, PanelUser } from '@/data/types';
    import AvatarStack from './ui/AvatarStack.svelte';
    import UserAvatar from './UserAvatar.svelte';

    interface Props {
        profile: PanelProfile;
        users: PanelUser[];
        channels: PanelChatChannel[];
        activeChatId: string;
        unreadChat: number;
        onChannelChange: (id: string) => void;
        onSendChat: (channelId: string, body: string) => void;
        onCreateDirectMessage: (user: PanelUser) => void;
        onCreateGroup: (name: string, memberIds: string[]) => void;
    }

    let {
        profile,
        users,
        channels,
        activeChatId,
        unreadChat,
        onChannelChange,
        onSendChat,
        onCreateDirectMessage,
        onCreateGroup,
    }: Props = $props();

    const kindLabels: Record<PanelChatChannel['kind'], string> = {
        dm: 'Direct message',
        group: 'Group',
        team: 'Team channel',
        support: 'Support',
    };

    function memberForId(channel: PanelChatChannel, memberId: string): PanelChatMember | null {
        return channel.members.find((member) => member.id === memberId) ?? null;
    }

    function channelPeer(channel: PanelChatChannel, selfId: string): PanelChatMember | null {
        if (channel.kind !== 'dm') {
            return null;
        }

        return channel.members.find((member) => member.id !== selfId) ?? null;
    }

    function channelAvatar(channel: PanelChatChannel, selfId: string): PanelChatMember {
        const peer = channelPeer(channel, selfId);
        if (peer) {
            return peer;
        }

        return {
            id: channel.id,
            name: channel.label,
            avatarSeed: channel.id,
        };
    }

    function isGroupLike(channel: PanelChatChannel): boolean {
        return channel.kind !== 'dm';
    }

    let chatDraft = $state('');
    let mobileThreadOpen = $state(false);
    let composerMode = $state<'dm' | 'group' | null>(null);
    let groupName = $state('');
    let groupMembers = $state<string[]>([]);
    let messagesEl = $state<HTMLDivElement | null>(null);

    const activeChat = $derived(
        channels.find((channel) => channel.id === activeChatId) ?? channels[0] ?? null,
    );

    const dmCandidates = $derived(
        users.filter(
            (user) =>
                user.id !== profile.id &&
                !channels.some(
                    (channel) =>
                        channel.kind === 'dm' &&
                        channel.members.some((member) => member.id === user.id),
                ),
        ),
    );

    const groupCandidates = $derived(users.filter((user) => user.id !== profile.id));

    $effect(() => {
        void activeChat?.id;
        void activeChat?.messages.length;
        void mobileThreadOpen;
        const node = messagesEl;
        if (node) {
            node.scrollTop = node.scrollHeight;
        }
    });

    const openChannel = (channelId: string) => {
        onChannelChange(channelId);
        mobileThreadOpen = true;
        composerMode = null;
    };

    const resetComposer = () => {
        composerMode = null;
        groupName = '';
        groupMembers = [];
    };

    const toggleGroupMember = (userId: string) => {
        groupMembers = groupMembers.includes(userId)
            ? groupMembers.filter((id) => id !== userId)
            : [...groupMembers, userId];
    };

    const submitGroup = () => {
        onCreateGroup(groupName, groupMembers);
        resetComposer();
        mobileThreadOpen = true;
    };
</script>

<details class="panel-popover panel-popover--messages">
    <summary
        class="panel-icon-btn"
        aria-label={unreadChat > 0 ? `${unreadChat} unread messages` : 'Open messages'}
    >
        <MessageSquare size={18} aria-hidden="true" />
        {#if unreadChat > 0}
            <span class="panel-icon-btn__badge" aria-hidden="true">{unreadChat}</span>
        {/if}
    </summary>

    <div class="panel-popover__panel panel-popover__panel--chat panel-chat">
        <div class="panel-chat__head">
            <div>
                <p class="panel-popover__title">Messages</p>
                <p class="panel-app__muted">Direct messages, groups, and support</p>
            </div>
            <div class="panel-chat__head-actions">
                <button
                    type="button"
                    class="panel-mini-btn"
                    onclick={() => {
                        composerMode = 'dm';
                        mobileThreadOpen = false;
                    }}
                >
                    <MessageSquarePlus size={14} aria-hidden="true" />
                    <span>DM</span>
                </button>
                <button
                    type="button"
                    class="panel-mini-btn"
                    onclick={() => {
                        composerMode = 'group';
                        mobileThreadOpen = false;
                    }}
                >
                    <Users size={14} aria-hidden="true" />
                    <span>Group</span>
                </button>
            </div>
        </div>

        {#if composerMode}
            <div class="panel-chat__composer">
                <div class="panel-chat__composer-head">
                    <button type="button" class="panel-link-btn" onclick={resetComposer}>
                        Back to inbox
                    </button>
                    <p class="panel-chat__composer-title">
                        {composerMode === 'dm' ? 'Start a direct message' : 'Create a group'}
                    </p>
                </div>

                {#if composerMode === 'dm'}
                    <ul class="panel-chat__picker">
                        {#if dmCandidates.length > 0}
                            {#each dmCandidates as user (user.id)}
                                <li>
                                    <button
                                        type="button"
                                        class="panel-chat__picker-item"
                                        onclick={() => {
                                            onCreateDirectMessage(user);
                                            resetComposer();
                                            mobileThreadOpen = true;
                                        }}
                                    >
                                        <UserAvatar
                                            seed={user.avatarSeed}
                                            name={user.name}
                                            size={36}
                                        />
                                        <span>
                                            <span class="panel-chat__picker-name">{user.name}</span>
                                            <span class="panel-app__muted">
                                                {user.role} · {user.email}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            {/each}
                        {:else}
                            <li class="panel-chat__empty">
                                Everyone on the team already has a DM thread.
                            </li>
                        {/if}
                    </ul>
                {:else}
                    <form
                        class="panel-chat__group-form"
                        onsubmit={(event) => {
                            event.preventDefault();
                            submitGroup();
                        }}
                    >
                        <label class="panel-profile-field">
                            <span>Group name</span>
                            <input
                                class="panel-search"
                                bind:value={groupName}
                                placeholder="Infrastructure on-call"
                            />
                        </label>
                        <fieldset class="panel-chat__member-fieldset">
                            <legend>Add members</legend>
                            <ul class="panel-chat__member-list">
                                {#each groupCandidates as user (user.id)}
                                    <li>
                                        <button
                                            type="button"
                                            class="panel-chat__member-option"
                                            class:is-selected={groupMembers.includes(user.id)}
                                            onclick={() => toggleGroupMember(user.id)}
                                        >
                                            <UserAvatar
                                                seed={user.avatarSeed}
                                                name={user.name}
                                                size={30}
                                            />
                                            <span>
                                                <span class="panel-chat__picker-name">
                                                    {user.name}
                                                </span>
                                                <span class="panel-app__muted">{user.role}</span>
                                            </span>
                                        </button>
                                    </li>
                                {/each}
                            </ul>
                        </fieldset>
                        <button type="submit" class="panel-mini-btn">Create group</button>
                    </form>
                {/if}
            </div>
        {:else}
            <div class="panel-chat__layout" class:is-thread-open={mobileThreadOpen}>
                <aside class="panel-chat__inbox" aria-label="Conversations">
                    <ul class="panel-chat__inbox-list">
                        {#each channels as channel (channel.id)}
                            {@const avatar = channelAvatar(channel, profile.id)}
                            {@const isActive = channel.id === activeChat?.id}
                            {@const groupLike = isGroupLike(channel)}
                            <li>
                                <button
                                    type="button"
                                    class="panel-chat-convo"
                                    class:is-active={isActive}
                                    onclick={() => openChannel(channel.id)}
                                >
                                    {#if groupLike}
                                        <AvatarStack members={channel.members} size={30} max={4} />
                                    {:else}
                                        <UserAvatar
                                            seed={avatar.avatarSeed}
                                            name={avatar.name}
                                            size={38}
                                            color={avatar.avatarColor}
                                        />
                                    {/if}
                                    <span class="panel-chat-convo__body">
                                        <span class="panel-chat-convo__row">
                                            <span class="panel-chat-convo__title">
                                                {channel.label}
                                            </span>
                                            <span class="panel-chat-convo__time panel-mono">
                                                {channel.updated}
                                            </span>
                                        </span>
                                        <span class="panel-chat-convo__row">
                                            <span class="panel-chat-convo__preview">
                                                {channel.preview}
                                            </span>
                                            {#if channel.unread > 0}
                                                <span class="panel-chat-convo__badge">
                                                    {channel.unread}
                                                </span>
                                            {/if}
                                        </span>
                                        <span class="panel-chat-convo__kind">
                                            {kindLabels[channel.kind]}
                                        </span>
                                    </span>
                                </button>
                            </li>
                        {/each}
                    </ul>
                </aside>

                <section class="panel-chat__thread" aria-label="Conversation">
                    {#if activeChat}
                        <header class="panel-chat__thread-head">
                            <button
                                type="button"
                                class="panel-chat__back"
                                aria-label="Back to inbox"
                                onclick={() => (mobileThreadOpen = false)}
                            >
                                <ArrowLeft size={16} aria-hidden="true" />
                            </button>
                            <div class="panel-chat__thread-title">
                                {#if isGroupLike(activeChat)}
                                    <AvatarStack members={activeChat.members} size={34} max={5} />
                                {:else}
                                    <UserAvatar
                                        seed={channelAvatar(activeChat, profile.id).avatarSeed}
                                        name={activeChat.label}
                                        size={34}
                                        color={channelAvatar(activeChat, profile.id).avatarColor}
                                    />
                                {/if}
                                <div>
                                    <p class="panel-chat__thread-name">{activeChat.label}</p>
                                    <p class="panel-app__muted">
                                        {kindLabels[activeChat.kind]} · {activeChat.members.length}
                                        members
                                    </p>
                                </div>
                            </div>
                        </header>

                        <div class="panel-chat__members">
                            <AvatarStack members={activeChat.members} size={28} max={8} />
                        </div>

                        <div bind:this={messagesEl} class="panel-chat__messages" aria-live="polite">
                            {#each activeChat.messages as message (message.id)}
                                {@const author = memberForId(activeChat, message.authorId)}
                                {@const isSelf = message.authorId === profile.id}
                                <article
                                    class="panel-chat-bubble"
                                    class:panel-chat-bubble--self={isSelf}
                                >
                                    {#if !isSelf && author}
                                        <UserAvatar
                                            seed={author.avatarSeed}
                                            name={author.name}
                                            size={30}
                                            color={author.avatarColor}
                                        />
                                    {/if}
                                    <div class="panel-chat-bubble__content">
                                        {#if !isSelf && author}
                                            <p class="panel-chat-bubble__author">{author.name}</p>
                                        {/if}
                                        <p>{message.body}</p>
                                        <p class="panel-chat-bubble__time panel-mono">
                                            {message.time}
                                        </p>
                                    </div>
                                </article>
                            {/each}
                        </div>

                        <form
                            class="panel-chat-compose"
                            onsubmit={(event) => {
                                event.preventDefault();
                                onSendChat(activeChat.id, chatDraft);
                                chatDraft = '';
                            }}
                        >
                            <input
                                class="panel-search"
                                bind:value={chatDraft}
                                placeholder="Message {activeChat.label}"
                                aria-label="Message"
                            />
                            <button type="submit" class="panel-mini-btn">Send</button>
                        </form>
                    {:else}
                        <p class="panel-chat__empty">Select a conversation.</p>
                    {/if}
                </section>
            </div>
        {/if}
    </div>
</details>
