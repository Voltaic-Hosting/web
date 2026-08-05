import { PropsWithChildren } from 'react';
import SectionAnchor from '@/Components/SectionAnchor';

interface PageHeroProps extends PropsWithChildren {
    id?: string;
    eyebrow?: string;
    title: string;
    lede?: string;
    align?: 'start' | 'center';
}

export default function PageHero({
    id,
    eyebrow,
    title,
    lede,
    align = 'start',
    children,
}: PageHeroProps) {
    const className = align === 'center' ? 'page-hero page-hero--center' : 'page-hero';
    const anchorId = id ?? undefined;

    return (
        <section className={className} id={anchorId}>
            <div className="site-container">
                {eyebrow ? <p className="page-hero__eyebrow">{eyebrow}</p> : null}
                <h1 className="page-hero__title">
                    {anchorId ? (
                        <span className="section__heading">
                            <SectionAnchor id={anchorId} label={title} />
                            {title}
                        </span>
                    ) : (
                        title
                    )}
                </h1>
                {lede ? <p className="page-hero__lede">{lede}</p> : null}
                {children ? <div className="page-hero__actions">{children}</div> : null}
            </div>
        </section>
    );
}
