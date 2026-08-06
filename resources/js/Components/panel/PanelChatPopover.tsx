import { useMemo, useState } from 'react';
import { ArrowLeft, MessageSquare, MessageSquarePlus, Users } from 'lucide-react';
import { UserAvatar } from '@/Components/panel/avatar';
import type { PanelChatChannel, PanelChatMember, PanelProfile, PanelUser } from '@/types';

interface PanelChatPopoverProps {
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
        avatar_seed: channel.id,
    };
}

export function PanelChatPopover({
    profile,
    users,
    channels,
    activeChatId,
    unreadChat,
    onChannelChange,
    onSendChat,
    onCreateDirectMessage,
    onCreateGroup,
}: PanelChatPopoverProps) {
    const [chatDraft, setChatDraft] = useState('');
    const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
    const [composerMode, setComposerMode] = useState<'dm' | 'group' | null>(null);
    const [groupName, setGroupName] = useState('');
    const [groupMembers, setGroupMembers] = useState<string[]>([]);

    const activeChat =
        channels.find((channel) => channel.id === activeChatId) ?? channels[0] ?? null;

    const dmCandidates = useMemo(
        () =>
            users.filter(
                (user) =>
                    user.id !== profile.id &&
                    !channels.some(
                        (channel) =>
                            channel.kind === 'dm' &&
                            channel.members.some((member) => member.id === user.id),
                    ),
            ),
        [channels, profile.id, users],
    );

    const groupCandidates = useMemo(
        () => users.filter((user) => user.id !== profile.id),
        [profile.id, users],
    );

    const openChannel = (channelId: string) => {
        onChannelChange(channelId);
        setMobileThreadOpen(true);
        setComposerMode(null);
    };

    const resetComposer = () => {
        setComposerMode(null);
        setGroupName('');
        setGroupMembers([]);
    };

    const submitGroup = () => {
        onCreateGroup(groupName, groupMembers);
        resetComposer();
        setMobileThreadOpen(true);
    };

    return (
        <details className="panel-popover panel-popover--messages">
            <summary className="panel-icon-btn" aria-label="Open messages">
                <MessageSquare size={18} aria-hidden="true" />
                {unreadChat > 0 ? (
                    <span className="panel-icon-btn__badge">{unreadChat}</span>
                ) : null}
            </summary>

            <div className="panel-popover__panel panel-popover__panel--chat panel-chat">
                <div className="panel-chat__head">
                    <div>
                        <p className="panel-popover__title">Messages</p>
                        <p className="panel-app__muted">Direct messages, groups, and support</p>
                    </div>
                    <div className="panel-chat__head-actions">
                        <button
                            type="button"
                            className="panel-mini-btn"
                            onClick={() => {
                                setComposerMode('dm');
                                setMobileThreadOpen(false);
                            }}
                        >
                            <MessageSquarePlus size={14} aria-hidden="true" />
                            <span>DM</span>
                        </button>
                        <button
                            type="button"
                            className="panel-mini-btn"
                            onClick={() => {
                                setComposerMode('group');
                                setMobileThreadOpen(false);
                            }}
                        >
                            <Users size={14} aria-hidden="true" />
                            <span>Group</span>
                        </button>
                    </div>
                </div>

                {composerMode ? (
                    <div className="panel-chat__composer">
                        <div className="panel-chat__composer-head">
                            <button
                                type="button"
                                className="panel-link-btn"
                                onClick={resetComposer}
                            >
                                Back to inbox
                            </button>
                            <p className="panel-chat__composer-title">
                                {composerMode === 'dm'
                                    ? 'Start a direct message'
                                    : 'Create a group'}
                            </p>
                        </div>

                        {composerMode === 'dm' ? (
                            <ul className="panel-chat__picker">
                                {dmCandidates.length > 0 ? (
                                    dmCandidates.map((user) => (
                                        <li key={user.id}>
                                            <button
                                                type="button"
                                                className="panel-chat__picker-item"
                                                onClick={() => {
                                                    onCreateDirectMessage(user);
                                                    resetComposer();
                                                    setMobileThreadOpen(true);
                                                }}
                                            >
                                                <UserAvatar
                                                    seed={user.avatar_seed}
                                                    name={user.name}
                                                    size={36}
                                                />
                                                <span>
                                                    <span className="panel-chat__picker-name">
                                                        {user.name}
                                                    </span>
                                                    <span className="panel-app__muted">
                                                        {user.role} · {user.email}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="panel-chat__empty">
                                        Everyone on the team already has a DM thread.
                                    </li>
                                )}
                            </ul>
                        ) : (
                            <form
                                className="panel-chat__group-form"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    submitGroup();
                                }}
                            >
                                <label className="panel-profile-field">
                                    <span>Group name</span>
                                    <input
                                        className="panel-search"
                                        value={groupName}
                                        onChange={(event) => setGroupName(event.target.value)}
                                        placeholder="Infrastructure on-call"
                                    />
                                </label>
                                <fieldset className="panel-chat__member-fieldset">
                                    <legend>Add members</legend>
                                    <ul className="panel-chat__member-list">
                                        {groupCandidates.map((user) => (
                                            <li key={user.id}>
                                                <label className="panel-chat__member-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={groupMembers.includes(user.id)}
                                                        onChange={(event) => {
                                                            setGroupMembers((current) =>
                                                                event.target.checked
                                                                    ? [...current, user.id]
                                                                    : current.filter(
                                                                          (id) => id !== user.id,
                                                                      ),
                                                            );
                                                        }}
                                                    />
                                                    <UserAvatar
                                                        seed={user.avatar_seed}
                                                        name={user.name}
                                                        size={30}
                                                    />
                                                    <span>
                                                        <span className="panel-chat__picker-name">
                                                            {user.name}
                                                        </span>
                                                        <span className="panel-app__muted">
                                                            {user.role}
                                                        </span>
                                                    </span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </fieldset>
                                <button type="submit" className="panel-mini-btn">
                                    Create group
                                </button>
                            </form>
                        )}
                    </div>
                ) : (
                    <div
                        className={`panel-chat__layout${mobileThreadOpen ? ' is-thread-open' : ''}`}
                    >
                        <aside className="panel-chat__inbox" aria-label="Conversations">
                            <ul className="panel-chat__inbox-list">
                                {channels.map((channel) => {
                                    const avatar = channelAvatar(channel, profile.id);
                                    const isActive = channel.id === activeChat?.id;

                                    return (
                                        <li key={channel.id}>
                                            <button
                                                type="button"
                                                className={`panel-chat-convo${isActive ? ' is-active' : ''}`}
                                                onClick={() => openChannel(channel.id)}
                                            >
                                                <UserAvatar
                                                    seed={avatar.avatar_seed}
                                                    name={avatar.name}
                                                    size={38}
                                                    color={avatar.avatar_color}
                                                />
                                                <span className="panel-chat-convo__body">
                                                    <span className="panel-chat-convo__row">
                                                        <span className="panel-chat-convo__title">
                                                            {channel.label}
                                                        </span>
                                                        <span className="panel-chat-convo__time panel-mono">
                                                            {channel.updated}
                                                        </span>
                                                    </span>
                                                    <span className="panel-chat-convo__row">
                                                        <span className="panel-chat-convo__preview">
                                                            {channel.preview}
                                                        </span>
                                                        {channel.unread > 0 ? (
                                                            <span className="panel-chat-convo__badge">
                                                                {channel.unread}
                                                            </span>
                                                        ) : null}
                                                    </span>
                                                    <span className="panel-chat-convo__kind">
                                                        {kindLabels[channel.kind]}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </aside>

                        <section className="panel-chat__thread" aria-label="Conversation">
                            {activeChat ? (
                                <>
                                    <header className="panel-chat__thread-head">
                                        <button
                                            type="button"
                                            className="panel-chat__back"
                                            aria-label="Back to inbox"
                                            onClick={() => setMobileThreadOpen(false)}
                                        >
                                            <ArrowLeft size={16} aria-hidden="true" />
                                        </button>
                                        <div className="panel-chat__thread-title">
                                            <UserAvatar
                                                seed={
                                                    channelAvatar(activeChat, profile.id)
                                                        .avatar_seed
                                                }
                                                name={activeChat.label}
                                                size={34}
                                                color={
                                                    channelAvatar(activeChat, profile.id)
                                                        .avatar_color
                                                }
                                            />
                                            <div>
                                                <p className="panel-chat__thread-name">
                                                    {activeChat.label}
                                                </p>
                                                <p className="panel-app__muted">
                                                    {kindLabels[activeChat.kind]} ·{' '}
                                                    {activeChat.members.length} members
                                                </p>
                                            </div>
                                        </div>
                                    </header>

                                    <div className="panel-chat__members">
                                        {activeChat.members.map((member) => (
                                            <span key={member.id} className="panel-chat__member">
                                                <UserAvatar
                                                    seed={member.avatar_seed}
                                                    name={member.name}
                                                    size={24}
                                                    color={member.avatar_color}
                                                />
                                                <span>{member.name}</span>
                                            </span>
                                        ))}
                                    </div>

                                    <div className="panel-chat__messages" aria-live="polite">
                                        {activeChat.messages.map((message) => {
                                            const author = memberForId(
                                                activeChat,
                                                message.author_id,
                                            );
                                            const isSelf = message.author_id === profile.id;

                                            return (
                                                <article
                                                    key={message.id}
                                                    className={`panel-chat-bubble${isSelf ? ' panel-chat-bubble--self' : ''}`}
                                                >
                                                    {!isSelf && author ? (
                                                        <UserAvatar
                                                            seed={author.avatar_seed}
                                                            name={author.name}
                                                            size={30}
                                                            color={author.avatar_color}
                                                        />
                                                    ) : null}
                                                    <div className="panel-chat-bubble__content">
                                                        {!isSelf && author ? (
                                                            <p className="panel-chat-bubble__author">
                                                                {author.name}
                                                            </p>
                                                        ) : null}
                                                        <p>{message.body}</p>
                                                        <p className="panel-chat-bubble__time panel-mono">
                                                            {message.time}
                                                        </p>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>

                                    <form
                                        className="panel-chat-compose"
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            onSendChat(activeChat.id, chatDraft);
                                            setChatDraft('');
                                        }}
                                    >
                                        <input
                                            className="panel-search"
                                            value={chatDraft}
                                            onChange={(event) => setChatDraft(event.target.value)}
                                            placeholder={`Message ${activeChat.label}`}
                                            aria-label="Message"
                                        />
                                        <button type="submit" className="panel-mini-btn">
                                            Send
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <p className="panel-chat__empty">Select a conversation.</p>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </details>
    );
}
