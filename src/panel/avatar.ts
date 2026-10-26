export function hashSeed(seed: string): number {
    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
        hash = (hash << 5) - hash + seed.charCodeAt(index);
        hash |= 0;
    }
    return Math.abs(hash);
}

export const palettes = [
    ['#047857', '#0b0c0f'],
    ['#0f766e', '#0b0c0f'],
    ['#1d4ed8', '#0b0c0f'],
    ['#475569', '#0b0c0f'],
    ['#92400e', '#0b0c0f'],
    ['#9f1239', '#0b0c0f'],
    ['#334155', '#0b0c0f'],
] as const;

export const avatarColorOptions = palettes.map(([color]) => color);
