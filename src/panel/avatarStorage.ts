import type { PanelProfile } from '@/data/types';

const PROFILE_KEY = 'voltaic-panel-profile';
const AVATAR_DB = 'voltaic-panel';
const AVATAR_STORE = 'avatar';
const AVATAR_KEY = 'profile';

function openAvatarDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(AVATAR_DB, 1);
        request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains(AVATAR_STORE)) {
                request.result.createObjectStore(AVATAR_STORE);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function loadProfileDraft(): Partial<PanelProfile> | null {
    if (typeof localStorage === 'undefined') {
        return null;
    }

    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as Partial<PanelProfile>;
    } catch {
        return null;
    }
}

export function saveProfileDraft(
    draft: Pick<PanelProfile, 'name' | 'email' | 'avatarSeed' | 'avatarColor'>,
): void {
    if (typeof localStorage === 'undefined') {
        return;
    }

    localStorage.setItem(PROFILE_KEY, JSON.stringify(draft));
}

export function clearProfileDraft(): void {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(PROFILE_KEY);
    }
}

export async function loadAvatarImage(): Promise<string | null> {
    if (typeof indexedDB === 'undefined') {
        return null;
    }

    const db = await openAvatarDb();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(AVATAR_STORE, 'readonly');
        const request = tx.objectStore(AVATAR_STORE).get(AVATAR_KEY);
        request.onsuccess = () =>
            resolve(typeof request.result === 'string' ? request.result : null);
        request.onerror = () => reject(request.error);
    });
}

export async function saveAvatarImage(dataUrl: string): Promise<void> {
    if (typeof indexedDB === 'undefined') {
        return;
    }

    const db = await openAvatarDb();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(AVATAR_STORE, 'readwrite');
        tx.objectStore(AVATAR_STORE).put(dataUrl, AVATAR_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function clearAvatarImage(): Promise<void> {
    if (typeof indexedDB === 'undefined') {
        return;
    }

    const db = await openAvatarDb();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(AVATAR_STORE, 'readwrite');
        tx.objectStore(AVATAR_STORE).delete(AVATAR_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export function readImageFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
                return;
            }
            reject(new Error('Could not read image file'));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}
