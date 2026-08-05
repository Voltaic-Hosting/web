import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import BrandMark from '@/Components/BrandMark';
import { isActiveRoute, routeFor } from '@/lib/routes';
import type { SiteConfig } from '@/types';

interface HeaderProps {
    site: SiteConfig;
    menuOpen: boolean;
    onToggleMenu: () => void;
    onNavigate: () => void;
}

export default function Header({ site, menuOpen, onToggleMenu, onNavigate }: HeaderProps) {
    const { url } = usePage();

    return (
        <header className="site-header">
            <div className="site-container site-header__inner">
                <BrandMark site={site} onClick={onNavigate} />

                <nav className="site-nav" aria-label="Primary">
                    {site.nav.map((item) => (
                        <NavLink
                            key={item.route}
                            href={routeFor(item.route)}
                            label={item.label}
                            active={isActiveRoute(url, routeFor(item.route))}
                        />
                    ))}
                </nav>

                <Link href="/contact" className="btn btn--ghost site-header__cta">
                    Contact
                </Link>

                <button
                    type="button"
                    className="menu-toggle"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-nav"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    onClick={onToggleMenu}
                >
                    {menuOpen ? (
                        <X size={20} aria-hidden="true" />
                    ) : (
                        <Menu size={20} aria-hidden="true" />
                    )}
                </button>
            </div>

            <nav
                id="mobile-nav"
                className={`mobile-nav site-container ${menuOpen ? 'is-open' : ''}`}
                aria-label="Mobile"
            >
                {site.nav.map((item) => (
                    <NavLink
                        key={item.route}
                        href={routeFor(item.route)}
                        label={item.label}
                        active={isActiveRoute(url, routeFor(item.route))}
                        onClick={onNavigate}
                    />
                ))}
                <Link href="/contact" className="nav-link" onClick={onNavigate}>
                    Contact
                </Link>
            </nav>
        </header>
    );
}

function NavLink({
    href,
    label,
    active,
    onClick,
}: {
    href: string;
    label: string;
    active: boolean;
    onClick?: () => void;
}) {
    return (
        <Link
            href={href}
            className={`nav-link${active ? ' is-active' : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={onClick}
        >
            {label}
        </Link>
    );
}
