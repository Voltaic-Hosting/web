export function routeFor(name: string): string {
    switch (name) {
        case 'home':
            return '/';
        case 'about':
            return '/about';
        case 'contact':
            return '/contact';
        case 'branding':
            return '/branding';
        case 'panel':
            return '/panel';
        case 'privacy':
            return '/privacy';
        case 'terms':
            return '/terms';
        case 'sitemap':
            return '/sitemap.xml';
        default:
            return '/';
    }
}

export function isActiveRoute(currentUrl: string, href: string): boolean {
    if (href === '/') {
        return currentUrl === '/';
    }

    return currentUrl.startsWith(href);
}

export function absoluteUrl(domain: string, path = '/'): string {
    const base = domain.replace(/\/$/, '');
    if (path === '/' || path === '') {
        return `${base}/`;
    }

    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
