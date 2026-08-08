import Button from '@/Components/Button';
import CtaPanel from '@/Components/CtaPanel';
import Layout from '@/Components/Layout';
import PanelShowcase from '@/Components/PanelShowcase';
import Section from '@/Components/Section';
import SectionAnchor from '@/Components/SectionAnchor';
import SeoHead from '@/Components/SeoHead';
import ServiceCard from '@/Components/ServiceCard';
import ValueCard from '@/Components/ValueCard';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import type { PageProps, PanelConcept, Service, Value } from '@/types';

interface HomeProps extends PageProps {
    hero_lede: string;
    services: Service[];
    values: Value[];
    panel: PanelConcept;
}

export default function Home({ hero_lede, services, values, panel, site }: HomeProps) {
    return (
        <Layout>
            <SeoHead path="/" jsonLd={[organizationJsonLd(site), websiteJsonLd(site)]} />

            <section className="home-hero" id="hero">
                <div className="site-container home-hero__content">
                    <h1 className="home-hero__title">
                        <span className="section__heading">
                            <SectionAnchor id="hero" label="Hero" />
                            {site.tagline}
                        </span>
                    </h1>
                    <p className="home-hero__lede">{hero_lede}</p>
                    <div className="page-hero__actions">
                        <Button href="/contact">Contact</Button>
                        <Button href="/about" variant="ghost">
                            About us
                        </Button>
                    </div>
                </div>
            </section>

            <section className="section" id="panel">
                <div className="site-container">
                    <PanelShowcase panel={panel} />
                </div>
            </section>

            <Section
                id="services"
                title="Services"
                lede="Panel software, servers, networking, and security work. Anything marked Soon is not available yet."
            >
                <div className="service-grid">
                    {services.map((service) => (
                        <ServiceCard key={service.slug} service={service} />
                    ))}
                </div>
            </Section>

            <Section
                id="values"
                title="Billing, privacy, and exit"
                lede="Cancel when you want. Pay what was quoted. Keep your data off the sales floor."
            >
                <div className="value-grid">
                    {values.map((value) => (
                        <ValueCard key={value.title} value={value} />
                    ))}
                </div>
            </Section>

            <section className="section" id="contact">
                <div className="site-container">
                    <CtaPanel
                        title="Request information"
                        body="Email me with your current environment and requirements. I reply within two business days on weekdays."
                        anchorId="contact"
                    />
                </div>
            </section>
        </Layout>
    );
}
