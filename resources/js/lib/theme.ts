export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'voltaic-theme';

const listeners = new Set<() => void>();

function emit(): void {
    listeners.forEach((listener) => listener());
}

export function subscribeTheme(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function getStoredTheme(): Theme | null {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return value === 'light' || value === 'dark' ? value : null;
    } catch {
        return null;
    }
}

export function getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(): Theme {
    return getStoredTheme() ?? getSystemTheme();
}

export function getThemeSnapshot(): Theme {
    if (typeof document === 'undefined') {
        return 'light';
    }

    const current = document.documentElement.dataset.theme;
    return current === 'dark' ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
        meta.setAttribute('content', theme === 'dark' ? '#151311' : '#e7e1d8');
    }

    const colorScheme = document.querySelector('meta[name="color-scheme"]');
    if (colorScheme) {
        colorScheme.setAttribute('content', theme);
    }
}

export function setTheme(theme: Theme): void {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // localStorage may be unavailable in private browsing
    }

    applyTheme(theme);
    emit();
}

export function toggleTheme(): Theme {
    const next = resolveTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
}

let initialized = false;

export function initTheme(): void {
    if (initialized || typeof window === 'undefined') {
        return;
    }

    initialized = true;
    applyTheme(resolveTheme());

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (!getStoredTheme()) {
            applyTheme(getSystemTheme());
            emit();
        }
    });
}
