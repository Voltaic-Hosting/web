<script lang="ts">
    interface Props {
        password: string;
    }

    let { password }: Props = $props();

    function scorePassword(value: string): { score: number; label: string } {
        let score = 0;
        if (value.length >= 8) {
            score += 1;
        }
        if (value.length >= 12) {
            score += 1;
        }
        if (/[A-Z]/.test(value) && /[a-z]/.test(value)) {
            score += 1;
        }
        if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) {
            score += 1;
        } else if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) {
            score += 0.5;
        }

        const rounded = Math.min(4, Math.round(score));
        const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

        return { score: rounded, label: labels[rounded] ?? 'Weak' };
    }

    const result = $derived(scorePassword(password));
</script>

{#if password}
    <div class="panel-pw-strength" aria-live="polite">
        <div class="panel-pw-strength__bar" data-score={result.score}>
            <span style="width: {(result.score / 4) * 100}%"></span>
        </div>
        <p class="panel-pw-strength__label">{result.label}</p>
    </div>
{/if}
