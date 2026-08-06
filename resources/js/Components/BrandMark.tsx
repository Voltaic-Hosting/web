import { Link } from '@inertiajs/react';
import { useTheme } from '@/hooks/useTheme';
import type { SiteConfig } from '@/types';

interface BrandMarkProps {
    site: SiteConfig;
    href?: string;
    className?: string;
    onClick?: () => void;
}

export default function BrandMark({ site, href = '/', className = '', onClick }: BrandMarkProps) {
    const { theme } = useTheme();
    const classes = ['brand-mark', className].filter(Boolean).join(' ');
    const logoSrc = theme === 'dark' ? '/brand/logo-on-dark.png' : '/brand/logo-on-light.png';

    return (
        <Link href={href} className={classes} onClick={onClick}>
            <img
                className="brand-mark__img"
                src={logoSrc}
                alt=""
                width={40}
                height={43}
                decoding="async"
            />
            <span className="brand-mark__text">{site.name}</span>
        </Link>
    );
}
