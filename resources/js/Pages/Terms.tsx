import Button from '@/Components/Button';
import Layout from '@/Components/Layout';
import PageHero from '@/Components/PageHero';
import Prose from '@/Components/Prose';
import SeoHead from '@/Components/SeoHead';
import type { LegalDocument, LegalMeta, PageProps } from '@/types';

interface TermsProps extends PageProps {
    legal: LegalMeta;
    content: LegalDocument;
}

export default function Terms({ legal, content, site }: TermsProps) {
    return (
        <Layout>
            <SeoHead
                title="Terms of use"
                description="Terms of use for the Voltaic Hosting website and contracted services."
                path="/terms"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'Terms of use',
                    url: `${site.domain}/terms`,
                    description: 'Terms of use for the Voltaic Hosting website and services.',
                    datePublished: legal.effective_date,
                    isPartOf: {
                        '@type': 'WebSite',
                        name: site.name,
                        url: site.domain,
                    },
                }}
            />

            <PageHero
                id="terms"
                align="center"
                title="Terms of use"
                lede={`Effective ${legal.effective_date}. Operated by ${legal.operator}.`}
            />

            <section className="section section--tight">
                <div className="site-container site-container--narrow legal-doc">
                    <Prose intro={content.intro} sections={content.sections} />
                    <div className="page-hero__actions legal-doc__actions">
                        <Button href="/privacy" variant="ghost">
                            Privacy policy
                        </Button>
                        <Button href="/contact">Contact</Button>
                    </div>
                    <p className="site-footer__note legal-doc__note">{site.privacyNote}</p>
                </div>
            </section>
        </Layout>
    );
}
