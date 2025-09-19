// src/modules/ecosystem/features/explorer/components/ExplorerHero.tsx
import { useTranslation } from 'react-i18next';
import SearchBar from './SearchBar'; // 若 SearchBar 在别处，改路径
import '../styles/explorer.css';

export default function ExplorerHero(){
    const { t } = useTranslation('explorer');
    return (
        <div
            className="card"
            style={{
                padding: '32px 24px',
                textAlign: 'center',
                marginBottom: 18,
                background: 'radial-gradient(600px 200px at 50% -50%, rgba(0,255,255,.10), transparent), #14161a',
            }}
        >
            <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>{t('hero.title')}</h1>
            <p style={{ opacity: 0.85, margin: '8px 0 18px' }}>{t('hero.subtitle')}</p>
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
                <SearchBar size="lg" />
            </div>
        </div>
    );
}
