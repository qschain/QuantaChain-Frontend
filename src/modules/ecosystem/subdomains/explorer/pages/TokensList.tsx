import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../shared/api/api';
import type { TokenLite } from '../state/types';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';

export default function TokensList() {
    const { t } = useTranslation('explorer');
    const [list, setList] = useState<TokenLite[]>();
    const [total, setTotal] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    // 默认每页 20
    const size = 20;

    useEffect(() => {
        let alive = true;
        setLoading(true);
        setErr(null);

        api
            .getTokens(page, size /* , { useRealApi: true } */)
            .then((d) => {
                if (!alive) return;
                setList(d.items);
                setTotal(d.total);
            })
            .catch((e) => {
                if (!alive) return;
                setErr(e?.message || 'Failed to load tokens');
            })
            .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };
    }, [page]);

    // 如果拿不到 total，就让分页组件以“Prev/Next”工作；有 total 则常规计算页数
    const pages = useMemo(() => {
        if (typeof total === 'number') return Math.max(1, Math.ceil(total / size));
        return 999; // unknown total：给个大数占位，Pagination 内部仅启用上一页/下一页
    }, [total, size]);

    return (
        <div>
            <h2 style={{ marginTop: 0 }}>{t('tokens.title')}</h2>

            {err && (
                <div style={{ margin: '8px 0', color: '#ff6b6b' }}>
                    {t('common.error') ?? 'Error'}: {err}
                </div>
            )}

            {loading && !list ? (
                <Skeleton />
            ) : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ opacity: 0.8 }}>
                            <th style={{ textAlign: 'left', padding: '10px 6px' }}>#</th>
                            <th style={{ textAlign: 'left', padding: '10px 6px' }}>{t('table.hash')}</th>
                            <th style={{ textAlign: 'left', padding: '10px 6px' }}>{t('tokens.price')}</th>
                            <th style={{ textAlign: 'left', padding: '10px 6px' }}>{t('tokens.change24h')}</th>
                            <th style={{ textAlign: 'left', padding: '10px 6px' }}>{t('tokens.marketcap')}</th>
                            <th style={{ textAlign: 'left', padding: '10px 6px' }}>{t('tokens.volume24h')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(list ?? []).map((r) => (
                            <tr key={`${r.rank}-${r.symbol}`} style={{ borderTop: '1px solid #1d232a' }}>
                                <td style={{ padding: '10px 6px' }}>{r.rank}</td>
                                <td style={{ padding: '10px 6px' }}>
                                    {r.name} <span style={{ opacity: 0.7 }}>{r.symbol}</span>
                                </td>
                                <td style={{ padding: '10px 6px' }}>${r.price.toFixed(6)}</td>
                                <td
                                    style={{
                                        padding: '10px 6px',
                                        color: r.change24h >= 0 ? '#2dc78a' : '#ff6b6b',
                                    }}
                                >
                                    {r.change24h >= 0 ? '+' : ''}
                                    {r.change24h.toFixed(2)}%
                                </td>
                                <td style={{ padding: '10px 6px' }}>${r.marketcap.toLocaleString()}</td>
                                <td style={{ padding: '10px 6px' }}>${r.volume24h.toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <Pagination page={page} pages={pages} onChange={setPage} />
                </>
            )}
        </div>
    );
}
