// src/modules/ecosystem/features/dapps/pages/Account/AccountPage.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeader from '../../components/SectionHeader';
import * as api from '../../api/dappApi';
import type { Dapp } from '../../types';

export default function AccountPage(){
    const { t } = useTranslation('dapps');
    const [favorites,setFavorites]=useState<Dapp[]>([]);
    const [portfolio,setPortfolio]=useState<any>();

    useEffect(()=>{
        api.getFavorites().then(setFavorites);
        api.getPortfolio().then(setPortfolio);
    },[]);

    return (
        <div className="container vertical">
            <SectionHeader title={t('account.title')} right={<button className="btn ghost">{t('common.backHome')}</button>}/>
            <div className="panel">
                <div className="panel-title">{t('account.favTitle')}</div>
                <div className="grid cols-4 gap">
                    {favorites.map(d=>(
                        <div key={d.id} className="fav-card">
                            <div className="logo sm"/>
                            <div className="name">{d.name}</div>
                            <div className="tag muted">{d.category}</div>
                            <button className="btn tiny">{t('common.view')}</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid cols-2 gap">
                <div className="panel tall">
                    <div className="panel-title">{t('account.portfolio')}</div>
                    <div className="kpi-row">
                        <div className="kpi">
                            <div className="kpi-label">{t('account.totalValue')}</div>
                            <div className="kpi-value">{portfolio?.value ?? '$24,580.32'}</div>
                            <div className="kpi-delta green">+2.1%</div>
                        </div>
                        <div className="kpi">
                            <div className="kpi-label">{t('account.activeCount')}</div>
                            <div className="kpi-value">{portfolio?.active ?? 8}</div>
                        </div>
                        <div className="kpi">
                            <div className="kpi-label">{t('account.roi')}</div>
                            <div className="kpi-value">+18.7%</div>
                        </div>
                    </div>
                    <div className="chart-placeholder">{t('common.chartPlaceholder')}</div>
                </div>
                <div className="panel tall">
                    <div className="panel-title">{t('account.assetDist')}</div>
                    <div className="list">
                        {(portfolio?.dist ?? [
                            {name:'Uniswap', value:'$8,240.12'},
                            {name:'Aave', value:'$6,890.45'},
                            {name:'Compound', value:'$5,120.88'},
                            {name:'Others', value:'$4,328.87'},
                        ]).map((it:any)=>(
                            <div key={it.name} className="row space-between item">
                                <div>{it.name}</div><div className="muted">{it.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="panel">
                <div className="panel-title">{t('account.alerts')}</div>
                <div className="list">
                    {[
                        t('account.alert.price','',{returnObjects:false})||'价格告警',
                        t('account.alert.tvl','',{returnObjects:false})||'TVL 变化',
                        t('account.alert.security','',{returnObjects:false})||'安全事件',
                    ].map((name, i)=>(
                        <div key={i} className="row space-between item">
                            <div>{name}</div>
                            <div><label className="switch"><input type="checkbox" defaultChecked={i!==1}/><span/></label></div>
                        </div>
                    ))}
                </div>
                <button className="btn right">{t('account.addAlert')}</button>
            </div>
        </div>
    );
}
