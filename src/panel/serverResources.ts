import type { PanelServer } from '@/data/types';

export interface ServerResourceTotals {
    cpuCores: number;
    ramGb: number;
    diskGb: number;
}

export function serverResourceTotals(server: PanelServer): ServerResourceTotals {
    if (server.cpuCores && server.ramGb && server.diskGb) {
        return {
            cpuCores: server.cpuCores,
            ramGb: server.ramGb,
            diskGb: server.diskGb,
        };
    }

    switch (server.type) {
        case 'Bare metal':
            return { cpuCores: 32, ramGb: 256, diskGb: 4000 };
        case 'Container':
            return { cpuCores: 4, ramGb: 8, diskGb: 80 };
        case 'MicroVM':
            return { cpuCores: 2, ramGb: 4, diskGb: 40 };
        case 'Game Servers':
        case 'Game':
            return { cpuCores: 8, ramGb: 16, diskGb: 500 };
        default:
            return { cpuCores: 4, ramGb: 8, diskGb: 100 };
    }
}

export function formatCpuUsage(percent: number, cores: number): string {
    const used = (percent / 100) * cores;
    return `${used.toFixed(1)} / ${cores} vCPU`;
}

export function formatRamUsage(percent: number, totalGb: number): string {
    const used = (percent / 100) * totalGb;
    return `${used.toFixed(1)} / ${totalGb} GB`;
}

export function formatDiskUsage(percent: number, totalGb: number): string {
    const used = (percent / 100) * totalGb;
    const usedLabel = totalGb >= 1000 ? `${(used / 1000).toFixed(2)} TB` : `${used.toFixed(1)} GB`;
    const totalLabel = totalGb >= 1000 ? `${(totalGb / 1000).toFixed(1)} TB` : `${totalGb} GB`;
    return `${usedLabel} / ${totalLabel}`;
}
