import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AtlasPoint, NodesCount, NodesData } from '../../types';
import { getNodesData } from '../../shared/api/nodesApi';

type Ctx = {
    loading: boolean;
    error: string | null;
    points: AtlasPoint[];
    counts: NodesCount;
    refresh: () => Promise<void>;
};

const NodesCtx = createContext<Ctx | null>(null);

export function NodesProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);
    const [points, setPoints]   = useState<AtlasPoint[]>([]);
    const [counts, setCounts]   = useState<NodesCount>({});

    const refresh = async () => {
        setError(null);
        setLoading(true);
        try {
            const data: NodesData = await getNodesData();
            setPoints(data.points);
            setCounts(data.counts);
        } catch (e: any) {
            setError(e?.message || String(e));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void refresh(); }, []);

    const value = useMemo<Ctx>(() => ({ loading, error, points, counts, refresh }), [loading, error, points, counts]);

    return <NodesCtx.Provider value={value}>{children}</NodesCtx.Provider>;
}

export function useNodes() {
    const ctx = useContext(NodesCtx);
    if (!ctx) throw new Error('useNodes must be used within <NodesProvider>');
    return ctx;
}
