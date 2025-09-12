import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../state/api';
import type { BlockDetail as T } from '../state/types';
import HashLink from '../components/HashLink';
import Value from '../components/Value';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';

export default function BlockDetail(){
    const { t } = useTranslation('explorer');
    const { height } = useParams();
    const [data,setData] = useState<T>();
    const [page,setPage] = useState(1);
    const pageSize = 10;

    useEffect(()=>{ if(height) api.getBlock(Number(height)).then(setData); },[height]);
    if(!data) return <div style={{ padding:16 }}><Skeleton rows={6}/></div>;

    const pages = Math.max(1, Math.ceil(data.transactions.length / pageSize));
    const slice = data.transactions.slice((page-1)*pageSize, page*pageSize);

    return (
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 16px' }}>
            <h2 style={{ marginTop:0 }}>{t('block.title')}</h2>

            {/* 头信息 */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                <Info title={t('table.height')} value={`#${data.height.toLocaleString()}`} />
                <Info title={t('block.blockHash')} value={<HashLink text={data.hash} />} />
                <Info title={t('table.time')} value={new Date(data.time).toUTCString()} />
                <Info title={t('block.parent')} value={<HashLink text={data.parentHash || ''} />} />
                <Info title={t('block.count')} value={data.txCount} />
                <Info title={t('table.miner')} value={data.miner || '-'} />
                <Info title={t('block.size')} value={`${data.size||98451} bytes`} />
                <Info title={t('block.gasUsed')} value={`${data.gasUsed||'8,000,000'} / 8,000,000 (100%)`} />
            </div>

            {/* 交易列表 */}
            <div className="card" style={{ background:'#14161a', border:'1px solid #20252c', borderRadius:14, padding:16 }}>
                <div style={{ fontWeight:800, marginBottom:8 }}>{t('block.txList')} ({data.transactions.length})</div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead><tr>
                        <Th>{t('table.hash')}</Th><Th>{t('table.from')}</Th><Th></Th><Th>{t('table.to')}</Th><Th style={{textAlign:'right'}}>{t('table.value')}</Th><Th>{t('table.time')}</Th>
                    </tr></thead>
                    <tbody>
                    {slice.map(tx=>(
                        <tr key={tx.hash} style={{ borderTop:'1px solid #1d232a' }}>
                            <Td><a href={`/ecosystem/explorer/tx/${tx.hash}`}><HashLink text={tx.hash} /></a></Td>
                            <Td>{tx.from}</Td>
                            <Td style={{ textAlign:'center' }}>→</Td>
                            <Td>{tx.to ?? '-'}</Td>
                            <Td style={{ textAlign:'right' }}><Value amount={Number(tx.value)} /></Td>
                            <Td>{new Date(tx.time).toLocaleTimeString()}</Td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Pagination page={page} pages={pages} onChange={setPage} />
            </div>

            {/* 上一/下一块 */}
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:14 }}>
                <Link to={`/ecosystem/explorer/block/${data.height-1}`} className="secondary">← {t('block.prevBlock')} #{(data.height-1).toLocaleString()}</Link>
                <Link to={`/ecosystem/explorer/block/${data.height+1}`} className="secondary">{t('block.nextBlock')} #{(data.height+1).toLocaleString()} →</Link>
            </div>
        </div>
    );
}

function Info({ title, value }:{ title:string; value:React.ReactNode }){
    return (
        <div className="card" style={{ padding:16, borderRadius:12, border:'1px solid #20252c', background:'#14161a' }}>
            <div style={{ opacity:.75, marginBottom:6 }}>{title}</div>
            <div style={{ fontWeight:700 }}>{value}</div>
        </div>
    );
}
function Th({
                children,
                style
            }: {
    children?: React.ReactNode;   // ✅ 可选
    style?: React.CSSProperties;
}) {
    return (
        <th style={{ textAlign: 'left', padding: '8px 6px', opacity: .8, ...style }}>
            {children ?? '\u00A0' /* 占位不换行空格 */}
        </th>
    );
}

function Td({
                children,
                style
            }: {
    children?: React.ReactNode;   // （一般可不改，这里也改为可选更保险）
    style?: React.CSSProperties;
}) {
    return <td style={{ padding: '10px 6px', ...style }}>{children}</td>;
}
