export function mergeNewStrict<T extends Record<string, any>>(
    prev: Array<T & { __justAdded?: boolean }> | undefined,
    next: T[],
    key: keyof T,
    limit = 10
): Array<T & { __justAdded?: boolean }> {
    if (!next?.length) return [];
    const topPrevKey = prev?.[0]?.[key];
    let added = 0;
    while (added < next.length && next[added][key] !== topPrevKey) added++;
    return next.slice(0, limit).map((v, i) => ({ ...(v as any), __justAdded: i < added }));
}
