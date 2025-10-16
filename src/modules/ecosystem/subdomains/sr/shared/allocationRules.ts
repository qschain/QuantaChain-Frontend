// sr/shared/allocationRules.ts —— 纯函数：分配/缩放/规范化
export const normalizeInt = (n: number) => Math.max(0, Math.floor(Number(n) || 0))
export const sumAlloc = (alloc: Record<string, number>) =>
    Object.values(alloc).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0)

/** 将现有 allocations 缩放到目标总量（按比例；最后一项兜底补差） */
export function scaleToTotal(alloc: Record<string, number>, targetTotal: number) {
    const keys = Object.keys(alloc)
    const clean = Object.fromEntries(keys.map(k => [k, normalizeInt(alloc[k])]))
    const oldTotal = Math.max(0, sumAlloc(clean))
    const target = normalizeInt(targetTotal)
    if (!keys.length) return {}
    if (target === 0) return Object.fromEntries(keys.map(k => [k, 0]))
    if (oldTotal === 0) {
        const avg = Math.floor(target / keys.length)
        const rest = target - avg * keys.length
        const res: Record<string, number> = {}
        keys.forEach((k, i) => (res[k] = avg + (i === keys.length - 1 ? rest : 0)))
        return res
    }
    const res: Record<string, number> = {}
    let acc = 0
    keys.slice(0, -1).forEach(k => {
        const v = Math.floor((clean[k] / oldTotal) * target)
        res[k] = v
        acc += v
    })
    res[keys[keys.length - 1]] = target - acc
    return res
}

/** 在现有分配上追加 delta（按比例或平均）；返回新 map */
export function addByProportion(
    alloc: Record<string, number>,
    delta: number,
    mode: 'proportion' | 'even' = 'proportion'
) {
    const keys = Object.keys(alloc)
    if (delta <= 0 || keys.length === 0) return alloc
    if (mode === 'even') {
        const add = Math.floor(delta / keys.length)
        const rest = delta - add * keys.length
        const res: Record<string, number> = {}
        keys.forEach((k, i) => (res[k] = normalizeInt((alloc[k] || 0) + add + (i === keys.length - 1 ? rest : 0))))
        return res
    }
    const total = sumAlloc(alloc) || 1
    const res: Record<string, number> = {}
    let acc = 0
    keys.slice(0, -1).forEach(k => {
        const v = Math.floor(((alloc[k] || 0) / total) * delta)
        res[k] = normalizeInt((alloc[k] || 0) + v)
        acc += v
    })
    res[keys[keys.length - 1]] = normalizeInt((alloc[keys[keys.length - 1]] || 0) + (delta - acc))
    return res
}
