import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSr } from '../../state/store'
import { sumAlloc } from '../../shared/allocationRules'
import { nf } from '../../shared/format'

export default function ConfirmVoteModal({
                                             open, onCancel, onConfirm,
                                         }: { open: boolean; onCancel(): void; onConfirm(): void }) {
    const { t } = useTranslation('sr')
    const { state } = useSr()
    if (!open) return null

    const total = sumAlloc(state.allocations)

    return (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:99, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div className="sr-panel" style={{ width:420, maxWidth:'92%' }}>
                <div className="sr-panel__head"><div className="sr-panel__title">{t('confirmModal.title')}</div></div>
                <div className="sr-col sr-gap-16">
                    <div className="sr-row sr-space-between"><div>{t('confirmModal.qty')}</div><div className="sr-number-xl">{total.toLocaleString()}</div></div>
                    <div className="sr-muted" style={{ fontSize:12 }}>{t('confirmModal.feeNote')}</div>
                    <div className="sr-row sr-gap-16" style={{ justifyContent:'flex-end' }}>
                        <button className="sr-btn" onClick={onCancel}>{t('common.cancel')}</button>
                        <button className="sr-btn primary" onClick={onConfirm}>{t('common.confirm')}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
