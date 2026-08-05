import { Link } from '@inertiajs/react';
import BrandMark from '@/Components/BrandMark';
import { routeFor } from '@/lib/routes';
import type { SiteConfig } from '@/types';

interface FooterProps {
    site: SiteConfig;
}

export default function Footer({ site }: FooterProps) {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="site-container">
                <div className="site-footer__top">
                    <div>
                        <BrandMark site={site} className="brand-mark--footer" />
                        <p className="site-footer__tagline">{site.tagline}</p>
                        <p className="site-footer__note">{site.privacyNote}</p>
                    </div>

                    <div className="site-footer__columns">
                        <div className="site-footer__links">
                            <p className="site-footer__heading">Site</p>
                            {site.nav.map((item) => (
                                <Link
                                    key={item.route}
                                    href={routeFor(item.route)}
                                    className="site-footer__link"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link href={routeFor('branding')} className="site-footer__link">
                                Branding
                            </Link>
                        </div>

                        <div className="site-footer__links">
                            <p className="site-footer__heading">Legal</p>
                            {site.footerNav.map((item) => (
                                <Link
                                    key={item.route}
                                    href={routeFor(item.route)}
                                    className="site-footer__link"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="site-footer__links">
                            <p className="site-footer__heading">Contact</p>
                            <a href={`mailto:${site.contact.email}`} className="site-footer__link">
                                {site.contact.email}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="site-footer__bottom">
                    <p>
                        &copy; {year} {site.name}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
