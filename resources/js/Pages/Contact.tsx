import Layout from '@/Components/Layout';
import PageHero from '@/Components/PageHero';
import SectionAnchor from '@/Components/SectionAnchor';
import SeoHead from '@/Components/SeoHead';
import type { PageProps, Service } from '@/types';

interface ContactProps extends PageProps {
    services: Service[];
}

export default function Contact({ services, site }: ContactProps) {
    return (
        <Layout>
            <SeoHead
                title="Contact"
                description={`Contact ${site.name} at ${site.contact.email}.`}
                path="/contact"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'ContactPage',
                    name: `Contact ${site.name}`,
                    url: `${site.domain}/contact`,
                    mainEntity: {
                        '@type': 'Organization',
                        name: site.name,
                        email: site.contact.email,
                        url: site.domain,
                    },
                }}
            />

            <PageHero
                id="contact"
                title="Contact"
                lede="Send email with your requirements, current setup, and timeline. Attach configuration details if they help."
            />

            <section className="section" id="email">
                <div className="site-container site-container--narrow">
                    <div className="info-panel">
                        <div className="info-panel__block">
                            <p className="info-panel__label">Email</p>
                            <p className="info-panel__value">
                                <a href={`mailto:${site.contact.email}`} className="info-link">
                                    {site.contact.email}
                                </a>
                            </p>
                            <p className="info-panel__meta">{site.contact.response_time}</p>
                        </div>

                        <div className="info-panel__block" id="services">
                            <h2 className="section__title section__title--compact">
                                <span className="section__heading">
                                    <SectionAnchor id="services" label="Services" />
                                    Services
                                </span>
                            </h2>
                            <div className="service-list">
                                {services.map((service) => (
                                    <div key={service.slug} className="service-list__item">
                                        <p className="service-list__title">
                                            {service.title}
                                            {service.badge ? (
                                                <span className="service-list__badge">
                                                    {service.badge}
                                                </span>
                                            ) : null}
                                        </p>
                                        <p className="service-list__summary">{service.summary}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
