<script lang="ts">
    import { Eye, UserPlus } from '@lucide/svelte';
    import type { PanelUser } from '@/data/types';
    import UserAvatar from '../UserAvatar.svelte';
    import KindBadge from '../ui/KindBadge.svelte';
    import PanelCard from '../ui/PanelCard.svelte';
    import PanelSelect from '../ui/PanelSelect.svelte';
    import StatusText from '../ui/StatusText.svelte';
    import ToggleSwitch from '../ui/ToggleSwitch.svelte';

    interface Props {
        users: PanelUser[];
        permissionOptions: string[];
        onAdd: (user: { name: string; email: string; role: string; perms: string[] }) => void;
        onUpdatePerms: (userId: string, perms: string[]) => void;
        onViewAs?: (user: PanelUser) => void;
    }

    let { users, permissionOptions, onAdd, onUpdatePerms, onViewAs }: Props = $props();

    let open = $state(false);
    let name = $state('');
    let email = $state('');
    let role = $state('Operator');
    let perms = $state<string[]>(['servers']);
    let editId = $state<string | null>(null);
    let search = $state('');

    const filtered = $derived.by(() => {
        const q = search.trim().toLowerCase();
        if (!q) {
            return users;
        }
        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(q) ||
                user.email.toLowerCase().includes(q) ||
                user.role.toLowerCase().includes(q) ||
                user.perms.join(' ').toLowerCase().includes(q),
        );
    });

    const editUser = $derived(users.find((item) => item.id === editId));
</script>

<PanelCard title="Users" meta="{filtered.length} of {users.length}">
    {#snippet actions()}
        <div class="panel-action-row">
            <input
                class="panel-search"
                type="search"
                bind:value={search}
                placeholder="Search users"
                aria-label="Search users"
            />
            <button
                type="button"
                class="panel-icon-btn"
                aria-label="Add user"
                onclick={() => (open = !open)}
            >
                <UserPlus size={18} />
            </button>
        </div>
    {/snippet}
    {#if open}
        <form
            class="panel-user-form"
            onsubmit={(event) => {
                event.preventDefault();
                if (!name.trim() || !email.trim()) {
                    return;
                }
                onAdd({ name: name.trim(), email: email.trim(), role, perms });
                name = '';
                email = '';
                open = false;
            }}
        >
            <input class="panel-search" placeholder="Name" bind:value={name} />
            <input class="panel-search" placeholder="Email" bind:value={email} />
            <PanelSelect value={role} onchange={(event) => (role = event.currentTarget.value)}>
                <option>Owner</option>
                <option>Admin</option>
                <option>Operator</option>
                <option>Reseller</option>
                <option>Read only</option>
                <option>Service</option>
            </PanelSelect>
            <div class="panel-perm-grid">
                {#each permissionOptions as perm (perm)}
                    <ToggleSwitch
                        label={perm}
                        checked={perms.includes(perm)}
                        onChange={() => {
                            perms = perms.includes(perm)
                                ? perms.filter((item) => item !== perm)
                                : [...perms, perm];
                        }}
                    />
                {/each}
            </div>
            <button type="submit" class="panel-mini-btn">Invite user</button>
        </form>
    {/if}

    <div class="panel-table-wrap">
        <table class="panel-table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Permissions</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {#each filtered as user (user.id)}
                    <tr>
                        <td>
                            <div class="panel-user-cell">
                                <UserAvatar seed={user.avatarSeed} name={user.name} size={28} />
                                <span>
                                    {user.name}
                                    <p class="panel-mono panel-app__muted">{user.email}</p>
                                </span>
                            </div>
                        </td>
                        <td><KindBadge label={user.role} /></td>
                        <td><StatusText label={user.status} /></td>
                        <td>{user.perms.join(', ')}</td>
                        <td>
                            <div class="panel-action-row">
                                <button
                                    type="button"
                                    class="panel-mini-btn"
                                    onclick={() => (editId = editId === user.id ? null : user.id)}
                                >
                                    Permissions
                                </button>
                                {#if onViewAs && user.role !== 'Service'}
                                    <button
                                        type="button"
                                        class="panel-mini-btn"
                                        onclick={() => onViewAs(user)}
                                    >
                                        <Eye size={14} /> View as
                                    </button>
                                {/if}
                            </div>
                        </td>
                    </tr>
                {/each}
                {#if filtered.length === 0}
                    <tr>
                        <td colspan="5">No users match that search.</td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>

    {#if editId}
        <div class="panel-perm-grid" style="margin-top: 0.85rem">
            {#if editUser}
                {#each permissionOptions as perm (perm)}
                    <ToggleSwitch
                        label={perm}
                        checked={editUser.perms.includes(perm)}
                        onChange={() => {
                            const next = editUser.perms.includes(perm)
                                ? editUser.perms.filter((item) => item !== perm)
                                : [...editUser.perms, perm];
                            onUpdatePerms(editUser.id, next);
                        }}
                    />
                {/each}
            {/if}
        </div>
    {/if}
</PanelCard>
