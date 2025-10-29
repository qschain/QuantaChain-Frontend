import ListItem from './ListItem';
import Skeleton from '../Skeleton';
import type { BlockItem, LatestTxItem } from '../../state/types';

type Row = (BlockItem | LatestTxItem) & { __justAdded?: boolean };

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
                const key = (row as any).hash ?? `${kind}-${i}`;
                return <ListItem key={key} row={row as any} kind={kind} />;
            })}
        </ul>
    );
}
