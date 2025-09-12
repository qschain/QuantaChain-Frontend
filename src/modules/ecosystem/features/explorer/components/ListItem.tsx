import HashLink from '../components/HashLink';
import Value from '../components/Value';

type BlockRow = {
    height:number; hash:string; time:string; txCount:number; __justAdded?:boolean;
};
type TxRow = {
    hash:string; from:string; to:string|null; value:string|number; time:string; __justAdded?:boolean;
};

export default function ListItem({ row, kind }:{ row: BlockRow | TxRow; kind:'block'|'tx' }) {
    const cls = `live-row ${row.__justAdded ? 'enter' : ''}`;

    if (kind === 'block') {
        const b = row as BlockRow;
        return (
            <li className={cls}>
                <div className="live-left">
                    <a className="link-neon" href={`/ecosystem/explorer/block/${b.height}`}>#{b.height.toLocaleString()}</a>
                    <div className="muted"><HashLink text={b.hash} /></div>
                </div>
                <div className="live-right muted">
                    <div>{new Date(b.time).toLocaleTimeString()}</div>
                    <div>{b.txCount} tx</div>
                </div>
            </li>
        );
    }

    const tx = row as TxRow;
    return (
        <li className={cls}>
            <div className="live-left">
                <a className="link-purple" href={`/ecosystem/explorer/tx/${tx.hash}`}><HashLink text={tx.hash} /></a>
                <div className="muted">{tx.from} → {tx.to ?? '…'}</div>
            </div>
            <div className="live-right muted">
                <Value amount={Number(tx.value)} currency="TRX" />
                <div>{new Date(tx.time).toLocaleTimeString()}</div>
            </div>
        </li>
    );
}
