<script lang="ts">
    interface Props {
        label: string;
    }

    let { label }: Props = $props();
</script>

<span class="panel-status-text panel-status-text--{label}">{label}</span>
