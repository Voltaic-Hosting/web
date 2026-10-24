<script lang="ts">
    interface Props {
        toasts: Array<{ id: string; message: string }>;
        onDismiss: (id: string) => void;
    }

    let { toasts, onDismiss }: Props = $props();
</script>

{#if toasts.length > 0}
    <div class="panel-toasts" aria-live="polite">
        {#each toasts as toast (toast.id)}
            <button type="button" class="panel-toast" onclick={() => onDismiss(toast.id)}>
                {toast.message}
            </button>
        {/each}
    </div>
{/if}
