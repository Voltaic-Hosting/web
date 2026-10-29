<script lang="ts">
    import { Bell } from '@lucide/svelte';
    import type {
        PanelChatChannel,
        PanelNotification,
        PanelProfile,
        PanelUser,
    } from '@/data/types';
    import PanelChatPopover from './PanelChatPopover.svelte';

    interface Props {
        clock: Date | null;
        timezone: string;
        timezones: string[];
        onTimezoneChange: (zone: string) => void;
        notifications: PanelNotification[];
        unreadNotifications: number;
        onMarkRead: (id: string) => void;
        onOpenNotifications: () => void;
        onClearNotifications: () => void;
        profile: PanelProfile;
        users: PanelUser[];
        chatChannels: PanelChatChannel[];
        activeChatId: string;
        unreadChat: number;
        onChatChannelChange: (id: string) => void;
        onSendChat: (channelId: string, body: string) => void;
        onCreateDirectMessage: (user: PanelUser) => void;
        onCreateGroup: (name: string, memberIds: string[]) => void;
    }

    let {
        clock,
        timezone,
        timezones,
        onTimezoneChange,
        notifications,
        unreadNotifications,
        onMarkRead,
        onOpenNotifications,
        onClearNotifications,
        profile,
        users,
        chatChannels,
        activeChatId,
        unreadChat,
        onChatChannelChange,
        onSendChat,
        onCreateDirectMessage,
        onCreateGroup,
    }: Props = $props();

    const timeIn = (zone: string) =>
        clock?.toLocaleTimeString('en-US', { hour12: false, timeZone: zone }) ?? '';
</script>

<details class="panel-clock-menu">
    <summary
        class="panel-app__clock panel-mono"
        aria-label="Current time in {timezone}. Open to change timezone."
    >
        <span class="panel-app__clock-time">{timeIn(timezone)}</span>
    </summary>
    <div class="panel-clock-menu__panel" role="listbox" aria-label="Timezone">
        {#each timezones as zone (zone)}
            <button
                type="button"
                role="option"
                aria-selected={timezone === zone}
                class="panel-clock-menu__zone"
                class:is-active={timezone === zone}
                onclick={(event) => {
                    onTimezoneChange(zone);
                    const details = event.currentTarget.closest('details');
                    if (details) {
                        details.open = false;
                    }
                }}
            >
                <span>{zone}</span>
                <span class="panel-clock-menu__zone-time">{timeIn(zone)}</span>
            </button>
        {/each}
    </div>
</details>

<PanelChatPopover
    {profile}
    {users}
    channels={chatChannels}
    {activeChatId}
    {unreadChat}
    onChannelChange={onChatChannelChange}
    {onSendChat}
    {onCreateDirectMessage}
    {onCreateGroup}
/>

<details class="panel-popover">
    <summary
        class="panel-icon-btn"
        aria-label={unreadNotifications > 0
            ? `${unreadNotifications} unread notifications`
            : 'Open notifications'}
    >
        <Bell size={18} aria-hidden="true" />
        {#if unreadNotifications > 0}
            <span class="panel-icon-btn__badge" aria-hidden="true">{unreadNotifications}</span>
        {/if}
    </summary>
    <div class="panel-popover__panel">
        <div class="panel-popover__head">
            <p class="panel-popover__title">Notifications</p>
            <button type="button" class="panel-link-btn" onclick={onOpenNotifications}>
                Open settings
            </button>
        </div>
        <ul class="panel-notif-list">
            {#each notifications.slice(0, 5) as item (item.id)}
                <li>
                    <button
                        type="button"
                        class="panel-notif-item"
                        class:is-unread={!item.read}
                        onclick={() => onMarkRead(item.id)}
                    >
                        <span class="panel-notif-item__title">{item.title}</span>
                        <span class="panel-notif-item__body">{item.body}</span>
                        <span class="panel-notif-item__meta">{item.channel} · {item.time}</span>
                    </button>
                </li>
            {/each}
        </ul>
        <div class="panel-popover__footer">
            <button
                type="button"
                class="panel-link-btn panel-link-btn--small"
                onclick={onClearNotifications}
                disabled={notifications.length === 0}
            >
                Clear all
            </button>
        </div>
    </div>
</details>
