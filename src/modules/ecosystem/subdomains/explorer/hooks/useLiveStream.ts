import { useEffect, useRef, useState } from 'react';
import { api } from '../shared/api/api';
import { mergeNewStrict } from '../state/merge';
import type { BlockLite, TxLite } from '../state/types';

type Flagged<T> = T & { __justAdded?: boolean };
const LIMIT = 10;
const POLL  = 3000;

/* ===== 函数重载签名 ===== */
export function useLiveStream(kind: 'blocks'): Array<Flagged<BlockLite>> | undefined;
export function useLiveStream(kind: 'txs'):    Array<Flagged<TxLite>>    | undefined;

/* ===== 实现 ===== */
export function useLiveStream(kind: 'blocks' | 'txs') {
    // 用 any 存内部状态，配合重载保证对外类型安全
    const [rows, setRows] = useState<any[] | undefined>(undefined);
    const running = useRef(false);
    const timer   = useRef<number>();

    useEffect(() => {
        const isBlocks = kind === 'blocks';

        const first = async () => {
            if (isBlocks) {
                const d = await api.getLatestBlocks(LIMIT);
                setRows(mergeNewStrict<BlockLite>(undefined, d.items, 'hash', LIMIT));
            } else {
                const d = await api.getLatestTxs(LIMIT);
                setRows(mergeNewStrict<TxLite>(undefined, d.items, 'hash', LIMIT));
            }
        };
        first();

        const tick = async () => {
            if (running.current) return;
            running.current = true;
            try {
                if (document.visibilityState === 'visible') {
                    if (isBlocks) {
                        const d = await api.getLatestBlocks(LIMIT);
                        setRows(prev => mergeNewStrict<BlockLite>(prev as Array<Flagged<BlockLite>> | undefined, d.items, 'hash', LIMIT));
                    } else {
                        const d = await api.getLatestTxs(LIMIT);
                        setRows(prev => mergeNewStrict<TxLite>(prev as Array<Flagged<TxLite>> | undefined, d.items, 'hash', LIMIT));
                    }
                }
            } finally {
                running.current = false;
            }
        };

        timer.current = window.setInterval(tick, POLL);
        const onVis = () => document.visibilityState === 'visible' && tick();
        document.addEventListener('visibilitychange', onVis);

        return () => {
            if (timer.current) clearInterval(timer.current);
            document.removeEventListener('visibilitychange', onVis);
        };
    }, [kind]);

    // 根据重载自动推断返回类型
    return rows as any;
}
