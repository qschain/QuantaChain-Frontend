import Card from '../../components/Card'
import { useTranslation } from 'react-i18next'

export default function About() {
    const { t } = useTranslation(['wallet'])
    return (
        <Card title={t('settings.about')}>
            <div className="qcw-grid" style={{ gap: 12 }}>
                <div className="qcw-row">
                    <span className="qcw-label">{t('about.product')}:</span>
                    <span>Digital Asset OS</span>
                </div>

                <div className="qcw-row">
                    <span className="qcw-label">{t('about.version')}:</span>
                    <span>v1.0.0</span>
                </div>

                <div className="qcw-row">
                    <span className="qcw-label">{t('about.license')}:</span>
                    <span>MIT</span>
                </div>
            </div>
        </Card>
    )
}
