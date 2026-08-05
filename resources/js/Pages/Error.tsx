import { Link, usePage } from '@inertiajs/react';
import Button from '@/Components/Button';
import Layout from '@/Components/Layout';
import SeoHead from '@/Components/SeoHead';
import type { PageProps } from '@/types';

interface ErrorProps {
    status: number;
    title: string;
    description: string;
}

const helpfulLinks = [
    { href: '/', label: 'Home' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/panel', label: 'Panel' },
] as const;

export default function Error({ status, title, description }: ErrorProps) {
    const { site } = usePage<PageProps>().props;
    const siteName = site?.name ?? 'Voltaic Hosting';

    return (
        <Layout>
            <SeoHead title={title} description={description} path={`/${status}`} noindex />

            <section className="error-page" aria-labelledby="error-title">
                <div className="site-container site-container--narrow">
                    <p className="error-page__code" aria-hidden="true">
                        {status}
                    </p>
                    <p className="error-page__eyebrow">Error {status}</p>
                    <h1 className="error-page__title" id="error-title">
                        {title}
                    </h1>
                    <p className="error-page__lede">{description}</p>

                    <div className="error-page__actions">
                        <Button href="/">Back to home</Button>
                        {status === 419 ? (
                            <button
                                type="button"
                                className="btn btn--ghost"
                                onClick={() => window.location.reload()}
                            >
                                Refresh page
                            </button>
                        ) : (
                            <Button href="/contact" variant="ghost">
                                Contact {siteName}
                            </Button>
                        )}
                    </div>

                    <nav className="error-page__nav" aria-label="Helpful links">
                        <p className="error-page__nav-label">Helpful pages</p>
                        <ul className="error-page__nav-list">
                            {helpfulLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="error-page__nav-link">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </section>
        </Layout>
    );
}
