import { Link } from '@inertiajs/react';
import PanelApp from '@/Components/PanelApp';
import SectionAnchor from '@/Components/SectionAnchor';
import type { PanelConcept } from '@/types';

interface PanelShowcaseProps {
    panel: PanelConcept;
}

export default function PanelShowcase({ panel }: PanelShowcaseProps) {
    return (
        <div className="panel-showcase">
            <div className="panel-showcase__copy">
                <h2 className="panel-showcase__title">
                    <span className="section__heading">
                        <SectionAnchor id="panel" label={panel.title} />
                        {panel.title}
                    </span>
                </h2>
                <p className="panel-showcase__lede">{panel.lede}</p>
                <div className="panel-showcase__actions">
                    <Link href="/panel" className="btn btn--solid">
                        Open full concept
                    </Link>
                    <Link href="/contact" className="btn btn--ghost">
                        Ask about access
                    </Link>
                </div>
            </div>

            <div className="panel-showcase__frame-wrap">
                <div className="panel-showcase__frame">
                    <div className="panel-showcase__chrome">
                        <span />
                        <span />
                        <span />
                        <p>panel.voltaic.host</p>
                    </div>
                    <div className="panel-showcase__viewport">
                        <PanelApp panel={panel} compact />
                    </div>
                </div>

                <div className="panel-showcase__shots">
                    {panel.shots.map((shot) => (
                        <figure key={shot.src} className="panel-showcase__shot">
                            <Link href="/panel" className="panel-showcase__shot-link">
                                <img
                                    src={shot.src}
                                    alt={shot.alt}
                                    loading="lazy"
                                    decoding="async"
                                    width={1280}
                                    height={800}
                                />
                            </Link>
                            <figcaption>{shot.caption}</figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </div>
    );
}
