<script lang="ts">
    import Meter from './Meter.svelte';

    interface Props {
        label: string;
        value: number;
    }

    let { label, value }: Props = $props();
</script>

<div class="panel-labeled-meter">
    <div class="panel-labeled-meter__row">
        <span>{label}</span>
        <span class="panel-mono">{Math.round(value)}%</span>
    </div>
    <Meter {value} />
</div>
