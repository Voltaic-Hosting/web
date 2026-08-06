import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { PanelCard, ToggleSwitch } from '@/Components/panel/ui';
import type { PanelNotification, PanelNotificationChannel } from '@/types';

interface NotificationsViewProps {
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

export function NotificationsView({
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
}: NotificationsViewProps) {
    const [pushStatus, setPushStatus] = useState<'idle' | 'granted' | 'denied'>('idle');

    const requestPush = () => {
        if (typeof Notification === 'undefined') {
            onToast('Browser push is not available in this preview');
            return;
        }
        void Notification.requestPermission().then((result) => {
            if (result === 'granted') {
                setPushStatus('granted');
                onToast('Browser push enabled (concept)');
                return;
            }
            setPushStatus('denied');
            onToast('Browser push permission denied');
        });
    };

    return (
        <div className="panel-stack">
            <PanelCard
                title="Delivery channels"
                meta="Email, push, and webhooks"
                actions={
                    <button type="button" className="panel-mini-btn" onClick={onMarkAllRead}>
                        Mark all read
                    </button>
                }
            >
                <div className="panel-toggle-list">
                    {channels.map((channel) => (
                        <ToggleSwitch
                            key={channel.key}
                            label={channel.label}
                            checked={channel.enabled}
                            onChange={() => onToggleChannel(channel.key)}
                        />
                    ))}
                </div>
                <div className="panel-notif-channel-notes">
                    {channels.map((channel) => (
                        <p key={channel.key} className="panel-app__muted">
                            <strong>{channel.label}.</strong> {channel.description}
                        </p>
                    ))}
                </div>
            </PanelCard>

            <div className="panel-split">
                <PanelCard title="Webhook endpoint" meta="JSON POST on panel events">
                    <form
                        className="panel-user-form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            onTestWebhook();
                        }}
                    >
                        <input
                            className="panel-search panel-search--wide"
                            value={webhookUrl}
                            onChange={(event) => onWebhookUrlChange(event.target.value)}
                            placeholder="https://hooks.example.com/voltaic/events"
                            aria-label="Webhook URL"
                        />
                        <div className="panel-action-row">
                            <button type="submit" className="panel-mini-btn">
                                Send test event
                            </button>
                        </div>
                    </form>
                </PanelCard>

                <PanelCard title="Browser push" meta="Live alerts in this browser">
                    <p className="panel-app__muted">
                        Push alerts fire for downtime, failed backups, and security events while you
                        have the panel open.
                    </p>
                    <div className="panel-action-row">
                        <button type="button" className="panel-mini-btn" onClick={requestPush}>
                            {pushStatus === 'granted'
                                ? 'Push enabled'
                                : pushStatus === 'denied'
                                  ? 'Permission denied'
                                  : 'Enable push'}
                        </button>
                    </div>
                </PanelCard>
            </div>

            <PanelCard
                title="Recent notifications"
                meta={`${notifications.length} events`}
                actions={
                    <button
                        type="button"
                        className="panel-icon-btn panel-icon-btn--danger"
                        aria-label="Clear all notifications"
                        onClick={onClearAll}
                        disabled={notifications.length === 0}
                    >
                        <Trash2 size={16} aria-hidden="true" />
                    </button>
                }
            >
                <ul className="panel-notif-feed">
                    {notifications.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                className={`panel-notif-item${item.read ? '' : ' is-unread'}`}
                                onClick={() => onMarkRead(item.id)}
                            >
                                <span className="panel-notif-item__title">{item.title}</span>
                                <span className="panel-notif-item__body">{item.body}</span>
                                <span className="panel-notif-item__meta">
                                    {item.channel} · {item.time}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </PanelCard>
        </div>
    );
}
