import { useState } from 'react';

const STORAGE_KEY = 'voltaic-panel-timezone';

function readStoredTimezone(fallback: string): string {
    if (typeof window === 'undefined') {
        return fallback;
    }
    return window.localStorage.getItem(STORAGE_KEY) ?? fallback;
}

export function useTimezone(defaultZone = 'UTC') {
    const [timezone, setTimezoneState] = useState(() => readStoredTimezone(defaultZone));

    const setTimezone = (value: string) => {
        setTimezoneState(value);
        window.localStorage.setItem(STORAGE_KEY, value);
    };

    return { timezone, setTimezone };
}
