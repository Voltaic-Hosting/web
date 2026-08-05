import { useState } from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import type { PanelChatChannel, PanelNotification } from '@/types';

interface PanelTopbarToolsProps {
    clock: Date;
    timezone: string;
    timezones: string[];
    onTimezoneChange: (zone: string) => void;
    notifications: PanelNotification[];
    unreadNotifications: number;
    onMarkRead: (id: string) => void;
    onOpenNotifications: () => void;
    chatChannels: PanelChatChannel[];
    activeChatId: string;
    unreadChat: number;
    onChatChannelChange: (id: string) => void;
    onSendChat: (channelId: string, body: string) => void;
}

export function PanelTopbarTools({
    clock,
    timezone,
    timezones,
    onTimezoneChange,
    notifications,
    unreadNotifications,
    onMarkRead,
    onOpenNotifications,
    chatChannels,
    activeChatId,
    unreadChat,
    onChatChannelChange,
    onSendChat,
}: PanelTopbarToolsProps) {
    const [chatDraft, setChatDraft] = useState('');
    const activeChat =
        chatChannels.find((channel) => channel.id === activeChatId) ?? chatChannels[0] ?? null;

    return (
        <>
            <details className="panel-clock-menu">
                <summary
                    className="panel-app__clock panel-mono"
                    aria-label={`Current time in ${timezone}. Open to change timezone.`}
                >
                    {clock.toLocaleTimeString('en-US', {
                        hour12: false,
                        timeZone: timezone,
                    })}
                </summary>
                <div className="panel-clock-menu__panel" role="listbox" aria-label="Timezone">
                    {timezones.map((zone) => (
                        <button
                            key={zone}
                            type="button"
                            role="option"
                            aria-selected={timezone === zone}
                            className={`panel-clock-menu__zone${timezone === zone ? ' is-active' : ''}`}
                            onClick={(event) => {
                                onTimezoneChange(zone);
                                const details = event.currentTarget.closest('details');
                                if (details) {
                                    details.open = false;
                                }
                            }}
                        >
                            <span>{zone}</span>
                            <span className="panel-clock-menu__zone-time">
                                {clock.toLocaleTimeString('en-US', {
                                    hour12: false,
                                    timeZone: zone,
                                })}
                            </span>
                        </button>
                    ))}
                </div>
            </details>

            <details className="panel-popover">
                <summary className="panel-icon-btn" aria-label="Open chat">
                    <MessageSquare size={18} aria-hidden="true" />
                    {unreadChat > 0 ? (
                        <span className="panel-icon-btn__badge">{unreadChat}</span>
                    ) : null}
                </summary>
                <div className="panel-popover__panel panel-popover__panel--chat">
                    <div className="panel-popover__head">
                        <p className="panel-popover__title">Chat</p>
                        <p className="panel-app__muted">Teams, groups, and support</p>
                    </div>
                    <div className="panel-chat-tabs" role="tablist" aria-label="Chat channels">
                        {chatChannels.map((channel) => (
                            <button
                                key={channel.id}
                                type="button"
                                role="tab"
                                aria-selected={activeChat?.id === channel.id}
                                className={`panel-chat-tab${activeChat?.id === channel.id ? ' is-active' : ''}`}
                                onClick={() => onChatChannelChange(channel.id)}
                            >
                                <span>{channel.label}</span>
                                {channel.unread > 0 ? (
                                    <span className="panel-chat-tab__badge">{channel.unread}</span>
                                ) : null}
                            </button>
                        ))}
                    </div>
                    <div className="panel-chat-messages" aria-live="polite">
                        {activeChat?.messages.map((message) => (
                            <article key={message.id} className="panel-chat-message">
                                <p className="panel-chat-message__meta">
                                    <span>{message.author}</span>
                                    <span className="panel-mono">{message.time}</span>
                                </p>
                                <p>{message.body}</p>
                            </article>
                        ))}
                    </div>
                    <form
                        className="panel-chat-compose"
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (!activeChat) {
                                return;
                            }
                            onSendChat(activeChat.id, chatDraft);
                            setChatDraft('');
                        }}
                    >
                        <input
                            className="panel-search"
                            value={chatDraft}
                            onChange={(event) => setChatDraft(event.target.value)}
                            placeholder={`Message ${activeChat?.label ?? 'channel'}`}
                            aria-label="Chat message"
                        />
                        <button type="submit" className="panel-mini-btn">
                            Send
                        </button>
                    </form>
                </div>
            </details>

            <details className="panel-popover">
                <summary className="panel-icon-btn" aria-label="Open notifications">
                    <Bell size={18} aria-hidden="true" />
                    {unreadNotifications > 0 ? (
                        <span className="panel-icon-btn__badge">{unreadNotifications}</span>
                    ) : null}
                </summary>
                <div className="panel-popover__panel">
                    <div className="panel-popover__head">
                        <p className="panel-popover__title">Notifications</p>
                        <button
                            type="button"
                            className="panel-link-btn"
                            onClick={onOpenNotifications}
                        >
                            Open settings
                        </button>
                    </div>
                    <ul className="panel-notif-list">
                        {notifications.slice(0, 5).map((item) => (
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
                </div>
            </details>
        </>
    );
}
