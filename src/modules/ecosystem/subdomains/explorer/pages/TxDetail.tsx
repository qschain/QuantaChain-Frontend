import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../shared/api/api';
import HashLink from '../components/HashLink';

const toUTCString = (v: unknown): string => {
  if (v == null || v === '') return '-';

  // 数字或数字字符串
  const n = Number(v);
  if (Number.isFinite(n)) {
    // 兼容秒/毫秒（< 1e12 基本是秒）
    const ms = n >= 1e12 ? n : n * 1000;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? '-' : d.toUTCString();
  }

  // 字符串时间：尽量标准化后再解析
  const s = String(v).trim();

  // 常见的 "YYYY-MM-DD HH:mm:ss" -> "YYYY/MM/DD HH:mm:ss" 以兼容 Safari
  let d = new Date(s.replace(/-/g, '/'));
  if (!isNaN(d.getTime())) return d.toUTCString();

  // 再试 ISO 形式："YYYY-MM-DDTHH:mm:ssZ"
  d = new Date(s.replace(' ', 'T') + 'Z');
  if (!isNaN(d.getTime())) return d.toUTCString();

  return '-';
};
const pickBlockTimestamp = (obj: any): unknown => {
  return obj?.blockTimestamp ?? obj?.timestamp ?? obj?.time ?? null;
};

export default function TxDetail(){
    const { t } = useTranslation('explorer');
    const { hash } = useParams();
    const [data,setData] = useState<any>();

    useEffect(() => {
        if(hash){
            api.fetchTxDetail(hash).then(res => {
                // 注意：接口是 { code, message, data }
                setData(res?.data ?? res);
            }).catch(err=>{
                console.error("fetchTxDetail error:", err);
            });
        }
    }, [hash]);

    if(!data) return <div style={{ padding:16 }}>Loading…</div>;

    const status = data.status??''
    const blockHeight = data.blockNum ?? '';
    const timestamp = toUTCString(pickBlockTimestamp(data));
    const sender = data.ownerAddress ?? '';
    const receiver = data.toAddress ?? '';
    const type = data.contractDescribe ?? '';
    const amount = data.amount ??'';
    const fee = data.fee ??'';
    const inputHex = data.rawDataHex ?? '0x';

    return (
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 16px' }}>
            <h2>{t('tx.title')}</h2>

            {/* 状态卡 */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
                <K title={t('table.status')} value={status} />
                <K title={t('tx.hash')} value={<HashLink text={data.hash ?? ''} />} />
                <K title={t('tx.timestamp')} value={timestamp} />
                <K title={t('tx.block')} value={<Link to={`/ecosystem/explorer/block/${blockHeight}`}>#{blockHeight}</Link>} />
            </div>

            {/* 详情卡 */}
            <div style={{ background:'#14161a', border:'1px solid #20252c', borderRadius:14, padding:16, marginBottom:16 }}>
                <Row k={t('tx.sender')} v={<HashLink text={sender} short={8} />} />
                <Row k={t('tx.receiver')} v={<HashLink text={receiver} short={8} />} />
                <Row k={t('tx.type')} v={type} />
                <Row k={t('tx.amount')} v={`${amount.toLocaleString()} TRX`} />
                <Row k={t('tx.fee')} v={`${fee.toLocaleString()} TRX`} />
            </div>

            {/* 高级数据
            <div style={{ background:'#14161a', border:'1px solid #20252c', borderRadius:14, padding:16 }}>
                <div style={{ fontWeight:800, marginBottom:8 }}>{t('tx.advanced')} · {t('tx.hex')}</div>
                <code style={{ display:'block', overflow:'auto', whiteSpace:'nowrap' }}>{inputHex}</code>
            </div> */}
        </div>
    );
}

function K({title,value}:{title:string;value:React.ReactNode}){
  return (
    <div className="card" style={{ padding:16, border:'1px solid #20252c', background:'#14161a', borderRadius:12 }}>
      <div style={{ opacity:.75, marginBottom:6 }}>{title}</div>
      <div style={{ fontWeight:700 }}>{value}</div>
    </div>
  );
}
function Row({k,v}:{k:string;v:React.ReactNode}){
  return (
    <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', padding:'10px 0', borderTop:'1px dashed #1d232a' }}>
      <div style={{ opacity:.75 }}>{k}</div>
      <div>{v}</div>
    </div>
  );
}
