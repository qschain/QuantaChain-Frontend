import Card from '../../components/Card'
import { useTranslation } from 'react-i18next'

export default function About(){
    const { t } = useTranslation()
    return (
        <Card title={t('common.settings.about')}>
            <div className="grid" style={{gap:12}}>
                <div>{t('about.product')}: Digital Asset OS</div>
                <div>{t('about.version')}: v1.0.0</div>
                <div>{t('about.license')}: MIT</div>
            </div>
        </Card>
    )
}
