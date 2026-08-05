import Button from '@/Components/Button';
import Layout from '@/Components/Layout';
import PageHero from '@/Components/PageHero';
import SectionAnchor from '@/Components/SectionAnchor';
import SeoHead from '@/Components/SeoHead';
import { sectionId } from '@/lib/sectionId';
import { faqPageJsonLd } from '@/lib/seo';
import type { FaqContent, FaqGroup, PageProps } from '@/types';

interface FaqProps extends PageProps {
    faq: FaqContent;
}

function flatItems(groups: FaqGroup[]) {
    return groups.flatMap((group) => group.items);
}

export default function Faq({ faq, site }: FaqProps) {
    const items = flatItems(faq.groups);

    return (
        <Layout>
            <SeoHead
                title="FAQ"
                description={faq.intro}
                path="/faq"
                jsonLd={faqPageJsonLd(site, {
                    name: `FAQ · ${site.name}`,
                    path: '/faq',
                    description: faq.intro,
                    items,
                })}
            />

            <PageHero id="faq" title="FAQ" lede={faq.intro}>
                <Button href="/contact">Contact</Button>
                <Button href="/about" variant="ghost">
                    About
                </Button>
            </PageHero>

            <section className="section section--tight" aria-label="FAQ topics">
                <div className="site-container site-container--narrow">
                    <nav className="faq-toc" aria-label="Jump to a topic">
                        {faq.groups.map((group) => {
                            const id = sectionId(group.title);

                            return (
                                <a key={group.title} href={`#${id}`} className="faq-toc__link">
                                    {group.title}
                                </a>
                            );
                        })}
                    </nav>
                </div>
            </section>

            <div className="faq-page">
                {faq.groups.map((group) => {
                    const id = sectionId(group.title);

                    return (
                        <section key={group.title} className="section section--tight" id={id}>
                            <div className="site-container site-container--narrow">
                                <div className="faq-group">
                                    <h2 className="faq-group__title">
                                        <span className="section__heading">
                                            <SectionAnchor id={id} label={group.title} />
                                            {group.title}
                                        </span>
                                    </h2>

                                    <div className="faq-list">
                                        {group.items.map((item) => (
                                            <details key={item.question} className="faq-item">
                                                <summary className="faq-item__question">
                                                    <span
                                                        className="faq-item__marker"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="faq-item__question-text">
                                                        {item.question}
                                                    </span>
                                                </summary>
                                                <div className="faq-item__answer">
                                                    {item.answer.map((paragraph) => (
                                                        <p key={paragraph}>{paragraph}</p>
                                                    ))}
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>

            <section className="section" id="still-need-help">
                <div className="site-container site-container--narrow">
                    <div className="cta-panel">
                        <h2 className="cta-panel__title">
                            <span className="section__heading">
                                <SectionAnchor id="still-need-help" label="Still need help" />
                                Still need help
                            </span>
                        </h2>
                        <p className="cta-panel__body">
                            Send the details that matter and I will reply within two business days,
                            Monday through Friday.
                        </p>
                        <div className="cta-panel__actions">
                            <Button href="/contact">Contact</Button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
