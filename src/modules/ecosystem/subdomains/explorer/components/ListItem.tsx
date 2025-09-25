import HashLink from './HashLink';
import Value from './Value';

type BlockRow = {
    height: number | string;
    hash: string;
    time: string | number | Date;
    txCount: number | string;
    __justAdded?: boolean;
};
type TxRow = {
    hash: string;
    from: string;
    to: string | null;
    value: string | number | null | undefined;
    time: string | number | Date;
    __justAdded?: boolean;
};

function fmtInt(v: unknown): string {
    const n = typeof v === 'number' ? v : Number(v ?? 0);
    return Number.isFinite(n) ? n.toLocaleString() : '0';
}

function isValidDate(d: Date) {
    return !Number.isNaN(d.getTime());
}

function toDate(v: unknown): Date | null {
    if (v == null) return null;
    if (v instanceof Date) return isValidDate(v) ? v : null;

    // 数字：可能是秒或毫秒
    if (typeof v === 'number') {
        const ms = v < 1e12 ? v * 1000 : v; // 小于 1e12 视为秒
        const d = new Date(ms);
        return isValidDate(d) ? d : null;
    }

    // 字符串：兼容 "2025-09-18 14:53:48" -> 替换为空间的 T 提高解析成功率
    const s = String(v).trim();
    if (!s) return null;
    const isoish = s.includes('T') ? s : s.replace(' ', 'T');
    const d = new Date(isoish);
    return isValidDate(d) ? d : null;
}

function fmtTime(v: unknown): string {
    const d = toDate(v);
    if (!d) {
        return typeof v === 'string' ? v : '';
    }
    return d.toLocaleTimeString();
}

export default function ListItem({ row, kind }: { row: BlockRow | TxRow; kind: 'block' | 'tx' }) {
    // ex- 前缀 + 进入动画 enter
    const cls = `ex-live-row ${row.__justAdded ? 'enter' : ''}`;

    if (kind === 'block') {
        const b = row as BlockRow;
        const heightNum = fmtInt(b.height);
        const txCount = fmtInt(b.txCount);

        return (
            <li className={cls}>
                <div className="ex-live-left">
                    <a className="ex-link-neon" href={`/ecosystem/explorer/block/${b.height}`}>
                        #{heightNum}
                    </a>
                    <div className="ex-muted">
                        <HashLink text={b.hash} />
                    </div>
                </div>
                <div className="ex-live-right ex-muted">
                    <div>{fmtTime(b.time)}</div>
                    <div>{txCount} tx</div>
                </div>
            </li>
        );
    }

    const tx = row as TxRow;
    // // const amountNum = Number(tx.value ?? 0);
    // const safeAmount = Number.isFinite(amountNum) ? amountNum : 0;

    return (
        <li className={cls}>
            <div className="ex-live-left">
                <a className="ex-link-purple" href={`/ecosystem/explorer/tx/${tx.hash}`}>
                    <HashLink text={tx.hash} />
                </a>
                <div className="ex-muted">
                    {tx.from} → {tx.to ?? '…'}
                </div>
            </div>
            <div className="ex-live-right ex-muted">
                {/*<Value amount={safeAmount} currency="TRX" />*/}
                <div>{fmtTime(tx.time)}</div>
            </div>
        </li>
    );
}
