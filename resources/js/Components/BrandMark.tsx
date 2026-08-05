import { Link } from '@inertiajs/react';
import type { SiteConfig } from '@/types';

interface BrandMarkProps {
    site: SiteConfig;
    href?: string;
    className?: string;
    onClick?: () => void;
}

export default function BrandMark({ site, href = '/', className = '', onClick }: BrandMarkProps) {
    const classes = ['brand-mark', className].filter(Boolean).join(' ');

    return (
        <Link href={href} className={classes} onClick={onClick}>
            <img
                className="brand-mark__img"
                src="/brand/logo-dark.png"
                alt=""
                width={40}
                height={43}
                decoding="async"
            />
            <span className="brand-mark__text">{site.name}</span>
        </Link>
    );
}
