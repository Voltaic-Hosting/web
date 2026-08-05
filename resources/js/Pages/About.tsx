import Button from '@/Components/Button';
import Layout from '@/Components/Layout';
import PageHero from '@/Components/PageHero';
import Section from '@/Components/Section';
import SectionAnchor from '@/Components/SectionAnchor';
import SeoHead from '@/Components/SeoHead';
import ValueCard from '@/Components/ValueCard';
import { sectionId } from '@/lib/sectionId';
import { webPageJsonLd } from '@/lib/seo';
import type { AboutContent, PageProps, Value } from '@/types';

interface AboutProps extends PageProps {
    values: Value[];
    about: AboutContent;
}

export default function About({ values, about, site }: AboutProps) {
    return (
        <Layout>
            <SeoHead
                title="About"
                description={about.intro}
                path="/about"
                jsonLd={webPageJsonLd(site, {
                    name: `About ${site.name}`,
                    path: '/about',
                    description: about.intro,
                    type: 'AboutPage',
                })}
            />

            <PageHero id="about" title="About" lede={about.intro}>
                <Button href="/contact">Contact</Button>
            </PageHero>

            <section className="section section--tight" id="company">
                <div className="site-container site-container--narrow">
                    <div className="prose-block about-prose">
                        {about.sections.map((section) => {
                            const id = sectionId(section.title);

                            return (
                                <section key={section.title} id={id}>
                                    <h2>
                                        <span className="section__heading">
                                            <SectionAnchor id={id} label={section.title} />
                                            {section.title}
                                        </span>
                                    </h2>
                                    {section.paragraphs.map((paragraph) => (
                                        <p key={paragraph}>{paragraph}</p>
                                    ))}
                                </section>
                            );
                        })}
                    </div>
                </div>
            </section>

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

            <section className="section" id="details">
                <div className="site-container site-container--narrow">
                    <div className="section__intro">
                        <h2 className="section__title">
                            <span className="section__heading">
                                <SectionAnchor id="details" label="Details" />
                                Details
                            </span>
                        </h2>
                    </div>
                    <div className="info-panel">
                        <div className="info-panel__block">
                            <p className="info-panel__label">Founder</p>
                            <p className="info-panel__value">Ivan (Sudo-Ivan)</p>
                        </div>

                        <div className="info-panel__block">
                            <p className="info-panel__label">Company</p>
                            <p className="info-panel__value">{site.name}</p>
                            <p className="info-panel__meta">United States · Solo</p>
                        </div>

                        <div className="info-panel__block">
                            <p className="info-panel__label">Payments</p>
                            <p className="info-panel__value">USD, EUR, Monero</p>
                            <p className="info-panel__meta">
                                Fiat via Stripe · 30-day refund window
                            </p>
                        </div>

                        <div className="info-panel__block">
                            <p className="info-panel__label">Contact</p>
                            <p className="info-panel__value">
                                <a href={`mailto:${site.contact.email}`} className="info-link">
                                    {site.contact.email}
                                </a>
                            </p>
                            <p className="info-panel__meta">{site.contact.response_time}</p>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
