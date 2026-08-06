import { useSyncExternalStore } from 'react';
import { getThemeSnapshot, setTheme, subscribeTheme, toggleTheme, type Theme } from '@/lib/theme';

function getServerThemeSnapshot(): Theme {
    return 'light';
}

export function useTheme() {
    const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

    return {
        theme,
        setTheme,
        toggleTheme: () => toggleTheme(),
    };
}
