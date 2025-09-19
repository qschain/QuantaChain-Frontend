import ListItem from './ListItem';
import Skeleton from './Skeleton';
import type { BlockLite, TxLite } from '../state/types';

type Row = (BlockLite | TxLite) & { __justAdded?: boolean };

export default function LiveList({ data, kind }:{ data?: Row[]; kind:'block'|'tx' }) {
    if (!data) return <Skeleton />;
    return (
        <ul className="live-list">
            {data.slice(0,10).map((row) => (
                <ListItem key={'hash' in row ? row.hash : (row as any).hash} row={row as any} kind={kind} />
            ))}
        </ul>
    );
}
