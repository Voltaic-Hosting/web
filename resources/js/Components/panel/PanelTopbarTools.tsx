import { Bell } from 'lucide-react';
import { PanelChatPopover } from '@/Components/panel/PanelChatPopover';
import type { PanelChatChannel, PanelNotification, PanelProfile, PanelUser } from '@/types';

interface PanelTopbarToolsProps {
    clock: Date;
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

export function PanelTopbarTools({
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
}: PanelTopbarToolsProps) {
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

            <PanelChatPopover
                profile={profile}
                users={users}
                channels={chatChannels}
                activeChatId={activeChatId}
                unreadChat={unreadChat}
                onChannelChange={onChatChannelChange}
                onSendChat={onSendChat}
                onCreateDirectMessage={onCreateDirectMessage}
                onCreateGroup={onCreateGroup}
            />

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
                    <div className="panel-popover__footer">
                        <button
                            type="button"
                            className="panel-link-btn panel-link-btn--small"
                            onClick={onClearNotifications}
                            disabled={notifications.length === 0}
                        >
                            Clear all
                        </button>
                    </div>
                </div>
            </details>
        </>
    );
}
