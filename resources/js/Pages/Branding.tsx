import BrandingAssetCard from '@/Components/BrandingAssetCard';
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

            <PageHero id="branding" title="Branding" lede={branding.intro} compact />

            <section className="section section--tight section--flush-top" id="assets">
                <div className="site-container">
                    <div className="section__intro section__intro--compact">
                        <h2 className="section__title">
                            <span className="section__heading">
                                <SectionAnchor id="assets" label="Assets" />
                                Assets
                            </span>
                        </h2>
                    </div>
                    <div className="branding-grid">
                        {branding.assets.map((asset) => (
                            <BrandingAssetCard key={asset.key} asset={asset} />
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
