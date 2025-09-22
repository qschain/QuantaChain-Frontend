import Card from '../../components/Card';
import { useEffect, useState } from 'react';
import { transferTrx } from '../../shared/api/api';
import { useSession } from '../../state/WalletSessionProvider';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../../../../shared/lib/i18n/i18n';

export default function SendAsset() {
    const [balance, setBalance] = useState(12.543);
    const [fee, setFee] = useState<{ fee: number; fiat: number }>({ fee: 0.002, fiat: 5.8 });
    const { t } = useTranslation(['wallet']);
    const { user } = useSession();
    const [toTronAddress, setToTronAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const locale = i18n.language?.startsWith('zh') ? 'zh-CN' : 'en-US';

    const handleTransfer = async () => {
        if (!user?.name || !user?.token) {
            setError('未登录或会话失效');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // 这里假设token即为密码，实际可根据SessionProvider调整
            const resp = await transferTrx({
                userName: user.name,
                passWord: user.token || '',
                toTronAddress,
                amount: Number(amount)
            });
            setResult(resp);
        } catch (e: any) {
            setError(e?.message || '转账失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <Card title={t('sendAsset.title')}>
                <div className="grid" style={{ gap: 14, maxWidth: 720 }}>
                    <div>
                        <div className="mb-2">TRON地址</div>
                        <input className="input" value={toTronAddress} onChange={e => setToTronAddress(e.target.value)} placeholder="请输入TRON地址" />
                    </div>
                    <div className="row" style={{ gap: 14 }}>
                        <div style={{ flex: 2 }}>
                            <div className="mb-2">资产类型</div>
                            <select className="select" disabled><option>TRX</option></select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div className="mb-2">金额</div>
                            <input className="input" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
                        </div>
                    </div>
                    <div className="row space-between secondary">
                        <div>余额：{balance} TRX</div>
                        <div>手续费 ≈ {fee.fee} TRX ({fee.fiat.toLocaleString(locale, { style: 'currency', currency: 'USD' })})</div>
                    </div>
                    <button className="btn" onClick={handleTransfer} disabled={loading}>{loading ? '转账中...' : '确认转账'}</button>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {result && <pre style={{ background: '#f6f6f6', padding: 10 }}>{JSON.stringify(result, null, 2)}</pre>}
                </div>
            </Card>
        </div>
    );
}
