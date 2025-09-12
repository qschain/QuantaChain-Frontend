import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SearchBar({ size='lg' }:{ size?:'sm'|'lg' }) {
    const { t } = useTranslation('explorer');
    const [q, setQ] = useState('');
    const nav = useNavigate();

    function go(){
        const s = q.trim();
        if (!s) return;
        if (/^\d+$/.test(s)) return nav(`/ecosystem/explorer/block/${Number(s)}`);
        if (/^(0x)?[0-9a-fA-F]{64}$/.test(s)) return nav(`/ecosystem/explorer/tx/${s}`);
        if (/^T[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(s)) return alert(t('common.empty')); // 地址页留作扩展
        nav(`/ecosystem/explorer/search?q=${encodeURIComponent(s)}`);
    }
    return (
        <div style={{ display:'flex', gap:8 }}>
            <input
                value={q}
                onChange={e=>setQ(e.target.value)}
                placeholder={t('hero.placeholder')}
                style={{ flex:1, padding:size==='lg'? '14px 16px':'8px 10px', borderRadius:10, border:'1px solid #2a2f36', background:'#14161a', color:'#e8eef6' }}
            />
            <button className="btn primary" onClick={go} style={{ borderRadius:10, padding:'0 16px' }}>{t('hero.search')}</button>
        </div>
    );
}
