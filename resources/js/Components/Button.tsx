import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

type ButtonVariant = 'solid' | 'ghost';

interface ButtonProps extends PropsWithChildren {
    href: string;
    variant?: ButtonVariant;
}

export default function Button({ href, variant = 'solid', children }: ButtonProps) {
    return (
        <Link href={href} className={`btn btn--${variant}`}>
            {children}
        </Link>
    );
}
