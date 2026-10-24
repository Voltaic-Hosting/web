<script lang="ts">
    interface Props {
        value: number;
    }

    let { value }: Props = $props();

    const clamped = $derived(Math.max(0, Math.min(100, Math.round(value))));
</script>

<div class="panel-meter" title="{clamped}%">
    <span class="panel-meter__fill" style="width: {clamped}%"></span>
</div>
