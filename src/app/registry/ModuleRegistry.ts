import type { ModuleDefinition } from './types';

type Loader = () => Promise<{ default: ModuleDefinition }>;
const registry: { id: string; loader: Loader }[] = [];

export function registerModule(id: string, loader: Loader) {
    registry.push({ id, loader });
}

export async function loadAllModules(): Promise<ModuleDefinition[]> {
    const mods = await Promise.all(registry.map(r => r.loader()));
    return mods.map(m => m.default);
}
