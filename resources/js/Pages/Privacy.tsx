import Button from '@/Components/Button';
import Layout from '@/Components/Layout';
import PageHero from '@/Components/PageHero';
import Prose from '@/Components/Prose';
import SeoHead from '@/Components/SeoHead';
import type { LegalDocument, LegalMeta, PageProps } from '@/types';

interface PrivacyProps extends PageProps {
    legal: LegalMeta;
    content: LegalDocument;
}

export default function Privacy({ legal, content, site }: PrivacyProps) {
    return (
        <Layout>
            <SeoHead
                title="Privacy"
                description="Voltaic Hosting privacy policy. No ads, no tracking, no telemetry."
                path="/privacy"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'Privacy policy',
                    url: `${site.domain}/privacy`,
                    description:
                        'Voltaic Hosting privacy policy. No ads, no tracking, no telemetry.',
                    datePublished: legal.effective_date,
                    isPartOf: {
                        '@type': 'WebSite',
                        name: site.name,
                        url: site.domain,
                    },
                }}
            />

            <PageHero
                id="privacy"
                align="center"
                title="Privacy policy"
                lede={`Effective ${legal.effective_date}. Operated by ${legal.operator}.`}
            />

            <section className="section section--tight">
                <div className="site-container site-container--narrow legal-doc">
                    <Prose intro={content.intro} sections={content.sections} />
                    <div className="page-hero__actions legal-doc__actions">
                        <Button href="/terms" variant="ghost">
                            Terms of use
                        </Button>
                        <Button href="/contact">Contact</Button>
                    </div>
                    <p className="site-footer__note legal-doc__note">{site.privacyNote}</p>
                </div>
            </section>
        </Layout>
    );
}
