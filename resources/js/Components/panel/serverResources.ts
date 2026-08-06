import type { PanelServer } from '@/types';

export interface ServerResourceTotals {
    cpu_cores: number;
    ram_gb: number;
    disk_gb: number;
}

export function serverResourceTotals(server: PanelServer): ServerResourceTotals {
    if (server.cpu_cores && server.ram_gb && server.disk_gb) {
        return {
            cpu_cores: server.cpu_cores,
            ram_gb: server.ram_gb,
            disk_gb: server.disk_gb,
        };
    }

    switch (server.type) {
        case 'Bare metal':
            return { cpu_cores: 32, ram_gb: 256, disk_gb: 4000 };
        case 'Container':
            return { cpu_cores: 4, ram_gb: 8, disk_gb: 80 };
        case 'MicroVM':
            return { cpu_cores: 2, ram_gb: 4, disk_gb: 40 };
        case 'Game Servers':
        case 'Game':
            return { cpu_cores: 8, ram_gb: 16, disk_gb: 500 };
        default:
            return { cpu_cores: 4, ram_gb: 8, disk_gb: 100 };
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
