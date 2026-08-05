function hashSeed(seed: string): number {
    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
        hash = (hash << 5) - hash + seed.charCodeAt(index);
        hash |= 0;
    }
    return Math.abs(hash);
}

const palettes = [
    ['#b45309', '#1c1916'],
    ['#3f7d4e', '#1c1916'],
    ['#0f766e', '#1c1916'],
    ['#9a3412', '#1c1916'],
    ['#854d0e', '#1c1916'],
    ['#1d4ed8', '#1c1916'],
] as const;

export const avatarColorOptions = palettes.map(([color]) => color);

export function UserAvatar({
    seed,
    name,
    size = 32,
    color,
}: {
    seed: string;
    name: string;
    size?: number;
    color?: string | null;
}) {
    const hash = hashSeed(seed || name);
    const palette = palettes[hash % palettes.length];
    const [fg, bg] = color ? [color, '#1c1916'] : palette;
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');

    return (
        <span
            className="panel-avatar"
            style={{
                width: size,
                height: size,
                background: `linear-gradient(135deg, ${fg}, ${bg})`,
                fontSize: Math.max(10, size * 0.36),
            }}
            aria-hidden="true"
            title={name}
        >
            {initials || '?'}
        </span>
    );
}
