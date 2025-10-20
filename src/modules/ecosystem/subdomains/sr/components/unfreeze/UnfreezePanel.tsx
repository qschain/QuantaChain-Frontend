import {useTranslation} from "react-i18next";
import {useSr} from "../../state/store";
import {useSession} from "../../../../../../app/session/PlatformSessionProvider";
import {useEffect, useState} from "react";
import srApi from "../../shared/api/srApi";
import ConfirmUnfreezeModal from "./ConfirmUnfreezeModal";

export default function UnfreezePanel({ onAfterSuccess }: { onAfterSuccess?: () => void }) {
    const { t } = useTranslation('sr')
    const { state, dispatch } = useSr()
    const { user } = useSession()

    const [val, setVal] = useState<string>('')   // 文本输入，支持小数
    const [errMsg, setErrMsg] = useState('')
    const [confirmOpen, setConfirmOpen] = useState(false)

    // 冻结数据
    const [byTypeTRX, setByTypeTRX] = useState<Map<string, number>>(new Map())
    const [totalTRX, setTotalTRX] = useState(0)

    // 仅允许 'BANDWIDTH' / 'ENERGY'
    type AllowType = 'BANDWIDTH' | 'ENERGY'
    const [selectedType, setSelectedType] = useState<AllowType>('BANDWIDTH')

    // 拉取 /api/frozenV2
    useEffect(() => {
        let mounted = true
        async function load() {
            if (!user?.address) return
            try {
                const list = await srApi.getFrozenV2(user.address, true)
                if (!mounted) return
                const grouped = srApi.groupFrozenTRXByType(list) // TRX (小数)
                setByTypeTRX(grouped)
                setTotalTRX(srApi.sumFrozenTRX(list))
                setErrMsg('')
                setVal('')
                // 如果当前选择类型额度为 0，尝试切到另一个；都为 0 则保持
                const bw = grouped.get('BANDWIDTH') || 0
                const eg = grouped.get('ENERGY') || 0
                if (selectedType === 'BANDWIDTH' && bw <= 0 && eg > 0) setSelectedType('ENERGY')
                if (selectedType === 'ENERGY' && eg <= 0 && bw > 0) setSelectedType('BANDWIDTH')
            } catch (e: any) {
                dispatch({ type: 'setError', payload: e?.message || 'load frozenV2 error' })
            }
        }
        load()
        return () => { mounted = false }
    }, [user?.address])

    // 当前类型上限（TRX，小数）
    const typeCap = Number(byTypeTRX.get(selectedType) || 0)

    // 解析输入为正数（支持小数）；非法返回 NaN
    const parseInput = (s: string) => {
        if (!s || !s.trim()) return NaN
        const n = Number(s)
        return Number.isFinite(n) ? n : NaN
    }

    // 输入变更：仅做正数过滤与上限 clamp（小数保留到 6 位）
    const onChangeVal = (s: string) => {
        // 允许输入阶段性的 "." 或 "0." —— 用正则过滤非数字与多余点
        const cleaned = s.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
        setVal(cleaned)
        if (errMsg) setErrMsg('')
    }

    // 快捷键（50%、MAX）
    const setHalf = () => {
        const v = Math.max(0, typeCap / 2)
        setVal(v.toFixed(6).replace(/0+$/, '').replace(/\.$/, ''))
    }
    const setMax = () => {
        const v = Math.max(0, typeCap)
        setVal(v.toFixed(6).replace(/0+$/, '').replace(/\.$/, ''))
    }

    // 选择类型（仅两种）
    const onPickType = (tp: AllowType) => {
        setSelectedType(tp)
        // 切类型时重新 clamp 当前值
        const n = parseInput(val)
        if (Number.isFinite(n)) {
            const clamped = Math.min(Math.max(0, n), byTypeTRX.get(tp) || 0)
            setVal(
                clamped === 0
                    ? ''
                    : clamped.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
            )
        }
        if (errMsg) setErrMsg('')
    }

    // 校验（>0 且 ≤ 上限）
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

            // 小数 TRX → 整数 SUN（四舍五入）
            const amountSUN = Math.round(n * 1_000_000)
            const typeCode: '0' | '1' = selectedType === 'BANDWIDTH' ? '0' : '1'

            const hash = await srApi.postUnfreeze(user.address, amountSUN, typeCode, true)

            // 复用交易结果弹窗
            dispatch({ type: 'setTxHash', payload: { freeze: hash } })

            if (typeof onAfterSuccess === 'function') await onAfterSuccess()

            // 刷新冻结数据并清空输入
            try {
                const list = await srApi.getFrozenV2(user.address, true)
                setByTypeTRX(srApi.groupFrozenTRXByType(list))
                setTotalTRX(srApi.sumFrozenTRX(list))
                setVal('')
            } catch {}
        } catch (e: any) {
            dispatch({ type: 'setError', payload: e?.message || 'unfreeze error' })
            setErrMsg(t('unfreeze.failed'))
        } finally {
            dispatch({ type: 'setFreezing', payload: false })
        }
    }

    // 两个类型按钮 + “全部”(禁用)
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
                {/* 总可解冻（展示） */}
                <div className="sr-row sr-space-between sr-align-center">
                    <div className="sr-muted" style={{ fontSize: 12 }}>{t('unfreeze.available')}：</div>
                    <div className="sr-number-md">{Math.max(0, totalTRX).toFixed(2)} TRX</div>
                </div>

                {chips}

                {/* 数量（允许小数） */}
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
                    {/* 错误提示靠左、按钮靠右 */}
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
            </div>

            {/* 二次确认 */}
            <ConfirmUnfreezeModal
                open={confirmOpen}
                amountTRX={Number(parseInput(val) || 0)}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={doUnfreeze}
            />
        </div>
    )
}
