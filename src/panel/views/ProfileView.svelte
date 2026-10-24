<script lang="ts">
    import { Binary } from '@lucide/svelte';
    import type { PanelConcept, PanelProfile, PanelSecurity, PanelSession } from '@/data/types';
    import { avatarColorOptions } from '../avatar';
    import UserAvatar from '../UserAvatar.svelte';
    import PanelCard from '../ui/PanelCard.svelte';
    import PasswordStrength from '../ui/PasswordStrength.svelte';
    import ToggleSwitch from '../ui/ToggleSwitch.svelte';

    interface Props {
        profile: PanelProfile;
        panel: PanelConcept;
        security: PanelSecurity;
        sessions: PanelSession[];
        onUpdateProfile: (patch: Partial<PanelProfile>) => void;
        onUploadAvatar: (file: File) => void;
        onResetAvatar: () => void;
        onToggleSecurity: (key: 'totp' | 'yubikey' | 'passkey') => void;
        onRevokeSession: (id: string) => void;
        onToast: (message: string) => void;
    }

    let {
        profile,
        panel,
        security,
        sessions,
        onUpdateProfile,
        onUploadAvatar,
        onResetAvatar,
        onToggleSecurity,
        onRevokeSession,
        onToast,
    }: Props = $props();

    let avatarInput = $state<HTMLInputElement | null>(null);
    let currentPassword = $state('');
    let newPassword = $state('');
    let authCode = $state('');
    let yubikeyVerified = $state(false);
    let passkeyVerified = $state(false);
    let setup = $state<null | 'totp' | 'yubikey' | 'passkey'>(null);
    let setupCode = $state('');
    let uaOpen = $state<string | null>(null);

    const requestAuth = (key: 'totp' | 'yubikey' | 'passkey') => {
        if (security[key]) {
            onToggleSecurity(key);
            setup = null;
            return;
        }
        setup = key;
        setupCode = '';
    };

    const completeSetup = () => {
        if (!setup) {
            return;
        }
        if (setup === 'totp' && setupCode.trim().length < 6) {
            onToast('Enter the 6-digit code from your authenticator');
            return;
        }
        if (!security[setup]) {
            onToggleSecurity(setup);
        }
        onToast(
            setup === 'totp'
                ? 'Authenticator app enrolled'
                : setup === 'yubikey'
                  ? 'YubiKey registered'
                  : 'Passkey registered',
        );
        setup = null;
        setupCode = '';
    };

    const passwordChecksPass = $derived(
        currentPassword.trim().length > 0 &&
            newPassword.trim().length > 0 &&
            (!security.totp || authCode.trim().length >= 6) &&
            (!security.yubikey || yubikeyVerified) &&
            (!security.passkey || passkeyVerified),
    );

    const submitPasswordChange = () => {
        if (!currentPassword.trim()) {
            onToast('Enter your current password');
            return;
        }
        if (!newPassword.trim()) {
            onToast('Enter a new password');
            return;
        }
        if (security.totp && authCode.trim().length < 6) {
            onToast('Enter the 6-digit code from your authenticator');
            return;
        }
        if (security.yubikey && !yubikeyVerified) {
            onToast('Verify your YubiKey before changing the password');
            return;
        }
        if (security.passkey && !passkeyVerified) {
            onToast('Verify your passkey before changing the password');
            return;
        }
        onToast('Password updated (concept)');
        currentPassword = '';
        newPassword = '';
        authCode = '';
        yubikeyVerified = false;
        passkeyVerified = false;
    };
</script>

<div class="panel-stack">
    <PanelCard title="Profile">
        <div class="panel-profile-edit">
            <div class="panel-avatar-upload">
                <input
                    bind:this={avatarInput}
                    class="panel-avatar-upload__input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onchange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
                            onUploadAvatar(file);
                        }
                        event.currentTarget.value = '';
                    }}
                />
                <button
                    type="button"
                    class="panel-avatar-upload__trigger"
                    aria-label="Change profile photo"
                    onclick={() => avatarInput?.click()}
                >
                    <UserAvatar
                        seed={profile.avatarSeed}
                        name={profile.name}
                        size={56}
                        color={profile.avatarColor}
                        imageUrl={profile.avatarImage}
                    />
                    <span class="panel-avatar-upload__overlay">Change</span>
                </button>
                <button
                    type="button"
                    class="panel-link-btn panel-avatar-upload__reset"
                    onclick={onResetAvatar}
                >
                    Reset avatar
                </button>
            </div>
            <div class="panel-profile-edit__fields">
                <label class="panel-profile-field">
                    <span class="panel-setting__label">Display name</span>
                    <input
                        class="panel-search"
                        value={profile.name}
                        oninput={(event) => onUpdateProfile({ name: event.currentTarget.value })}
                    />
                </label>
                <label class="panel-profile-field">
                    <span class="panel-setting__label">Email</span>
                    <input
                        class="panel-search"
                        type="email"
                        value={profile.email}
                        oninput={(event) => onUpdateProfile({ email: event.currentTarget.value })}
                    />
                </label>
                <label class="panel-profile-field">
                    <span class="panel-setting__label">Avatar seed</span>
                    <input
                        class="panel-search"
                        value={profile.avatarSeed}
                        oninput={(event) =>
                            onUpdateProfile({ avatarSeed: event.currentTarget.value })}
                    />
                </label>
                <div class="panel-profile-field">
                    <span class="panel-setting__label">Avatar color</span>
                    <div class="panel-avatar-swatches">
                        <button
                            type="button"
                            class="panel-avatar-swatch"
                            class:is-active={profile.avatarColor === null}
                            aria-label="Use generated avatar color"
                            onclick={() => onUpdateProfile({ avatarColor: null })}
                        >
                            Auto
                        </button>
                        {#each avatarColorOptions as color (color)}
                            <button
                                type="button"
                                class="panel-avatar-swatch panel-avatar-swatch--color"
                                class:is-active={profile.avatarColor === color}
                                style="background: {color}"
                                aria-label="Use avatar color {color}"
                                onclick={() => onUpdateProfile({ avatarColor: color })}
                            ></button>
                        {/each}
                    </div>
                </div>
                <p class="panel-app__muted">{profile.role} · {profile.org} · {profile.plan}</p>
                <p class="panel-app__muted">Changes save automatically in this browser.</p>
            </div>
        </div>
        <form
            class="panel-user-form"
            onsubmit={(event) => {
                event.preventDefault();
                submitPasswordChange();
            }}
        >
            <p class="panel-setting__label">{panel.security.passwordHint}</p>
            <input
                class="panel-search"
                type="password"
                placeholder="Current password"
                bind:value={currentPassword}
                autocomplete="current-password"
            />
            <input
                class="panel-search"
                type="password"
                placeholder="New password"
                bind:value={newPassword}
                autocomplete="new-password"
            />
            <PasswordStrength password={newPassword} />
            {#if security.totp}
                <input
                    class="panel-search"
                    inputmode="numeric"
                    placeholder="Authenticator code"
                    bind:value={authCode}
                    aria-label="Authenticator code"
                />
            {/if}
            {#if security.yubikey}
                <button
                    type="button"
                    class="panel-mini-btn"
                    class:is-active={yubikeyVerified}
                    onclick={() => {
                        yubikeyVerified = true;
                        onToast('YubiKey verified (concept)');
                    }}
                >
                    {yubikeyVerified ? 'YubiKey verified' : 'Verify YubiKey'}
                </button>
            {/if}
            {#if security.passkey}
                <button
                    type="button"
                    class="panel-mini-btn"
                    class:is-active={passkeyVerified}
                    onclick={() => {
                        passkeyVerified = true;
                        onToast('Passkey verified (concept)');
                    }}
                >
                    {passkeyVerified ? 'Passkey verified' : 'Verify passkey'}
                </button>
            {/if}
            <button type="submit" class="panel-mini-btn" disabled={!passwordChecksPass}>
                Change password
            </button>
        </form>
    </PanelCard>

    <PanelCard title="Authentication">
        <div class="panel-toggle-list">
            <ToggleSwitch
                label="Authenticator app (2FA)"
                checked={security.totp}
                onChange={() => requestAuth('totp')}
            />
            <ToggleSwitch
                label="Hardware key (YubiKey)"
                checked={security.yubikey}
                onChange={() => requestAuth('yubikey')}
            />
            <ToggleSwitch
                label="Passkey"
                checked={security.passkey}
                onChange={() => requestAuth('passkey')}
            />
        </div>

        {#if setup}
            <div class="panel-auth-setup">
                {#if setup === 'totp'}
                    <p>
                        Scan this concept secret in your authenticator app, then enter the code it
                        shows.
                    </p>
                    <code class="panel-auth-setup__code">VTIC-7K2M-NQ9P-4RHW</code>
                    <input
                        class="panel-search"
                        inputmode="numeric"
                        placeholder="6-digit code"
                        bind:value={setupCode}
                        aria-label="Authenticator code"
                    />
                {/if}
                {#if setup === 'yubikey'}
                    <p>
                        Insert your YubiKey and tap the gold contact when the browser asks for a
                        security key. This is a concept flow only.
                    </p>
                {/if}
                {#if setup === 'passkey'}
                    <p>
                        Use your device unlock (fingerprint, face, or PIN) when the browser prompts
                        for a passkey. This is a concept flow only.
                    </p>
                {/if}
                <div class="panel-action-row">
                    <button type="button" class="panel-mini-btn" onclick={completeSetup}>
                        {setup === 'totp' ? 'Verify and enable' : 'Complete setup'}
                    </button>
                    <button type="button" class="panel-mini-btn" onclick={() => (setup = null)}>
                        Cancel
                    </button>
                </div>
            </div>
        {/if}
    </PanelCard>

    <PanelCard title="Browser sessions">
        <div class="panel-table-wrap">
            <table class="panel-table">
                <thead>
                    <tr>
                        <th>Device</th>
                        <th>IP</th>
                        <th>Location</th>
                        <th>Active</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {#each sessions as session (session.id)}
                        <tr>
                            <td>
                                {session.device}{session.current ? ' (this device)' : ''}
                            </td>
                            <td class="panel-mono">{session.ip}</td>
                            <td>{session.location}</td>
                            <td>{session.lastActive}</td>
                            <td>
                                <div class="panel-session-actions">
                                    <button
                                        type="button"
                                        class="panel-icon-btn"
                                        aria-label="Show user agent for {session.device}"
                                        aria-expanded={uaOpen === session.id}
                                        onclick={() =>
                                            (uaOpen = uaOpen === session.id ? null : session.id)}
                                    >
                                        <Binary size={16} />
                                    </button>
                                    {#if !session.current}
                                        <button
                                            type="button"
                                            class="panel-mini-btn"
                                            onclick={() => onRevokeSession(session.id)}
                                        >
                                            Revoke
                                        </button>
                                    {/if}
                                </div>
                            </td>
                        </tr>
                        {#if uaOpen === session.id}
                            <tr class="panel-ua-row">
                                <td colspan="5">{session.userAgent}</td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
    </PanelCard>
</div>
