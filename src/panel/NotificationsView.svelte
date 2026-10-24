<script lang="ts">
    import { Trash2 } from '@lucide/svelte';
    import type { PanelNotification, PanelNotificationChannel } from '@/data/types';
    import PanelCard from './ui/PanelCard.svelte';
    import ToggleSwitch from './ui/ToggleSwitch.svelte';

    interface Props {
        notifications: PanelNotification[];
        channels: PanelNotificationChannel[];
        webhookUrl: string;
        onWebhookUrlChange: (value: string) => void;
        onToggleChannel: (key: PanelNotificationChannel['key']) => void;
        onMarkRead: (id: string) => void;
        onMarkAllRead: () => void;
        onClearAll: () => void;
        onTestWebhook: () => void;
        onToast: (message: string) => void;
    }

    let {
        notifications,
        channels,
        webhookUrl,
        onWebhookUrlChange,
        onToggleChannel,
        onMarkRead,
        onMarkAllRead,
        onClearAll,
        onTestWebhook,
        onToast,
    }: Props = $props();

    let pushStatus = $state<'idle' | 'granted' | 'denied'>('idle');

    const requestPush = () => {
        if (typeof Notification === 'undefined') {
            onToast('Browser push is not available in this preview');
            return;
        }
        void Notification.requestPermission().then((result) => {
            if (result === 'granted') {
                pushStatus = 'granted';
                onToast('Browser push enabled (concept)');
                return;
            }
            pushStatus = 'denied';
            onToast('Browser push permission denied');
        });
    };
</script>

<div class="panel-stack">
    <PanelCard title="Delivery channels" meta="Email, push, and webhooks">
        {#snippet actions()}
            <button type="button" class="panel-mini-btn" onclick={onMarkAllRead}>
                Mark all read
            </button>
        {/snippet}
        <div class="panel-toggle-list">
            {#each channels as channel (channel.key)}
                <ToggleSwitch
                    label={channel.label}
                    checked={channel.enabled}
                    onChange={() => onToggleChannel(channel.key)}
                />
            {/each}
        </div>
        <div class="panel-notif-channel-notes">
            {#each channels as channel (channel.key)}
                <p class="panel-app__muted">
                    <strong>{channel.label}.</strong>
                    {channel.description}
                </p>
            {/each}
        </div>
    </PanelCard>

    <div class="panel-split">
        <PanelCard title="Webhook endpoint" meta="JSON POST on panel events">
            <form
                class="panel-user-form"
                onsubmit={(event) => {
                    event.preventDefault();
                    onTestWebhook();
                }}
            >
                <input
                    class="panel-search panel-search--wide"
                    value={webhookUrl}
                    oninput={(event) => onWebhookUrlChange(event.currentTarget.value)}
                    placeholder="https://hooks.example.com/voltaic/events"
                    aria-label="Webhook URL"
                />
                <div class="panel-action-row">
                    <button type="submit" class="panel-mini-btn">Send test event</button>
                </div>
            </form>
        </PanelCard>

        <PanelCard title="Browser push" meta="Live alerts in this browser">
            <p class="panel-app__muted">
                Push alerts fire for downtime, failed backups, and security events while you have
                the panel open.
            </p>
            <div class="panel-action-row">
                <button type="button" class="panel-mini-btn" onclick={requestPush}>
                    {pushStatus === 'granted'
                        ? 'Push enabled'
                        : pushStatus === 'denied'
                          ? 'Permission denied'
                          : 'Enable push'}
                </button>
            </div>
        </PanelCard>
    </div>

    <PanelCard title="Recent notifications" meta="{notifications.length} events">
        {#snippet actions()}
            <button
                type="button"
                class="panel-icon-btn panel-icon-btn--danger"
                aria-label="Clear all notifications"
                onclick={onClearAll}
                disabled={notifications.length === 0}
            >
                <Trash2 size={16} aria-hidden="true" />
            </button>
        {/snippet}
        <ul class="panel-notif-feed">
            {#each notifications as item (item.id)}
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
    </PanelCard>
</div>
