import Layout from '@/Components/Layout';
import PageHero from '@/Components/PageHero';
import SectionAnchor from '@/Components/SectionAnchor';
import SeoHead from '@/Components/SeoHead';
import type { BrandingContent, PageProps } from '@/types';

interface BrandingProps extends PageProps {
    branding: BrandingContent;
}

export default function Branding({ branding, site }: BrandingProps) {
    return (
        <Layout>
            <SeoHead
                title="Branding"
                description={`${site.name} logo files for press, partners, and documentation.`}
                path="/branding"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: `${site.name} branding`,
                    url: `${site.domain}/branding`,
                    description: branding.intro,
                    isPartOf: {
                        '@type': 'WebSite',
                        name: site.name,
                        url: site.domain,
                    },
                }}
            />

            <PageHero id="branding" title="Branding" lede={branding.intro} />

            <section className="section section--tight" id="assets">
                <div className="site-container">
                    <div className="section__intro">
                        <h2 className="section__title">
                            <span className="section__heading">
                                <SectionAnchor id="assets" label="Assets" />
                                Assets
                            </span>
                        </h2>
                    </div>
                    <div className="branding-grid">
                        {branding.assets.map((asset) => (
                            <article key={asset.key} className="branding-card">
                                <div
                                    className={`branding-card__preview branding-card__preview--${asset.preview}`}
                                >
                                    <img
                                        src={asset.path}
                                        alt=""
                                        className="branding-card__image"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                <div className="branding-card__body">
                                    <h2 className="branding-card__title">{asset.label}</h2>
                                    <p className="branding-card__description">
                                        {asset.description}
                                    </p>
                                    <p className="branding-card__meta">
                                        {asset.format} · {asset.dimensions}
                                    </p>
                                    <a
                                        href={asset.path}
                                        className="btn btn--ghost branding-card__download"
                                        download
                                    >
                                        Download
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
