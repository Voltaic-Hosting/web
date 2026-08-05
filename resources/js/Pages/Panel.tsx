import { Link } from '@inertiajs/react';
import PanelApp from '@/Components/PanelApp';
import SeoHead from '@/Components/SeoHead';
import type { PageProps, PanelConcept } from '@/types';

interface PanelProps extends PageProps {
    panel: PanelConcept;
}

export default function Panel({ panel, site }: PanelProps) {
    return (
        <div className="panel-page">
            <SeoHead title="Voltaic Panel concept" description={panel.lede} path="/panel" noindex />

            <div className="panel-page__banner">
                <div className="panel-page__banner-inner">
                    <p className="panel-page__note">{panel.concept_note}</p>
                    <Link href="/" className="panel-page__back">
                        Back to {site.name}
                    </Link>
                </div>
            </div>

            <div className="panel-page__stage">
                <PanelApp panel={panel} />
            </div>
        </div>
    );
}
