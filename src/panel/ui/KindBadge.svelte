<script lang="ts">
    interface Props {
        label: string;
    }

    let { label }: Props = $props();

    const slug = $derived(label.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
</script>

<span class="panel-kind panel-kind--{slug}">{label}</span>
