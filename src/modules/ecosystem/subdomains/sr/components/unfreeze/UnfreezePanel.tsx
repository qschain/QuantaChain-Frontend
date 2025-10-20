import {useTranslation} from "react-i18next";
import {useSr} from "../../state/store";
import {useSession} from "../../../../../../app/session/PlatformSessionProvider";
import {useCallback, useEffect, useMemo, useState} from "react";
import srApi from "../../shared/api/srApi";
import ConfirmUnfreezeModal from "./ConfirmUnfreezeModal";

export default function UnfreezePanel({ onAfterSuccess }: { onAfterSuccess?: () => void }) {
    const { t } = useTranslation('sr')
    const { state, dispatch } = useSr()
    const { user } = useSession()

    const [val, setVal] = useState<string>('')   // 支持小数
    const [errMsg, setErrMsg] = useState('')
    const [confirmOpen, setConfirmOpen] = useState(false)

    // 冻结额度
    const [byTypeTRX, setByTypeTRX] = useState<Map<string, number>>(new Map())
    const [totalTRX, setTotalTRX] = useState(0)

    // 仅允许两种类型
    type AllowType = 'BANDWIDTH' | 'ENERGY'
    const [selectedType, setSelectedType] = useState<AllowType>('BANDWIDTH')

    // 正在解冻中
    const [pendingList, setPendingList] = useState<Array<{ amount: number; unfreezeTime: string; type: string }>>([])
    const loadPending = useCallback(async () => {
        if (!user?.address) return
        try {
            const rows = await srApi.getUnfrozenV2(user.address, true)
            // 按时间倒序
            rows.sort((a, b) => (new Date(b.unfreezeTime).getTime() || 0) - (new Date(a.unfreezeTime).getTime() || 0))
            setPendingList(rows)
        } catch (e: any) {
            // 静默失败或打到全局错误
            console.warn('load unfrozenV2 error', e?.message)
        }
    }, [user?.address])

    //解冻中多页显示
    const PAGE_SIZE = 6
    const [page, setPage] = useState(1)

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(pendingList.length / PAGE_SIZE)),
        [pendingList.length]
    )

// 当前页数据
    const pageItems = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE
        return pendingList.slice(start, start + PAGE_SIZE)
    }, [pendingList, page])

// 当列表或地址变化时，校正页码
    useEffect(() => {
        if (page > totalPages) setPage(totalPages)
        if (page < 1) setPage(1)
    }, [totalPages])

// 翻页动作
    const goto = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)))

    // 拉取 /api/frozenV2 + 正在解冻
    useEffect(() => {
        let mounted = true
        async function load() {
            if (!user?.address) return
            try {
                const list = await srApi.getFrozenV2(user.address, true)
                if (!mounted) return
                const grouped = srApi.groupFrozenTRXByType(list)
                setByTypeTRX(grouped)
                setTotalTRX(srApi.sumFrozenTRX(list))
                setErrMsg('')
                setVal('')

                const bw = grouped.get('BANDWIDTH') || 0
                const eg = grouped.get('ENERGY') || 0
                if (selectedType === 'BANDWIDTH' && bw <= 0 && eg > 0) setSelectedType('ENERGY')
                if (selectedType === 'ENERGY' && eg <= 0 && bw > 0) setSelectedType('BANDWIDTH')
            } catch (e: any) {
                dispatch({ type: 'setError', payload: e?.message || 'load frozenV2 error' })
            }
            // 正在解冻
            await loadPending()
        }
        load()
        return () => { mounted = false }
    }, [user?.address])

    const typeCap = Number(byTypeTRX.get(selectedType) || 0) // TRX 小数

    const parseInput = (s: string) => {
        if (!s || !s.trim()) return NaN
        const n = Number(s)
        return Number.isFinite(n) ? n : NaN
    }
    const onChangeVal = (s: string) => {
        const cleaned = s.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
        setVal(cleaned)
        if (errMsg) setErrMsg('')
    }
    const setHalf = () => {
        const v = Math.max(0, typeCap / 2)
        setVal(v.toFixed(6).replace(/0+$/, '').replace(/\.$/, ''))
    }
    const setMax = () => {
        const v = Math.max(0, typeCap)
        setVal(v.toFixed(6).replace(/0+$/, '').replace(/\.$/, ''))
    }
    const onPickType = (tp: AllowType) => {
        setSelectedType(tp)
        const n = parseInput(val)
        if (Number.isFinite(n)) {
            const cap = byTypeTRX.get(tp) || 0
            const clamped = Math.min(Math.max(0, n), cap)
            setVal(clamped === 0 ? '' : clamped.toFixed(6).replace(/0+$/, '').replace(/\.$/, ''))
        }
        if (errMsg) setErrMsg('')
    }

    const checkValid = () => {
        const n = parseInput(val)
        if (!Number.isFinite(n) || n <= 0) {
            setErrMsg(t('unfreezeConfirm.invalid', { defaultValue: '请输入有效数量' }))
            return { ok: false, n: 0 }
        }
        if (n > typeCap + 1e-12) {
            setErrMsg(t('unfreezeConfirm.invalid', { defaultValue: '请输入有效数量' }))
            return { ok: false, n: 0 }
        }
        return { ok: true, n }
    }

    const openConfirm = () => {
        const { ok } = checkValid()
        if (ok) setConfirmOpen(true)
    }

    const doUnfreeze = async () => {
        const { ok, n } = checkValid()
        if (!ok || !user?.address) {
            setConfirmOpen(false)
            return
        }
        try {
            setErrMsg('')
            dispatch({ type: 'setFreezing', payload: true })
            setConfirmOpen(false)

            const amountSUN = Math.round(n * 1_000_000)
            const typeCode: '0' | '1' = selectedType === 'BANDWIDTH' ? '0' : '1'
            const hash = await srApi.postUnfreeze(user.address, amountSUN, typeCode, true)

            dispatch({ type: 'setTxHash', payload: { freeze: hash } })

            if (typeof onAfterSuccess === 'function') await onAfterSuccess()

            // 刷新额度与“正在解冻”
            try {
                const list = await srApi.getFrozenV2(user.address, true)
                setByTypeTRX(srApi.groupFrozenTRXByType(list))
                setTotalTRX(srApi.sumFrozenTRX(list))
                setVal('')
            } catch {}
            await loadPending()
        } catch (e: any) {
            dispatch({ type: 'setError', payload: e?.message || 'unfreeze error' })
            setErrMsg(t('unfreeze.failed'))
        } finally {
            dispatch({ type: 'setFreezing', payload: false })
        }
    }

    const chips = (
        <div className="sr-tabs">
      <span className="sr-chip disabled" title={t('unfreeze.types.all', { defaultValue: '全部' })}>
        {t('unfreeze.types.all', { defaultValue: '全部' })} · {Math.max(0, totalTRX).toFixed(2)} TRX
      </span>
            <span
                className={`sr-chip ${selectedType === 'BANDWIDTH' ? 'active' : ''}`}
                onClick={() => onPickType('BANDWIDTH')}
            >
        {t('unfreeze.types.bandwidth', { defaultValue: '带宽' })} · {(byTypeTRX.get('BANDWIDTH') || 0).toFixed(2)} TRX
      </span>
            <span
                className={`sr-chip ${selectedType === 'ENERGY' ? 'active' : ''}`}
                onClick={() => onPickType('ENERGY')}
            >
        {t('unfreeze.types.energy', { defaultValue: '能量' })} · {(byTypeTRX.get('ENERGY') || 0).toFixed(2)} TRX
      </span>
        </div>
    )

    const disabledAll = typeCap <= 0

    return (
        <div className="sr-panel">
            <div className="sr-panel__head">
                <div className="sr-panel__title">{t('unfreeze.title')}</div>
            </div>

            <div className="sr-col sr-gap-16">
                {/* 总可解冻 */}
                <div className="sr-row sr-space-between sr-align-center">
                    <div className="sr-muted" style={{ fontSize: 12 }}>{t('unfreeze.available')}：</div>
                    <div className="sr-number-md">{Math.max(0, totalTRX).toFixed(2)} TRX</div>
                </div>

                {chips}

                {/* 数量（支持小数） */}
                <input
                    className="sr-input"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.0"
                    value={val}
                    onChange={(e) => onChangeVal(e.target.value)}
                    disabled={disabledAll}
                />

                <div className="sr-row sr-gap-16 sr-align-center" style={{ justifyContent: 'flex-end' }}>
                    {errMsg ? <span className="sr-badge danger" style={{ marginRight: 'auto' }}>{errMsg}</span> : null}

                    <button className="sr-btn" disabled={disabledAll} onClick={setHalf}>
                        {t('freeze.half')}
                    </button>
                    <button className="sr-btn" disabled={disabledAll} onClick={setMax}>
                        {t('freeze.max')}
                    </button>
                    <button
                        className="sr-btn primary"
                        onClick={openConfirm}
                        disabled={state.freezing || disabledAll}
                    >
                        {t('unfreeze.submit')}
                    </button>
                </div>

                {/* —— 二次确认 —— */}
                <ConfirmUnfreezeModal
                    open={confirmOpen}
                    amountTRX={Number(parseInput(val) || 0)}
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={doUnfreeze}
                />

                {/* —— 正在解冻列表 —— */}
                <div className="sr-card" style={{ marginTop: 10 }}>
                    <div className="sr-card__title">{t('unfreeze.pending.title')}</div>

                    {pendingList.length === 0 ? (
                        <div className="sr-muted" style={{ padding: '10px 0' }}>
                            {t('unfreeze.pending.empty')}
                        </div>
                    ) : (
                        <>
                            <div className="sr-table cols-3">
                                <div className="sr-table__row head">
                                    <div>{t('unfreeze.pending.cols.type')}</div>
                                    <div>{t('unfreeze.pending.cols.amount')}</div>
                                    <div>{t('unfreeze.pending.cols.time')}</div>
                                </div>

                                {pageItems.map((row, idx) => {
                                    const typeLabel =
                                        row.type === 'BANDWIDTH'
                                            ? t('unfreeze.types.bandwidth', { defaultValue: '带宽' })
                                            : row.type === 'ENERGY'
                                                ? t('unfreeze.types.energy', { defaultValue: '能量' })
                                                : row.type || '-'
                                    const amountTRX = (row.amount)/1000000

                                    return (
                                        <div className="sr-table__row" key={`${row.unfreezeTime}-${idx}`}>
                                            <div>{typeLabel}</div>
                                            <div>{amountTRX} TRX</div>
                                            <div>{row.unfreezeTime || '-'}</div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* 分页器 */}
                            <div className="sr-pager sr-row sr-center sr-gap-8" style={{ marginTop: 12 }}>
                                <button className="sr-btn" onClick={() => goto(page - 1)} disabled={page <= 1}>‹</button>

                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const p = i + 1
                                    // 如果页数很多可在这里做省略显示，这里先全部展示
                                    return (
                                        <button
                                            key={p}
                                            className={`sr-btn ${p === page ? 'active' : ''}`}
                                            onClick={() => goto(p)}
                                        >
                                            {p}
                                        </button>
                                    )
                                })}

                                <button className="sr-btn" onClick={() => goto(page + 1)} disabled={page >= totalPages}>›</button>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}
