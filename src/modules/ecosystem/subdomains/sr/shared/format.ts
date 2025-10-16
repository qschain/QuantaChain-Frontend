export function nf(v: any, opts?: Intl.NumberFormatOptions) {
    const n = Number(v)
    if (!Number.isFinite(n)) return String(v ?? '-')
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0, ...(opts || {}) }).format(n)
}
