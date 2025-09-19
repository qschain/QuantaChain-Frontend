import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../shared/api/api';
import type { TokenLite } from '../state/types';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';

export default function TokensList(){
    const { t } = useTranslation('explorer');
    const [list,setList] = useState<TokenLite[]>();
    const [total,setTotal] = useState(0);
    const [page,setPage] = useState(1);
    const size = 10;

    useEffect(()=>{ api.getTokens(page,size).then(d=>{ setList(d.items); setTotal(d.total); }); },[page]);

    const pages = Math.max(1, Math.ceil(total/size));
    return (
        <div>
            <h2 style={{ marginTop:0 }}>{t('tokens.title')}</h2>

            {!list ? <Skeleton/> : (
                <>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                        <thead>
                        <tr style={{ opacity:.8 }}>
                            <th style={{ textAlign:'left', padding:'10px 6px' }}>#</th>
                            <th style={{ textAlign:'left', padding:'10px 6px' }}>{t('table.hash')}</th>
                            <th style={{ textAlign:'left', padding:'10px 6px' }}>{t('tokens.price')}</th>
                            <th style={{ textAlign:'left', padding:'10px 6px' }}>{t('tokens.change24h')}</th>
                            <th style={{ textAlign:'left', padding:'10px 6px' }}>{t('tokens.marketcap')}</th>
                            <th style={{ textAlign:'left', padding:'10px 6px' }}>{t('tokens.volume24h')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.map(r=>(
                            <tr key={r.rank} style={{ borderTop:'1px solid #1d232a' }}>
                                <td style={{ padding:'10px 6px' }}>{r.rank}</td>
                                <td style={{ padding:'10px 6px' }}>{r.name} <span style={{ opacity:.7 }}>{r.symbol}</span></td>
                                <td style={{ padding:'10px 6px' }}>${r.price.toFixed(6)}</td>
                                <td style={{ padding:'10px 6px', color: r.change24h>=0? '#2dc78a':'#ff6b6b' }}>{r.change24h>=0?'+':''}{r.change24h.toFixed(2)}%</td>
                                <td style={{ padding:'10px 6px' }}>${r.marketcap.toLocaleString()}</td>
                                <td style={{ padding:'10px 6px' }}>${r.volume24h.toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Pagination page={page} pages={pages} onChange={setPage} />
                </>
            )}
        </div>
    );
}
