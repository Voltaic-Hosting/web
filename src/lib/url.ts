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
