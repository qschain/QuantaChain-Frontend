import { useEffect, useRef, useState } from 'react';
import { api } from '../shared/api/api';
import type { BlockLite, TxLite } from '../state/types';

type Flagged<T> = T & { __justAdded?: boolean };

const LIMIT = 10;
const POLL  = 3000;

export default function useExplorerLive() {
  const [blocks, setBlocks] = useState<Array<Flagged<BlockLite>>>([]);
  const [txs, setTxs]       = useState<Array<Flagged<TxLite>>>([]);
  const running = useRef(false);
  const timer   = useRef<number>();

  useEffect(() => {
    let alive = true;

    // 1) 首帧：只拉区块初始化
    (async () => {
      try {
        const init = await api.getLatestBlocks(LIMIT, /* 你的 api 已支持 useRealApi */);
        if (!alive) return;
        const items = (init.items ?? []).slice(0, LIMIT).map(b => ({ ...(b as any), __justAdded: false }));
        setBlocks(items as any);
        setTxs([]); // 首帧没有交易
      } catch {}
    })();

    // 2) 轮询：最新区块 + 最新交易
    const tick = async () => {
      if (running.current) return;
      if (document.visibilityState !== 'visible') return;
      running.current = true;
      try {
        const res = await api.getLatestHead(); 
        const newBlock = res.block;
        const newTxs   = res.txs;

        // 2.1 区块：队头去重 + 截断 10
        setBlocks(prev => {
          if (!prev?.length) return [{ ...(newBlock as any), __justAdded: true }];
          // @ts-ignore
            const dup = prev[0]?.hash === newBlock.hash || prev.some(b => String(b.number) === String(newBlock.number));
          if (dup) return prev;
          const next = [{ ...(newBlock as any), __justAdded: true }, ...prev.map(b => ({ ...b, __justAdded: false }))];
          return next.slice(0, LIMIT);
        });

        // 2.2 交易：整批替换为 10 条
        setTxs(newTxs.slice(0, LIMIT).map(x => ({ ...(x as any), __justAdded: true })));
      } finally {
        running.current = false;
      }
    };

    timer.current = window.setInterval(tick, POLL);
    const onVis = () => document.visibilityState === 'visible' && tick();
    document.addEventListener('visibilitychange', onVis);

    return () => {
      alive = false;
      if (timer.current) clearInterval(timer.current);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return { blocks, txs };
}
