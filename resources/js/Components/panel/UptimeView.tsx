import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { PanelUptime, PanelUptimeMonitor } from '@/types';
import { PanelCard, StatusDot } from '@/Components/panel/ui';

interface UptimeViewProps {
    uptime: PanelUptime;
    monitors: PanelUptimeMonitor[];
    busy: Record<string, boolean>;
    onCheckNow: (monitor: PanelUptimeMonitor) => void;
}

export default function UptimeView({ uptime, monitors, busy, onCheckNow }: UptimeViewProps) {
    const [selectedId, setSelectedId] = useState(monitors[0]?.id ?? '');
    const selected = monitors.find((monitor) => monitor.id === selectedId) ?? monitors[0];
    const spark = useMemo(
        () => (selected ? latencySparkline(selected.latency_ms, selected.status) : []),
        [selected],
    );

    return (
        <div className="panel-stack">
            <div className="panel-stat-grid">
                <article className="panel-stat">
                    <p className="panel-stat__label">Overall uptime</p>
                    <p className="panel-stat__value">{uptime.summary.overall}</p>
                    <p className="panel-stat__hint">90 day window</p>
                </article>
                <article className="panel-stat">
                    <p className="panel-stat__label">Monitors</p>
                    <p className="panel-stat__value">{uptime.summary.monitors}</p>
                    <p className="panel-stat__hint">HTTPS, TCP, DNS</p>
                </article>
                <article className="panel-stat">
                    <p className="panel-stat__label">Avg latency</p>
                    <p className="panel-stat__value">{Math.round(avgLatency(monitors))} ms</p>
                    <p className="panel-stat__hint">rolling live sample</p>
                </article>
                <article className="panel-stat">
                    <p className="panel-stat__label">Errors (24h)</p>
                    <p className="panel-stat__value">{sumErrors(monitors)}</p>
                    <p className="panel-stat__hint">
                        {uptime.summary.incidents_90d} incidents / 90d
                    </p>
                </article>
            </div>

            <div className="panel-uptime-layout">
                <PanelCard title="Monitors" meta="Click a row for detail">
                    <div className="panel-table-wrap">
                        <table className="panel-table">
                            <thead>
                                <tr>
                                    <th>Monitor</th>
                                    <th>90d</th>
                                    <th>Latency</th>
                                    <th>Errors</th>
                                    <th>History</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monitors.map((monitor) => (
                                    <tr
                                        key={monitor.id}
                                        className={`panel-row-btn${selected?.id === monitor.id ? ' is-selected' : ''}`}
                                        onClick={() => setSelectedId(monitor.id)}
                                    >
                                        <td>
                                            <p className="panel-monitor-name">{monitor.name}</p>
                                            <p className="panel-mono panel-app__muted">
                                                {monitor.target}
                                            </p>
                                        </td>
                                        <td className="panel-mono">{monitor.uptime_90d}</td>
                                        <td className="panel-mono">{monitor.latency_ms} ms</td>
                                        <td className="panel-mono">{monitor.errors_24h}</td>
                                        <td>
                                            <HistoryBar history={monitor.history} />
                                        </td>
                                        <td>
                                            <StatusDot label={monitor.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </PanelCard>

                {selected ? (
                    <PanelCard
                        title={selected.name}
                        meta={selected.last_check}
                        actions={
                            <button
                                type="button"
                                className="panel-app__ghost-btn"
                                disabled={Boolean(busy[`check-${selected.id}`])}
                                onClick={() => onCheckNow(selected)}
                            >
                                {busy[`check-${selected.id}`] ? 'Checking…' : 'Check now'}
                            </button>
                        }
                    >
                        <div className="panel-uptime-detail">
                            <div className="panel-uptime-detail__grid">
                                <div>
                                    <p className="panel-stat__label">Target</p>
                                    <p className="panel-mono">{selected.target}</p>
                                </div>
                                <div>
                                    <p className="panel-stat__label">Type</p>
                                    <p>{selected.type}</p>
                                </div>
                                <div>
                                    <p className="panel-stat__label">Latency</p>
                                    <p className="panel-mono">{selected.latency_ms} ms</p>
                                </div>
                                <div>
                                    <p className="panel-stat__label">Errors (24h)</p>
                                    <p className="panel-mono">{selected.errors_24h}</p>
                                </div>
                            </div>

                            <div>
                                <p className="panel-stat__label">Probe regions</p>
                                <div className="panel-chip-row">
                                    {selected.regions.map((region) => (
                                        <span key={region} className="panel-mini-chip">
                                            {region}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="panel-stat__label">90 day availability</p>
                                <HistoryBar history={selected.history} large />
                                <div className="panel-history-legend">
                                    <span>
                                        <i className="panel-history-swatch panel-history-swatch--up" />{' '}
                                        Up
                                    </span>
                                    <span>
                                        <i className="panel-history-swatch panel-history-swatch--degraded" />{' '}
                                        Degraded
                                    </span>
                                    <span>
                                        <i className="panel-history-swatch panel-history-swatch--down" />{' '}
                                        Down
                                    </span>
                                </div>
                                <p className="panel-app__muted" style={{ marginTop: '0.45rem' }}>
                                    Hover a day pill for status, window, and downtime totals.
                                </p>
                            </div>

                            <div>
                                <p className="panel-stat__label">Latency samples</p>
                                <div className="panel-spark" aria-hidden="true">
                                    {spark.map((value, index) => (
                                        <span
                                            key={`${selected.id}-${index}`}
                                            style={{ height: `${value}%` }}
                                        />
                                    ))}
                                </div>
                                <p className="panel-app__muted">
                                    Live jitter around {selected.latency_ms} ms · concept simulation
                                </p>
                            </div>
                        </div>
                    </PanelCard>
                ) : null}
            </div>

            <PanelCard title="Recent incidents" meta="90 days">
                <div className="panel-table-wrap">
                    <table className="panel-table">
                        <thead>
                            <tr>
                                <th>Monitor</th>
                                <th>Started</th>
                                <th>Duration</th>
                                <th>Error</th>
                                <th>State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uptime.incidents.map((incident) => (
                                <tr key={incident.id}>
                                    <td>{incident.monitor}</td>
                                    <td className="panel-mono">{incident.started}</td>
                                    <td className="panel-mono">{incident.duration}</td>
                                    <td>{incident.error}</td>
                                    <td>
                                        <StatusDot
                                            label={incident.resolved ? 'resolved' : 'open'}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PanelCard>
        </div>
    );
}

function HistoryBar({ history, large = false }: { history: string; large?: boolean }) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [tipStyle, setTipStyle] = useState<CSSProperties>({});
    const tickRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const slots = history.split('');
    const downTotal = slots.filter((slot) => slot === 'd').length;
    const degradedTotal = slots.filter((slot) => slot === 'w').length;
    const upTotal = slots.length - downTotal - degradedTotal;

    useLayoutEffect(() => {
        if (hoverIndex === null) {
            return;
        }

        const tick = tickRefs.current[hoverIndex];
        if (!tick) {
            return;
        }

        const rect = tick.getBoundingClientRect();
        const tipWidth = 220;
        const tipHeight = 88;
        const margin = 10;
        let left = rect.left + rect.width / 2;
        left = Math.min(
            window.innerWidth - margin - tipWidth / 2,
            Math.max(margin + tipWidth / 2, left),
        );

        let top = rect.top - margin;
        let transform = 'translate(-50%, -100%)';

        if (top - tipHeight < margin) {
            top = rect.bottom + margin;
            transform = 'translate(-50%, 0)';
        }

        setTipStyle({
            position: 'fixed',
            left,
            top,
            transform,
            zIndex: 80,
        });
    }, [hoverIndex, large]);

    return (
        <div
            className={`panel-history${large ? ' panel-history--large' : ''}`}
            onMouseLeave={() => setHoverIndex(null)}
        >
            {slots.map((slot, index) => {
                const kind = slot === 'd' ? 'down' : slot === 'w' ? 'degraded' : 'up';
                const day = slots.length - index;
                const showTip = hoverIndex === index;
                return (
                    <span
                        key={`${slot}-${index}`}
                        ref={(element) => {
                            tickRefs.current[index] = element;
                        }}
                        className={`panel-history__tick panel-history__tick--${kind}`}
                        onMouseEnter={() => setHoverIndex(index)}
                    >
                        {showTip ? (
                            <span className="panel-history__tip" role="tooltip" style={tipStyle}>
                                <strong>
                                    Day -{day} · {kind}
                                </strong>
                                {kind === 'down'
                                    ? 'Downtime ~24h in this window'
                                    : kind === 'degraded'
                                      ? 'Partial outage / high latency'
                                      : 'Healthy probes'}
                                <br />
                                Totals: {downTotal}d down · {degradedTotal}d degraded · {upTotal}d
                                up
                            </span>
                        ) : null}
                    </span>
                );
            })}
        </div>
    );
}

function avgLatency(monitors: PanelUptimeMonitor[]): number {
    if (monitors.length === 0) {
        return 0;
    }
    return monitors.reduce((sum, monitor) => sum + monitor.latency_ms, 0) / monitors.length;
}

function sumErrors(monitors: PanelUptimeMonitor[]): number {
    return monitors.reduce((sum, monitor) => sum + monitor.errors_24h, 0);
}

function latencySparkline(base: number, status: string): number[] {
    return Array.from({ length: 28 }, (_, index) => {
        const wave = Math.sin(index / 2.4) * (status === 'degraded' ? 18 : 8);
        const noise = ((index * 37) % 9) - 4;
        const ms = Math.max(6, base + wave + noise);
        const ceiling = status === 'degraded' ? 420 : 160;
        return Math.round((ms / ceiling) * 100);
    });
}
