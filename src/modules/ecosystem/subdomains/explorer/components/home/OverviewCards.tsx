import { useTranslation } from 'react-i18next';
import StatCard from '../StatCard';
import Skeleton from '../Skeleton';
import type { ChainOverview } from '../../state/types';

export default function OverviewCards({ overview }:{ overview?: ChainOverview }) {
    const { t } = useTranslation('explorer');

    return (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:4 }}>
            {!overview ? <Skeleton rows={1}/> : (
                <>
                    <StatCard title={t('overview.tps')}        value={overview.data.currentTps.toLocaleString()} />
                    <StatCard title={t('overview.height')}     value={overview.data.blockHeight.toLocaleString()} />
                    <StatCard title={t('overview.validators')} value={overview.data.superNumber.toLocaleString()} />
                    <StatCard title={t('overview.price')}      value={`$${overview.data.trxRate.toFixed(3)}`} />
                </>
            )}
        </div>
    );
}
