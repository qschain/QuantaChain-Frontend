import Card from '../components/Card'
import Donut from '../components/Donut'
import { useDashboardData } from '../model/DashboardContext'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

export default function DistributionCard(){
    const { distribution = [], overview } = useDashboardData()
    const { t, i18n } = useTranslation(['wallet'])
    const locale = i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US'

    // 统一算比例
    const rows = useMemo(() => {
        const totalUSD = Number(overview?.totalUSD) || 0
        const sumVals = distribution.reduce((a,b) => a + (b.value || 0), 0)
        return distribution.map(d => {
            const pct = sumVals > 0 ? (d.value / sumVals) * 100 : 0
            return { ...d, pct }
        })
    }, [distribution, overview?.totalUSD])

    return (
        <Card title={t('assetDistribution')} right={<button className="btn ghost">{t('allAssets')} ▾</button>}>
            <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', gap:24 }}>
                <Donut
                    // Donut 图使用绝对值绘制
                    data={distribution.map(d => ({ ...d, value: d.value }))}
                    total={overview?.totalUSD || 0}
                    // 中心显示“总价值”
                    centerLabel={t('totalValue') || '总价值'}
                    format={(n) =>
                        (overview?.totalUSD ?? 0).toLocaleString(locale, { style:'currency', currency:'USD' })
                    }
                />
                <div className="grid" style={{ gap:10, alignContent:'start' }}>
                    {rows.map(d => (
                        <div key={d.label} className="row space-between">
                            <div className="row" style={{ gap:8 }}>
                                <span className="badge" style={{ background:d.color, borderColor:d.color, color:'#0b0e11' }}>●</span>
                                <div>{d.label}</div>
                            </div>
                            {/* 这里显示比例 */}
                            <div className="secondary">{d.pct.toFixed(1)}%</div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}
