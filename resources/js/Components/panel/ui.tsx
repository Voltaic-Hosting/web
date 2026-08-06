import type { ReactNode, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { UserAvatar } from '@/Components/panel/avatar';
import {
    formatCpuUsage,
    formatDiskUsage,
    formatRamUsage,
    serverResourceTotals,
} from '@/Components/panel/serverResources';
import type { PanelChatMember, PanelServer } from '@/types';

export function Meter({ value }: { value: number }) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));

    return (
        <div className="panel-meter" title={`${clamped}%`}>
            <span className="panel-meter__fill" style={{ width: `${clamped}%` }} />
        </div>
    );
}

export function LabeledMeter({ label, value }: { label: string; value: number }) {
    return (
        <div className="panel-labeled-meter">
            <div className="panel-labeled-meter__row">
                <span>{label}</span>
                <span className="panel-mono">{Math.round(value)}%</span>
            </div>
            <Meter value={value} />
        </div>
    );
}

export function ServerResourceMeter({
    server,
    kind,
}: {
    server: PanelServer;
    kind: 'cpu' | 'ram' | 'disk';
}) {
    const totals = serverResourceTotals(server);
    const labels = { cpu: 'CPU', ram: 'RAM', disk: 'Storage' } as const;
    const value = server[kind];
    const detail =
        kind === 'cpu'
            ? formatCpuUsage(value, totals.cpu_cores)
            : kind === 'ram'
              ? formatRamUsage(value, totals.ram_gb)
              : formatDiskUsage(value, totals.disk_gb);

    return (
        <div className="panel-labeled-meter">
            <div className="panel-labeled-meter__row">
                <span>{labels[kind]}</span>
                <span className="panel-mono">{detail}</span>
            </div>
            <Meter value={value} />
        </div>
    );
}

export function AvatarStack({
    members,
    size = 28,
    max = 5,
}: {
    members: PanelChatMember[];
    size?: number;
    max?: number;
}) {
    const visible = members.slice(0, max);
    const overflow = members.length - visible.length;

    return (
        <div className="panel-avatar-stack" aria-label={`${members.length} members`}>
            {visible.map((member, index) => (
                <span
                    key={member.id}
                    className="panel-avatar-stack__item"
                    style={{ zIndex: visible.length - index }}
                >
                    <UserAvatar
                        seed={member.avatar_seed}
                        name={member.name}
                        size={size}
                        color={member.avatar_color}
                    />
                    <span className="panel-avatar-stack__tip" role="tooltip">
                        {member.name}
                    </span>
                </span>
            ))}
            {overflow > 0 ? (
                <span className="panel-avatar-stack__more panel-mono">+{overflow}</span>
            ) : null}
        </div>
    );
}

export function StatusText({ label }: { label: string }) {
    return <span className={`panel-status-text panel-status-text--${label}`}>{label}</span>;
}

export function StatusDot({ label }: { label: string }) {
    return <StatusText label={label} />;
}

export function KindBadge({ label }: { label: string }) {
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    return <span className={`panel-kind panel-kind--${slug}`}>{label}</span>;
}

export function ToggleSwitch({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <label className="panel-switch">
            <span className="panel-switch__label">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={label}
                className={`panel-switch__control${checked ? ' is-on' : ''}`}
                onClick={onChange}
            >
                <span className="panel-switch__thumb" />
            </button>
        </label>
    );
}

export function PasswordStrength({ password }: { password: string }) {
    const { score, label } = scorePassword(password);

    if (!password) {
        return null;
    }

    return (
        <div className="panel-pw-strength" aria-live="polite">
            <div className="panel-pw-strength__bar" data-score={score}>
                <span style={{ width: `${(score / 4) * 100}%` }} />
            </div>
            <p className="panel-pw-strength__label">{label}</p>
        </div>
    );
}

export function UptimeChalks({ chalks, live = false }: { chalks: string[]; live?: boolean }) {
    const slots = chalks.slice(-8);

    return (
        <div
            className={`panel-chalks${live ? ' panel-chalks--live' : ''}`}
            role="img"
            aria-label={`Uptime chalks: ${slots.join(', ')}`}
        >
            {slots.map((state, index) => (
                <span
                    key={`${index}-${state}`}
                    className={`panel-chalk panel-chalk--${state}`}
                    title={`${slotLabel(state)} · sample ${index + 1} of ${slots.length}`}
                />
            ))}
        </div>
    );
}

export function PanelSelect({
    children,
    className = '',
    ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <span className="panel-select-wrap">
            <select className={`panel-select${className ? ` ${className}` : ''}`} {...props}>
                {children}
            </select>
            <ChevronDown className="panel-select__icon" size={14} aria-hidden="true" />
        </span>
    );
}

export function PanelCard({
    title,
    meta,
    children,
    actions,
}: {
    title: string;
    meta?: string;
    children: ReactNode;
    actions?: ReactNode;
}) {
    return (
        <section className="panel-card">
            <div className="panel-card__head">
                <h3>{title}</h3>
                <div className="panel-card__head-right">
                    {meta ? <span className="panel-app__muted">{meta}</span> : null}
                    {actions}
                </div>
            </div>
            {children}
        </section>
    );
}

export function ToastStack({
    toasts,
    onDismiss,
}: {
    toasts: Array<{ id: string; message: string }>;
    onDismiss: (id: string) => void;
}) {
    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="panel-toasts" aria-live="polite">
            {toasts.map((toast) => (
                <button
                    key={toast.id}
                    type="button"
                    className="panel-toast"
                    onClick={() => onDismiss(toast.id)}
                >
                    {toast.message}
                </button>
            ))}
        </div>
    );
}

function scorePassword(password: string): { score: number; label: string } {
    let score = 0;
    if (password.length >= 8) {
        score += 1;
    }
    if (password.length >= 12) {
        score += 1;
    }
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
        score += 1;
    }
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) {
        score += 1;
    } else if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) {
        score += 0.5;
    }

    const rounded = Math.min(4, Math.round(score));
    const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

    return { score: rounded, label: labels[rounded] ?? 'Weak' };
}

function slotLabel(state: string): string {
    if (state === 'up') {
        return 'Up';
    }
    if (state === 'maintenance') {
        return 'Maintenance';
    }
    return 'Down';
}
