import React from 'react'
import { useTranslation } from 'react-i18next'
import type { SRItem } from '../state/types'
import { useSr } from '../state/store'
import { nf } from '../shared/format'

export default function SRListItem({ item }: { item: SRItem }) {
    const { t } = useTranslation('sr')
    const { state, dispatch } = useSr()
    const current = state.allocations[item.address] || 0
    const set = (n: number) => dispatch({ type: 'allocChange', payload: { sr: item.address, value: n } })
    const all = () => dispatch({ type: 'allocReplace', payload: { [item.address]: state.voteSliderValue } })

    return (
        <div className="sr-card"
            // 点击空白区域打开详情
             onClick={(e) => {
                 // 避免点到按钮/输入触发
                 const tag = (e.target as HTMLElement).tagName
                 if (['BUTTON','INPUT','SELECT','TEXTAREA'].includes(tag)) return
                 dispatch({ type: 'openDetail', payload: item })
             }}
             style={{ cursor:'pointer' }}
        >
            <div className="sr-row sr-space-between sr-align-center" style={{ gap:12, flexWrap:'wrap' }}>
                <div className="sr-col" style={{ minWidth:220 }}>
                    <div style={{ fontWeight:800 }}>{item.name}</div>
                    <div className="sr-muted" style={{ fontSize:12 }}>{item.address.slice(0,6)}…{item.address.slice(-6)}</div>
                </div>

                <div className="sr-row sr-gap-16 sr-align-center" style={{ flexWrap:'wrap' }}>
                    <div className="sr-col" style={{ minWidth:120, textAlign:'right' }}>
                        <div className="sr-muted" style={{ fontSize:12 }}>{t('list.annualized')}</div>
                        <div className="sr-number-md">{Number(item.annualizedRate || 0).toFixed(2)}%</div>
                    </div>
                    <div className="sr-col" style={{ minWidth:140, textAlign:'right' }}>
                        <div className="sr-muted" style={{ fontSize:12 }}>{t('list.realtimeVotes')}</div>
                        <div className="sr-number-md">{nf(item.realTimeVotes || 0)}</div>
                    </div>

                    {/* 控件区域 */}
                    <div className="sr-row sr-gap-8" style={{ minWidth:220 }}>
                        <button className="sr-btn" onClick={() => set(Math.max(0, current - 1))}>-</button>
                        <input className="sr-input" style={{ width:90, textAlign:'center' }} type="number" min={0} step={1} value={current} onChange={e => set(Number(e.target.value || 0))} />
                        <button className="sr-btn" onClick={() => set(current + 1)}>+</button>
                        <button className="sr-btn" onClick={all} style={{ whiteSpace:'nowrap' }}>{t('list.oneClickVote')}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

