import { PropsWithChildren } from 'react';
import SectionAnchor from '@/Components/SectionAnchor';

interface SectionProps extends PropsWithChildren {
    id: string;
    title: string;
    lede?: string;
}

export default function Section({ id, title, lede, children }: SectionProps) {
    return (
        <section className="section" id={id}>
            <div className="site-container">
                <div className="section__intro">
                    <h2 className="section__title">
                        <span className="section__heading">
                            <SectionAnchor id={id} label={title} />
                            {title}
                        </span>
                    </h2>
                    {lede ? <p className="section__lede">{lede}</p> : null}
                </div>
                {children}
            </div>
        </section>
    );
}
