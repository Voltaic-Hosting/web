<script lang="ts">
    import type { PanelSetting, PanelSettingToggle } from '@/data/types';
    import PanelCard from '../ui/PanelCard.svelte';
    import ToggleSwitch from '../ui/ToggleSwitch.svelte';

    interface Props {
        settings: PanelSetting[];
        toggles: PanelSettingToggle[];
        onToggle: (item: PanelSettingToggle) => void;
        onResetDefaults: () => void;
    }

    let { settings, toggles, onToggle, onResetDefaults }: Props = $props();
</script>

<div class="panel-stack">
    <PanelCard title="Organization">
        <div class="panel-settings-list">
            {#each settings as item (item.key)}
                <div class="panel-setting">
                    <p class="panel-setting__label">{item.label}</p>
                    <p class="panel-mono">{item.value}</p>
                </div>
            {/each}
        </div>
    </PanelCard>
    <PanelCard title="Preferences">
        {#snippet actions()}
            <button type="button" class="panel-mini-btn" onclick={onResetDefaults}>
                Reset to defaults
            </button>
        {/snippet}
        <div class="panel-toggle-list">
            {#each toggles as item (item.key)}
                <ToggleSwitch
                    label={item.label}
                    checked={item.enabled}
                    onChange={() => onToggle(item)}
                />
            {/each}
        </div>
    </PanelCard>
</div>
