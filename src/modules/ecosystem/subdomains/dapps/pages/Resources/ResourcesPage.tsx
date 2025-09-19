// src/modules/ecosystem/features/dapps/pages/Resources/ResourcesPage.tsx
import SectionHeader from '../../components/SectionHeader';
import { useTranslation } from 'react-i18next';

export default function ResourcesPage(){
    const { t } = useTranslation('dapps');
    return (
        <div className="container vertical">
            <SectionHeader title={t('resources.title')} right={<button className="btn ghost">{t('common.backHome')}</button>} />
            <div className="tabs row gap">
                <button className="btn ghost active">{t('resources.tab.learn')}</button>
                <button className="btn ghost">{t('resources.tab.report')}</button>
            </div>

            <div className="grid cols-3 gap">
                {['web3Wallet','dappGuide','smartContract','nftBasics'].map(k=>(
                    <div key={k} className="panel tall">
                        <div className="panel-title">{t(`resources.cards.${k}.title`)}</div>
                        <div className="progress"><div className="bar" style={{width: k==='nftBasics'?'100%':k==='dappGuide'?'40%':'70%'}}/></div>
                        <button className="btn">{t(`resources.cards.${k}.cta`)}</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
