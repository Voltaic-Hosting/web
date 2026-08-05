import { Box, Cpu, Gamepad2, Server } from 'lucide-react';

const size = 16;

export function ServerTypeIcon({ type }: { type: string }) {
    if (type === 'Container') {
        return <Box size={size} aria-hidden="true" />;
    }
    if (type === 'MicroVM') {
        return <Cpu size={size} aria-hidden="true" />;
    }
    if (type === 'Game' || type === 'Game Servers') {
        return <Gamepad2 size={size} aria-hidden="true" />;
    }
    return <Server size={size} aria-hidden="true" />;
}
