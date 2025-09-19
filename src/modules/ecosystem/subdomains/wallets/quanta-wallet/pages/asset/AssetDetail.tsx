import Card from '../../components/Card'
import ChartPlaceholder from '../../components/ChartPlaceholder'
import Tabs from '../../components/Tabs'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../shared/api/api'
import type { AssetOverview, TxItem } from '../../types'
import SendAsset from './SendAsset'
import ReceiveAsset from './ReceiveAsset'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'


function SwapInline() {
    const { t } = useTranslation(['wallet'])
    return (
        <div className="grid" style={{gap:14}}>
            <div className="secondary">{t('swap.quick')}</div>
            <div className="row" style={{gap:12}}>
                <select className="select" defaultValue="BTC">
                    <option>BTC</option>
                    <option>ETH</option>
                </select>
                <span>→</span>
                <select className="select" defaultValue="ETH">
                    <option>ETH</option>
                    <option>BTC</option>
                </select>
                <input className="input" placeholder="0.00" style={{width:160}} />
                <button className="btn" onClick={() => (window.location.href = '/swap')}>{t('swap.gotoFull')}</button>
            </div>
        </div>
    )
}


function StakePlaceholder() {
    const { t} = useTranslation(['wallet'])
    return (
        <div className="secondary">{t('stake.placeholder')}</div>
    )
}


function DefiPlaceholder() {
    const { t} = useTranslation(['wallet'])
    return (
        <div className="secondary">{t('defi.placeholder')}</div>
    )
}

export default function AssetDetail() {
    const [asset, setAsset] = useState<AssetOverview>()
    const [history, setHistory] = useState<TxItem[]>([])
    const [sp, setSp] = useSearchParams()
    const nav = useNavigate()
    const { t} = useTranslation(['wallet'])

    // 当前选中的 Tab：send / receive / swap / history / stake / defi
    const tab = sp.get('tab') || 'history'
    const setTab = (key: string) => {
        sp.set('tab', key)
        setSp(sp, { replace: true })
    }

    useEffect(() => { api.getAssetOverview().then(setAsset); api.getTxHistory().then(setHistory) }, [])

    const TabBar = useMemo(() => (
        <Tabs
            value={tab}
            onChange={setTab}
            items={[
                { key: 'send',    label: t('tab.send') },
                { key: 'receive', label: t('tab.receive') },
                { key: 'swap',    label: t('tab.swap') },
                { key: 'history', label: t('tab.history') },
                { key: 'stake',   label: t('tab.stake') },
                { key: 'defi',    label: t('tab.defi') },
            ]}
        />
    ), [tab, t])

    return (
        <div className="grid grid-2">
            {/* 左列：资产卡片与图表 */}
            <div className="grid" style={{gap:'var(--space-6)'}}>
                <Card title={t('asset.backToDashboard')} right={<a href="/asset">{t('asset.detail')}</a>}>
                    <div className="row">
                        <div className="badge">ETH</div>
                        <div style={{marginLeft:10}}>
                            <div style={{fontSize:18, fontWeight:700}}>Ethereum</div>
                            <div className="secondary">ETH</div>
                        </div>
                        <div className="badge" style={{marginLeft:'auto'}}>FT</div>
                    </div>

                    <div className="mb-4 mt-6">
                        <div className="secondary mb-2">{t('asset.chainAddress')}</div>
                        <div className="row">
                            <input className="input" readOnly value={asset?.address || '0x742d...5a57'} />
                            <button className="btn secondary" onClick={()=>navigator.clipboard.writeText(asset?.address || '')}>{t('copy')}</button>
                        </div>
                    </div>

                    <div className="row space-between mb-6">
                        <div>
                            <div className="secondary">{t('asset.currentBalance')}</div>
                            <div style={{fontSize:28, fontWeight:800}}>{asset?.balance ?? 24.5678}</div>
                            <div className="secondary">~ ${asset?.fiatValue?.toLocaleString() ?? '45,123.45'}</div>
                        </div>
                        <div style={{textAlign:'right'}}>
                            <div className="secondary">{t('asset.change24h')}</div>
                            <div className="badge green">+{asset?.change24h ?? 5.12}%</div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="mb-2">{t('asset.performance')}</div>
                        <ChartPlaceholder />
                    </div>
                </Card>
            </div>

            {/* 右列：选项卡 + 内容 */}
            <Card title={TabBar}>
                {tab === 'history' && (
                    <div>
                        <div className="row" style={{justifyContent:'flex-end', gap:10, marginBottom:10}}>
                            <select className="select" style={{width:120}}><option>{t('type')}</option></select>
                            <select className="select" style={{width:120}}><option>{t('time')} ⏱</option></select>
                        </div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>{t('txHash')}</th>
                                <th>{t('type')}</th>
                                <th>{t('amount')}</th>
                                <th>{t('time')}</th>
                                <th>{t('status')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {history.map((x)=>(
                                <tr key={x.hash}>
                                    <td>{x.hash}</td>
                                    <td>
                                        <span className={`badge ${x.type==='发送'?'red':x.type==='接收'?'green':x.type==='质押'?'yellow':'blue'}`}>
                                            {x.type}
                                        </span>
                                    </td>
                                    <td style={{color: x.amount>=0?'#19c37d':'#ff6b6b'}}>{x.amount>0?`+${x.amount}`:x.amount} {x.symbol}</td>
                                    <td>{x.ts}</td>
                                    <td>
                                        <span className={`badge ${x.status==='成功'?'green':x.status==='处理中'?'yellow':'red'}`}>
                                          {x.status==='成功'?t('status.success'):x.status==='处理中'?t('status.pending'):t('status.failed')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'send'    && <SendAsset />}
                {tab === 'receive' && <ReceiveAsset />}
                {tab === 'swap'    && <SwapInline />}
                {tab === 'stake'   && <StakePlaceholder />}
                {tab === 'defi'    && <DefiPlaceholder />}
            </Card>
        </div>
    )
}