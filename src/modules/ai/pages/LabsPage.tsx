import { useTranslation } from 'react-i18next';

export default function LabsPage() {
    const { t } = useTranslation('ai');
    return (
        <div style={{ padding: 16 }}>
    <h1>{t('title.labs')}</h1>
    <p>{t('desc.labs')}</p>
    </div>
);
}
