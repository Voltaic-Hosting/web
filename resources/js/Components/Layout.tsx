import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import type { PageProps } from '@/types';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }: PropsWithChildren) {
    const { site } = usePage<PageProps>().props;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="site-shell">
            <a href="#main" className="skip-link">
                Skip to content
            </a>

            <Header
                site={site}
                menuOpen={menuOpen}
                onToggleMenu={() => setMenuOpen((open) => !open)}
                onNavigate={() => setMenuOpen(false)}
            />

            <main id="main">{children}</main>

            <Footer site={site} />
        </div>
    );
}
