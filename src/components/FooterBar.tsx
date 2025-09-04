import { useTranslation } from 'react-i18next'

export default function FooterBar() {
    const { t } = useTranslation(['common'])
    return (
        <div className="footer">
            <div>
                {t('systemStatus')}：<span className="badge green">{t('operational')}</span>
                　{t('lastSync')}：2025-01-20 14:30:25　
                {t('blockHeight')}：#2,847,392
            </div>
            <div>
                {t('productName')} v1.0.0　
                <span className="badge blue">{t('securityCertified')}</span>
                <span className="badge" style={{marginLeft:6}}>{t('multiChainSupport')}</span>
                <span className="badge green" style={{marginLeft:6}}>{t('quantumEncryption')}</span>
            </div>
        </div>
    )
}
