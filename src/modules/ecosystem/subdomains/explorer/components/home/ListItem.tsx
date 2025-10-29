import HashLink from '../HashLink';

type BlockRow = {
    number: string;              // 后端字符串
    hash: string;
    time: string;
    trxCount?: string;           // 可能为 undefined
    witnessName?: string;
    __justAdded?: boolean;
};

type TxRow = {
    hash: string;
    ownerAddress: string;
    toAddress?: string | null;
    time: string;
    __justAdded?: boolean;
};

function fmtIntStr(s?: string): string {
    if (!s) return '0';
    const n = Number(String(s).replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) ? n.toLocaleString() : '0';
}

function fmtTime(s: string): string {
    if (!s) return '';
    const isoish = s.includes('T') ? s : s.replace(' ', 'T');
    const d = new Date(isoish);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleTimeString();
}

export default function ListItem({ row, kind }: { row: BlockRow | TxRow; kind: 'block' | 'tx' }) {
    const cls = `ex-live-row ${row.__justAdded ? 'enter' : ''}`;

    if (kind === 'block') {
        const b = row as BlockRow;
        return (
            <li className={cls}>
                <div className="ex-live-left">
                    <a className="ex-link-neon" href={`/ecosystem/explorer/block/${b.number}`}>
                        #{fmtIntStr(b.number)}
                    </a>
                    <div className="ex-muted">
                        <HashLink text={b.hash} />
                    </div>
                </div>
                <div className="ex-live-right ex-muted">
                    <div>{fmtTime(b.time)}</div>
                    <div>{fmtIntStr(b.trxCount)} tx</div>
                </div>
            </li>
        );
    }

    const tx = row as TxRow;

    return (
        <li className={cls}>
            <div className="ex-live-left">
                <HashLink
                    text={tx.hash}
                    href={`/ecosystem/explorer/tx/${tx.hash}`}
                />
                <div className="ex-muted">
                    {tx.ownerAddress} → {tx.toAddress ?? '…'}
                </div>
            </div>
            <div className="ex-live-right ex-muted">
                <div>{fmtTime(tx.time)}</div>
            </div>
        </li>
    );
}
