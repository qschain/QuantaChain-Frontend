// src/modules/ecosystem/features/dapps/pages/DappBrowser/SearchDiscoverPage.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DappCard from '../../components/DappCard';
import SectionHeader from '../../components/SectionHeader';
import * as api from '../../api/dappApi';
import type { Dapp } from '../../types';
import usePagination from '../../hooks/usePagination';

export default function SearchDiscoverPage(){
    const { t } = useTranslation('dapps');
    const [q,setQ]=useState('');
    const [items,setItems]=useState<Dapp[]>([]);
    const pag = usePagination({pageSize:12});

    useEffect(()=>{
        api.searchDapps({page:pag.page, pageSize:pag.pageSize }).then(res=>{
            setItems(res.list); pag.setTotal(res.total);
        });
    },[q, pag.page, pag.pageSize]);

    return (
        <div className="container vertical">
            <SectionHeader title={t('discover.title')} sub={t('discover.sub')}
                           right={<button className="btn ghost">{t('common.backHome')}</button>}
            />
            <div className="panel">
                <div className="row gap">
                    <input className="input xl" placeholder={t('common.searchPlaceholder')} value={q} onChange={e=>setQ(e.target.value)}/>
                    <button className="btn">{t('common.search')}</button>
                </div>
                <div className="filters row gap">
                    <select className="input">{/* 分类 */}<option>{t('discover.selectCategory')}</option></select>
                    <select className="input"><option>{t('discover.selectChain')}</option></select>
                    <select className="input"><option>{t('discover.selectTVL')}</option></select>
                    <select className="input"><option>{t('discover.selectUsers')}</option></select>
                    <button className="btn ghost">{t('common.clearAll')}</button>
                </div>
            </div>

            <SectionHeader title={t('discover.recommend')}/>
            <div className="panel">{t('discover.carouselPlaceholder')}</div>

            <SectionHeader title={t('discover.results')} sub={`${t('discover.totalFound')} ${pag.total}`}/>
            <div className="grid cols-4 gap">
                {items.map(d=> <DappCard key={d.id} dapp={d}/>)}
            </div>
            <div className="pagination row gap">
                <button className="btn ghost" onClick={()=>pag.prev()} disabled={pag.page===1}>‹</button>
                <span>{pag.page} / {pag.pages}</span>
                <button className="btn ghost" onClick={()=>pag.next()} disabled={pag.page===pag.pages}>›</button>
            </div>
        </div>
    );
}
