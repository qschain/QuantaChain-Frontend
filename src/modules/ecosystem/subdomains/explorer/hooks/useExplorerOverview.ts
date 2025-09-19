import { useEffect, useState } from 'react';
import { api } from '../shared/api/api';
import type { ChainOverview } from '../state/types';

export function useExplorerOverview() {
    const [overview, setOverview] = useState<ChainOverview>();

    useEffect(() => {
        let t:number|undefined;

        const run = async () => {
            try { setOverview(await api.getOverview()); } catch {}
        };
        run();
        t = window.setInterval(run, 5000);

        return () => { if (t) clearInterval(t); };
    }, []);

    return { overview };
}
