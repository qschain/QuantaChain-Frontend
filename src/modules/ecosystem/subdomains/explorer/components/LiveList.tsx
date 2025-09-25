import ListItem from './ListItem';
import Skeleton from './Skeleton';
import type { BlockLite, TxLite } from '../state/types';

type Row = (BlockLite | TxLite) & { __justAdded?: boolean };

function normalizeBlockRow(raw: any): any {
  // 兼容多种后端/上游命名
  const rawNo =
    raw.number ??
    raw.height ??
    raw.blockNumber ??
    raw.no ??
    (raw.newBlock?.number ?? raw.newBlock?.height);

  const nStr = rawNo == null ? '' : String(rawNo).trim();
  // 提供一个纯数字版，防止组件里做 Number() 时报 0
  const nNum = nStr ? Number(nStr.replace(/[^\d]/g, '')) : NaN;

  const trx =
    raw.trxCount ??
    raw.txCount ??
    raw.txnCount ??
    (raw.newBlock?.trxCount ?? raw.newBlock?.txCount);

  const trxStr = trx == null ? '' : String(trx);

  return {
    ...raw,
    // 统一主字段
    number: nStr,
    trxCount: trxStr,

    // 兼容别名（很多组件习惯读 height / no / blockNumber）
    height: nStr,
    no: nStr,
    blockNumber: nStr,
    txCount: trxStr,

    // 明确的显示字段（ListItem 若支持可优先使用）
    _displayNumber: nStr,
    _displayNumberN: Number.isFinite(nNum) ? nNum : undefined,
  };
}

export default function LiveList({
  data,
  kind,
}: {
  data?: Row[];
  kind: 'block' | 'tx';
}) {
  if (!data) return <Skeleton />;

  const list = data.slice(0, 10);

  return (
    <ul className="live-list">
      {list.map((row, i) => {
        const r = kind === 'block' ? normalizeBlockRow(row) : row;
        const key = (r as any).hash ?? `${kind}-${i}`;
        return <ListItem key={key} row={r as any} kind={kind} />;
      })}
    </ul>
  );
}
