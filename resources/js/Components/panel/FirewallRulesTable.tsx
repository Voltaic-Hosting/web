import { Check, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { PanelSelect } from '@/Components/panel/ui';
import type { PanelFirewallRule } from '@/types';

type RulePayload = Pick<PanelFirewallRule, 'action' | 'source' | 'dest' | 'proto'>;

interface FirewallRulesTableProps {
    rules: PanelFirewallRule[];
    serverId: string;
    onAdd: (payload: RulePayload & { server_id: string }) => void;
    onUpdate: (id: string, payload: RulePayload & { server_id: string }) => void;
    onRemove: (id: string) => void;
}

function emptyDraft(): RulePayload {
    return { action: 'Allow', source: '', dest: '', proto: 'TCP' };
}

export function FirewallRulesTable({
    rules,
    serverId,
    onAdd,
    onUpdate,
    onRemove,
}: FirewallRulesTableProps) {
    const [addDraft, setAddDraft] = useState<RulePayload>(emptyDraft);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editDraft, setEditDraft] = useState<RulePayload>(emptyDraft);

    const startEdit = (rule: PanelFirewallRule) => {
        setEditingId(rule.id);
        setEditDraft({
            action: rule.action,
            source: rule.source,
            dest: rule.dest,
            proto: rule.proto,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditDraft(emptyDraft());
    };

    const saveEdit = () => {
        if (!editingId || !editDraft.source.trim() || !editDraft.dest.trim()) {
            return;
        }

        onUpdate(editingId, {
            server_id: serverId,
            action: editDraft.action,
            source: editDraft.source.trim(),
            dest: editDraft.dest.trim(),
            proto: editDraft.proto,
        });
        cancelEdit();
    };

    return (
        <>
            <form
                className="panel-fw-form"
                onSubmit={(event) => {
                    event.preventDefault();
                    if (!addDraft.source.trim() || !addDraft.dest.trim()) {
                        return;
                    }
                    onAdd({
                        server_id: serverId,
                        action: addDraft.action,
                        source: addDraft.source.trim(),
                        dest: addDraft.dest.trim(),
                        proto: addDraft.proto,
                    });
                    setAddDraft(emptyDraft());
                }}
            >
                <PanelSelect
                    className="panel-select"
                    value={addDraft.action}
                    onChange={(event) =>
                        setAddDraft((current) => ({ ...current, action: event.target.value }))
                    }
                >
                    <option>Allow</option>
                    <option>Deny</option>
                </PanelSelect>
                <input
                    className="panel-search"
                    placeholder="Source"
                    value={addDraft.source}
                    onChange={(event) =>
                        setAddDraft((current) => ({ ...current, source: event.target.value }))
                    }
                />
                <input
                    className="panel-search"
                    placeholder="Dest port"
                    value={addDraft.dest}
                    onChange={(event) =>
                        setAddDraft((current) => ({ ...current, dest: event.target.value }))
                    }
                />
                <PanelSelect
                    className="panel-select"
                    value={addDraft.proto}
                    onChange={(event) =>
                        setAddDraft((current) => ({ ...current, proto: event.target.value }))
                    }
                >
                    <option>TCP</option>
                    <option>UDP</option>
                    <option>Any</option>
                </PanelSelect>
                <button type="submit" className="panel-mini-btn">
                    Add rule
                </button>
            </form>
            <div className="panel-table-wrap">
                <table className="panel-table panel-table--fw">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Protocol</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {rules.map((rule) => {
                            const editing = editingId === rule.id;

                            return (
                                <tr key={rule.id} className={editing ? 'is-editing' : undefined}>
                                    <td>
                                        {editing ? (
                                            <PanelSelect
                                                className="panel-select panel-select--compact"
                                                value={editDraft.action}
                                                onChange={(event) =>
                                                    setEditDraft((current) => ({
                                                        ...current,
                                                        action: event.target.value,
                                                    }))
                                                }
                                            >
                                                <option>Allow</option>
                                                <option>Deny</option>
                                            </PanelSelect>
                                        ) : (
                                            <span
                                                className={`panel-fw panel-fw--${rule.action.toLowerCase()}`}
                                            >
                                                {rule.action}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {editing ? (
                                            <input
                                                className="panel-search panel-search--cell"
                                                value={editDraft.source}
                                                onChange={(event) =>
                                                    setEditDraft((current) => ({
                                                        ...current,
                                                        source: event.target.value,
                                                    }))
                                                }
                                            />
                                        ) : (
                                            rule.source
                                        )}
                                    </td>
                                    <td>
                                        {editing ? (
                                            <input
                                                className="panel-search panel-search--cell"
                                                value={editDraft.dest}
                                                onChange={(event) =>
                                                    setEditDraft((current) => ({
                                                        ...current,
                                                        dest: event.target.value,
                                                    }))
                                                }
                                            />
                                        ) : (
                                            <span className="panel-mono">{rule.dest}</span>
                                        )}
                                    </td>
                                    <td>
                                        {editing ? (
                                            <PanelSelect
                                                className="panel-select panel-select--compact"
                                                value={editDraft.proto}
                                                onChange={(event) =>
                                                    setEditDraft((current) => ({
                                                        ...current,
                                                        proto: event.target.value,
                                                    }))
                                                }
                                            >
                                                <option>TCP</option>
                                                <option>UDP</option>
                                                <option>Any</option>
                                            </PanelSelect>
                                        ) : (
                                            rule.proto
                                        )}
                                    </td>
                                    <td>
                                        <div className="panel-table-actions">
                                            {editing ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="panel-icon-btn"
                                                        aria-label="Save rule"
                                                        onClick={saveEdit}
                                                    >
                                                        <Check size={15} aria-hidden="true" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="panel-icon-btn"
                                                        aria-label="Cancel edit"
                                                        onClick={cancelEdit}
                                                    >
                                                        <X size={15} aria-hidden="true" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="panel-icon-btn"
                                                        aria-label={`Edit rule ${rule.source}`}
                                                        onClick={() => startEdit(rule)}
                                                    >
                                                        <Pencil size={15} aria-hidden="true" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="panel-icon-btn panel-icon-btn--danger"
                                                        aria-label={`Remove rule ${rule.source}`}
                                                        onClick={() => onRemove(rule.id)}
                                                    >
                                                        <Trash2 size={15} aria-hidden="true" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}
