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
// ★ 新增：从会话里拿 address / userName
import { useSession } from '../../../../../../../app/session/PlatformSessionProvider' // 按你实际路径调整

type AccountDataItem = {
    tokenAbbr: string
    accountBalance: string
    oneToDollar: string
    dollarAccountBalance: string
    percent: string
}
type AccountGetByUserResp = {
    code: string
    message: string
    data: {
        totalFrozenV2: number
        allTrx: string
        totalDollar: string
        freeNetLimit: string
        rewardNum: number
        voteTotal: number
        dataList: AccountDataItem[]
        freeNetRemaining: string
        freeNetUsed: string
        freeNetPercentage: string
    }
}
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
    const [account, setAccount] = useState<AccountGetByUserResp['data'] | null>(null)

    const [sp, setSp] = useSearchParams()
    const nav = useNavigate()
    const { t } = useTranslation(['wallet'])

    // ★ 从 SessionProvider 拿用户信息（address、name）
    const { user } = useSession()
    const userAddress = user?.address || ''           // 展示用
    const userName = user?.name || localStorage.getItem('username') || '' // 调接口用（你后端需要 userName）

    // Tab
    const tab = sp.get('tab') || 'history'
    const setTab = (key: string) => { sp.set('tab', key); setSp(sp, { replace: true }) }

    // ★ 受控 symbol，统一大写，初始化为数据里第一个
    const symbolParam = (sp.get('symbol') || '').toUpperCase()
    const setSymbol = (sym: string) => { sp.set('symbol', sym.toUpperCase()); setSp(sp, { replace: true }) }

    useEffect(() => {
        api.getAssetOverview().then(setAsset)
        api.getTxHistory().then(setHistory)

        // @ts-ignore
        api.getAccountOverview(userName, { real: true }).then((resp: AccountGetByUserResp) => {
            const data = resp.data
            setAccount(data)
            if (!symbolParam && data?.dataList?.length) {
                setSymbol(data.dataList[0].tokenAbbr.toUpperCase())
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // 初始化拉一次即可

    const selectedToken = useMemo(() => {
        if (!account?.dataList?.length) return null
        const want = symbolParam || account.dataList[0].tokenAbbr.toUpperCase()
        return account.dataList.find(x => x.tokenAbbr.toUpperCase() === want) || account.dataList[0]
    }, [account, symbolParam])

    const fmt = (n?: string | number, dp = 6) => {
        if (n === undefined || n === null) return '--'
        const num = typeof n === 'string' ? Number(n) : n
        if (Number.isNaN(num)) return '--'
        return num.toFixed(dp)
    }

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
            <div className="grid" style={{ gap: 'var(--space-6)' }}>
                {/* ★ 去掉 right 链接；标题沿用 t('asset.details') */}
                <Card title={t('asset.details')}>

                    {/* ★ 下拉框放在卡片内容顶部的第一行（靠左） */}
                    <div className="row" style={{ alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div className="secondary">{t('asset.token')}</div>

                        {/* ★ 受控下拉：加载前给一个占位禁用项，加载后填充 dataList */}
                        <select
                            className="select"
                            style={{ width: 160 }}
                            value={selectedToken ? selectedToken.tokenAbbr.toUpperCase() : 'LOADING'}
                            onChange={(e) => setSymbol(e.target.value)}
                        >
                            {!account?.dataList?.length && (
                                <option value="LOADING" disabled>—</option>
                            )}
                            {(account?.dataList || []).map(it => {
                                const sym = it.tokenAbbr.toUpperCase()
                                return <option key={sym} value={sym}>{sym}</option>
                            })}
                        </select>

                        {selectedToken && (
                            <div className="badge" title={t('asset.portion')}>
                                {(Number(selectedToken.percent) * 100).toFixed(2)}%
                            </div>
                        )}

                    </div>

                    {/* ★ 地址展示改为用 Session 里的 address（如果没有就不渲染块） */}
                    {!!userAddress && (
                        <div className="mb-4">
                            <div className="secondary mb-2">{t('asset.chainAddress')}</div>
                            <div className="row">
                                <input className="input" readOnly value={userAddress} />
                                <button className="btn secondary" onClick={() => navigator.clipboard.writeText(userAddress)}>
                                    {t('copy')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 余额/折合美元；24h 变化暂无字段 → N/A */}
                    <div className="row space-between mb-6">
                        <div>
                            <div className="secondary">{t('asset.currentBalance')}</div>
                            <div style={{ fontSize: 28, fontWeight: 800 }}>
                                {selectedToken ? fmt(selectedToken.accountBalance) : '--'} {selectedToken?.tokenAbbr?.toUpperCase() || ''}
                            </div>
                            <div className="secondary">
                                ~ $
                                {selectedToken
                                    ? Number(selectedToken.dollarAccountBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    : '--'}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="secondary">{t('asset.change24h')}</div>
                            <div className="badge">{t('na')}</div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="mb-2">{t('asset.performance')}</div>
                        <ChartPlaceholder />
                    </div>
                </Card>
            </div>

            {/* 右列：选项卡 + 内容（原样保留） */}
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
