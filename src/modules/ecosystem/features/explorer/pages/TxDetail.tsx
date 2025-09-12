import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../state/api';
import type { TxDetail as T } from '../state/types';
import HashLink from '../components/HashLink';

export default function TxDetail(){
    const { t } = useTranslation('explorer');
    const { hash } = useParams();
    const [data,setData] = useState<T>();

    useEffect(()=>{ if(hash) api.getTx(hash).then(setData); },[hash]);
    if(!data) return <div style={{ padding:16 }}>Loading…</div>;

    return (
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 16px' }}>
            <h2>{t('tx.title')}</h2>

            {/* 状态卡 */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
                <K title={t('table.status')} value={data.status==='success'? t('tx.statusSuccess'):t('tx.statusFailed')} />
                <K title={t('tx.hash')} value={<HashLink text={data.hash} />} />
                <K title={t('tx.timestamp')} value={new Date(data.time).toUTCString()} />
                <K title={t('tx.block')} value={<Link to={`/ecosystem/explorer/block/${data.blockHeight}`}>#{data.blockHeight}</Link>} />
            </div>

            {/* 详情卡 */}
            <div style={{ background:'#14161a', border:'1px solid #20252c', borderRadius:14, padding:16, marginBottom:16 }}>
                <Row k={t('tx.sender')} v={<HashLink text={data.from} short={8} />} />
                <Row k={t('tx.receiver')} v={<HashLink text={data.to || ''} short={8} />} />
                <Row k={t('tx.type')} v={data.type} />
                <Row k={t('tx.amount')} v={`${Number(data.amount).toLocaleString()} TRX`} />
                <Row k={t('tx.fee')} v={`${Number(data.fee).toLocaleString()} TRX`} />
            </div>

            {/* 高级数据 */}
            <div style={{ background:'#14161a', border:'1px solid #20252c', borderRadius:14, padding:16 }}>
                <div style={{ fontWeight:800, marginBottom:8 }}>{t('tx.advanced')} · {t('tx.hex')}</div>
                <code style={{ display:'block', overflow:'auto', whiteSpace:'nowrap' }}>{data.inputHex ?? '0x'}</code>
            </div>
        </div>
    );
}
function K({title,value}:{title:string;value:React.ReactNode}){ return <div className="card" style={{ padding:16, border:'1px solid #20252c', background:'#14161a', borderRadius:12 }}><div style={{ opacity:.75, marginBottom:6 }}>{title}</div><div style={{ fontWeight:700 }}>{value}</div></div>; }
function Row({k,v}:{k:string;v:React.ReactNode}){ return <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', padding:'10px 0', borderTop:'1px dashed #1d232a' }}><div style={{ opacity:.75 }}>{k}</div><div>{v}</div></div>; }
