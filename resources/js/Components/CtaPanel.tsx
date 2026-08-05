import Button from '@/Components/Button';
import SectionAnchor from '@/Components/SectionAnchor';

interface CtaPanelProps {
    title: string;
    body: string;
    actionHref?: string;
    actionLabel?: string;
    anchorId?: string;
}

export default function CtaPanel({
    title,
    body,
    actionHref = '/contact',
    actionLabel = 'Contact',
    anchorId,
}: CtaPanelProps) {
    return (
        <div className="cta-panel">
            <h2 className="cta-panel__title">
                {anchorId ? (
                    <span className="section__heading">
                        <SectionAnchor id={anchorId} label={title} />
                        {title}
                    </span>
                ) : (
                    title
                )}
            </h2>
            <p className="cta-panel__body">{body}</p>
            <div className="cta-panel__actions">
                <Button href={actionHref}>{actionLabel}</Button>
            </div>
        </div>
    );
}
