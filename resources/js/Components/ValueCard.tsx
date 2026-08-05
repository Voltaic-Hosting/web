import type { Value } from '@/types';

interface ValueCardProps {
    value: Value;
}

export default function ValueCard({ value }: ValueCardProps) {
    return (
        <article className="value-card">
            <h3 className="value-card__title">{value.title}</h3>
            <p className="value-card__body">{value.body}</p>
        </article>
    );
}
