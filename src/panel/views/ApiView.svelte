<script lang="ts">
    import { untrack } from 'svelte';
    import { KeyRound } from '@lucide/svelte';
    import type { PanelApiEndpoint, PanelApiKey } from '@/data/types';
    import PanelCard from '../ui/PanelCard.svelte';

    interface Props {
        keys: PanelApiKey[];
        endpoints: PanelApiEndpoint[];
        onCreate: (name: string) => void;
        onRevoke: (id: string) => void;
    }

    let { keys, endpoints, onCreate, onRevoke }: Props = $props();

    let name = $state('');
    let openId = $state<string | null>(untrack(() => keys[0]?.id ?? null));
</script>

<div class="panel-stack">
    <PanelCard title="API keys" meta="{keys.length} active">
        {#snippet actions()}
            <form
                class="panel-action-row"
                onsubmit={(event) => {
                    event.preventDefault();
                    if (!name.trim()) {
                        return;
                    }
                    onCreate(name.trim());
                    name = '';
                }}
            >
                <input class="panel-search" placeholder="Key name" bind:value={name} />
                <button type="submit" class="panel-mini-btn"><KeyRound size={14} /> Create</button>
            </form>
        {/snippet}
        <div class="panel-api-keys">
            {#each keys as key (key.id)}
                {@const open = openId === key.id}
                <details
                    class="panel-api-key"
                    {open}
                    ontoggle={(event) => {
                        if (event.currentTarget.open) {
                            openId = key.id;
                        } else if (openId === key.id) {
                            openId = null;
                        }
                    }}
                >
                    <summary class="panel-api-key__summary">
                        <span>
                            <strong>{key.name}</strong>
                            <span class="panel-mono panel-app__muted"> {key.prefix}…</span>
                        </span>
                        <span class="panel-app__muted">
                            {key.lastUsed}{key.lastIp !== '—' ? ` · ${key.lastIp}` : ''}
                        </span>
                    </summary>
                    <div class="panel-api-key__body">
                        <div class="panel-settings-list">
                            <div class="panel-setting">
                                <p class="panel-setting__label">Created</p>
                                <p class="panel-mono">{key.created}</p>
                            </div>
                            <div class="panel-setting">
                                <p class="panel-setting__label">Last used</p>
                                <p class="panel-mono">{key.lastUsed}</p>
                            </div>
                            <div class="panel-setting">
                                <p class="panel-setting__label">Last IP</p>
                                <p class="panel-mono">{key.lastIp}</p>
                            </div>
                            <div class="panel-setting">
                                <p class="panel-setting__label">Scopes</p>
                                <p class="panel-mono">{key.scopes.join(', ')}</p>
                            </div>
                        </div>
                        <div class="panel-action-row" style="margin-top: 0.75rem">
                            <button
                                type="button"
                                class="panel-mini-btn"
                                onclick={() => onRevoke(key.id)}
                            >
                                Revoke
                            </button>
                        </div>
                    </div>
                </details>
            {/each}
        </div>
    </PanelCard>

    <PanelCard title="API reference" meta="{endpoints.length} endpoints">
        <div class="panel-table-wrap">
            <table class="panel-table">
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Path</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {#each endpoints as endpoint (`${endpoint.method}-${endpoint.path}`)}
                        <tr>
                            <td>
                                <span
                                    class="panel-api-method panel-api-method--{endpoint.method.toLowerCase()}"
                                    >{endpoint.method}</span
                                >
                            </td>
                            <td class="panel-mono">{endpoint.path}</td>
                            <td>{endpoint.description}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <p class="panel-app__muted" style="margin-top: 0.85rem">
            Authenticate with <span class="panel-mono">Authorization: Bearer vt_live_…</span>.
            Concept docs only.
        </p>
    </PanelCard>
</div>
