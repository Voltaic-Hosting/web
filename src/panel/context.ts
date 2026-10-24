import { getContext, setContext } from 'svelte';
import type { PanelSimulation } from './simulation.svelte';

const PANEL_SIMULATION = Symbol('panel-simulation');

export function setPanelSimulation(sim: PanelSimulation): void {
    setContext(PANEL_SIMULATION, sim);
}

export function getPanel(): PanelSimulation {
    const sim = getContext<PanelSimulation>(PANEL_SIMULATION);
    if (!sim) {
        throw new Error('Panel simulation is not available in this context');
    }
    return sim;
}
