import { Link } from '@inertiajs/react';
import Button from '@/Components/Button';
import Layout from '@/Components/Layout';
import SeoHead from '@/Components/SeoHead';
import type { PageProps } from '@/types';

interface ErrorProps extends PageProps {
    status: number;
}

const messages: Record<number, { title: string; description: string }> = {
    403: {
        title: 'Access denied',
        description: 'You do not have permission to view this page.',
    },
    404: {
        title: 'Page not found',
        description: 'The page you requested is not on this site.',
    },
    500: {
        title: 'Server error',
        description: 'Something failed while loading this page. Try again in a few minutes.',
    },
    503: {
        title: 'Service unavailable',
        description: 'The site is temporarily unavailable. Try again shortly.',
    },
};

export default function Error({ status, site }: ErrorProps) {
    const message = messages[status] ?? {
        title: 'Error',
        description: 'An unexpected error occurred.',
    };

    return (
        <Layout>
            <SeoHead
                title={message.title}
                description={message.description}
                path={`/${status}`}
                noindex
            />

            <section className="page-hero">
                <div className="site-container">
                    <p className="page-hero__eyebrow">Error {status}</p>
                    <h1 className="page-hero__title">{message.title}</h1>
                    <p className="page-hero__lede">{message.description}</p>
                    <div className="page-hero__actions">
                        <Button href="/">Back to home</Button>
                        <Link href="/contact" className="btn btn--ghost">
                            Contact {site.name}
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
