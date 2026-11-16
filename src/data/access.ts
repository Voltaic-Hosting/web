export interface AccessPoint {
    id: 'tor' | 'i2p' | 'yggdrasil' | 'reticulum';
    name: string;
    network: string;
    description: string;
    status: 'planned' | 'active';
    url?: string;
    address?: string;
}

export const accessPoints: AccessPoint[] = [
    {
        id: 'tor',
        name: 'Tor',
        network: 'Onion service',
        description: 'The site and panel are mirrored here as an onion service.',
        status: 'planned',
    },
    {
        id: 'i2p',
        name: 'I2P',
        network: 'I2P tunnel',
        description: 'The site and panel are mirrored here over I2P.',
        status: 'planned',
    },
    {
        id: 'yggdrasil',
        name: 'Yggdrasil',
        network: 'Mesh network',
        description: 'The site and panel are mirrored here on the Yggdrasil mesh.',
        status: 'planned',
    },
    {
        id: 'reticulum',
        name: 'Reticulum',
        network: 'Reticulum network',
        description: 'The site and panel are mirrored here on the Reticulum network.',
        status: 'planned',
    },
];
