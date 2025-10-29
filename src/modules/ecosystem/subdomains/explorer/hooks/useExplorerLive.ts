import { useEffect, useRef, useState } from 'react';
import { api } from '../shared/api/api';
import type { BlockItem, LatestTxItem } from '../state/types';

type Flagged<T> = T & { __justAdded?: boolean };

const LIMIT = 10;
const POLL  = 3000;

export default function useExplorerLive() {
    const [blocks, setBlocks] = useState<Array<Flagged<BlockItem>>>([]);
    const [txs, setTxs]       = useState<Array<Flagged<LatestTxItem>>>([]);
    const running = useRef(false);
    const timer   = useRef<number | null>(null);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const init = await api.getLatestBlocks(LIMIT);
                if (!alive) return;
                const items = (init.items ?? []).slice(0, LIMIT).map(b => ({ ...b, __justAdded: false }));
                setBlocks(items);
                setTxs([]); // 首帧无交易
            } catch {
                // TODO: 全局错误提示按需加入
            }
        })();

        const tick = async () => {
            if (running.current) return;
            if (document.visibilityState !== 'visible') return;
            running.current = true;
            try {
                const { block: newBlock, txs: newTxs } = await api.getLatestHead();

                setBlocks(prev => {
                    if (!prev?.length) return [{ ...newBlock, __justAdded: true }];

                    const dup =
                        prev[0]?.hash === newBlock.hash ||
                        prev.some(b => String(b.number) === String(newBlock.number));

                    if (dup) return prev;

                    const next = [
                        { ...newBlock, __justAdded: true },
                        ...prev.map(b => ({ ...b, __justAdded: false })),
                    ];
                    return next.slice(0, LIMIT);
                });

                setTxs(newTxs.slice(0, LIMIT).map(x => ({ ...x, __justAdded: true })));
            } finally {
                running.current = false;
            }
        };

        timer.current = window.setInterval(tick, POLL) as unknown as number;

        const onVis = () => {
            if (document.visibilityState === 'visible') tick();
        };
        document.addEventListener('visibilitychange', onVis);

        return () => {
            alive = false;
            if (timer.current) {
                clearInterval(timer.current);
                timer.current = null;
            }
            document.removeEventListener('visibilitychange', onVis);
        };
    }, []);

    return { blocks, txs };
}
