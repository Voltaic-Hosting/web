<script lang="ts">
    interface Props {
        label: string;
        checked: boolean;
        onChange: () => void;
    }

    let { label, checked, onChange }: Props = $props();
</script>

<label class="panel-switch">
    <span class="panel-switch__label">{label}</span>
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        class="panel-switch__control"
        class:is-on={checked}
        onclick={onChange}
    >
        <span class="panel-switch__thumb"></span>
    </button>
</label>
