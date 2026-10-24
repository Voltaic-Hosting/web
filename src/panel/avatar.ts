export function hashSeed(seed: string): number {
    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
        hash = (hash << 5) - hash + seed.charCodeAt(index);
        hash |= 0;
    }
    return Math.abs(hash);
}

export const palettes = [
    ['#b45309', '#1c1916'],
    ['#3f7d4e', '#1c1916'],
    ['#0f766e', '#1c1916'],
    ['#9a3412', '#1c1916'],
    ['#854d0e', '#1c1916'],
    ['#1d4ed8', '#1c1916'],
] as const;

export const avatarColorOptions = palettes.map(([color]) => color);
