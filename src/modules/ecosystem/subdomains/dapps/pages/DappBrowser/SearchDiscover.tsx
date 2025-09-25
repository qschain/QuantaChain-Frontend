// src/modules/ecosystem/features/dapps/pages/DappBrowser/SearchDiscoverPage.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DappCard from '../../components/DappCard';
import SectionHeader from '../../components/SectionHeader';
import * as api from '../../api/dappApi';
import type { Dapp } from '../../types';
import usePagination from '../../hooks/usePagination';

export default function SearchDiscoverPage() {
  const { t } = useTranslation('dapps');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Dapp[]>([]);
  const pag = usePagination({ pageSize: 12 });

  useEffect(() => {
    api.searchDapps({ q, page: pag.page, pageSize: pag.pageSize }).then((res) => {
      setItems(res.list);
      pag.setTotal(res.total);
    });
  }, [q, pag.page, pag.pageSize]);

  return (
    <div className="dapps-col dapps-gap-16">
      <SectionHeader
        title={t('discover.title')}
        sub={t('discover.sub')}
      />

      <div className="dapps-panel">
        <div className="dapps-row dapps-gap-16">
          <input
            className="dapps-input"
            placeholder={t('common.searchPlaceholder') as string}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="dapps-btn">{t('common.search')}</button>
        </div>

        <div className="dapps-row dapps-gap-16" style={{ marginTop: 12 }}>
          <select className="dapps-input">
            <option>{t('discover.selectCategory')}</option>
          </select>
          <select className="dapps-input">
            <option>{t('discover.selectChain')}</option>
          </select>
          <select className="dapps-input">
            <option>{t('discover.selectTVL')}</option>
          </select>
          <select className="dapps-input">
            <option>{t('discover.selectUsers')}</option>
          </select>
          <button className="dapps-btn ghost">{t('common.clearAll')}</button>
        </div>
      </div>

      <SectionHeader title={t('discover.recommend')} />
      <div className="dapps-panel">{t('discover.carouselPlaceholder')}</div>

      <SectionHeader
  title={t('discover.results')}
  sub={`${t('discover.totalFound')} ${pag.total}`}
/>
      <div className="dapps-grid dapps-grid-4">
        {items.map((d) => (
          <DappCard key={d.id} dapp={d} />
        ))}
      </div>

      <div className="dapps-row dapps-gap-16 dapps-align-center" style={{ alignSelf: 'center' }}>
        <button className="dapps-btn ghost" onClick={() => pag.prev()} disabled={pag.page === 1}>
          ‹
        </button>
        <span>
          {pag.page} / {pag.pages}
        </span>
        <button className="dapps-btn ghost" onClick={() => pag.next()} disabled={pag.page === pag.pages}>
          ›
        </button>
      </div>
    </div>
  );
}
