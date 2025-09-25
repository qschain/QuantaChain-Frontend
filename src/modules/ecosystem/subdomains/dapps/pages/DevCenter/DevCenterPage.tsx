// src/modules/ecosystem/features/dapps/pages/DevCenter/DevCenterPage.tsx
import SectionHeader from '../../components/SectionHeader';
import Accordion from '../../components/Accordion';
import { useTranslation } from 'react-i18next';

export default function DevCenterPage() {
  const { t } = useTranslation('dapps');
  return (
    <div className="dapps-col dapps-gap-16">
      <SectionHeader
        title={t('dev.title')}
        right={<button className="dapps-btn ghost">{t('common.backHome')}</button>}
      />

      {/* 提交表单 */}
      <div className="dapps-panel dapps-tall dapps-col dapps-gap-16">
        <div className="dapps-panel-head">{t('dev.submit.title')}</div>
        <div className="dapps-grid dapps-grid-2">
          <div className="dapps-panel dapps-col dapps-gap-16">
            <label className="dapps-lbl">
              {t('dev.form.name')}
              <input className="dapps-input" />
            </label>
            <label className="dapps-lbl">
              {t('dev.form.desc')}
              <textarea className="dapps-input" rows={5} />
            </label>
            <label className="dapps-lbl">
              URL
              <input className="dapps-input" placeholder="https://example.com" />
            </label>
          </div>
          <div className="dapps-panel dapps-col dapps-gap-16">
            <label className="dapps-lbl">
              {t('dev.form.email')}
              <input className="dapps-input" />
            </label>
            <label className="dapps-lbl">
              {t('dev.form.logo')}
              <div className="dapps-upload">{t('dev.form.uploadImg')}</div>
            </label>
            <label className="dapps-lbl">
              {t('dev.form.pkg')}
              <div className="dapps-upload">{t('dev.form.uploadPkg')}</div>
            </label>
          </div>
        </div>
        <button className="dapps-btn right">{t('dev.submit.cta')}</button>
      </div>

      {/* API & SDK */}
      <div className="dapps-panel dapps-col dapps-gap-16">
        <div className="dapps-panel-head">{t('dev.api.title')}</div>
        <Accordion title="GET /api/dapps">
          <div className="dapps-code">curl /api/dapps</div>
        </Accordion>
        <Accordion title="POST /api/transactions">
          <div className="dapps-code">curl -X POST /api/transactions</div>
        </Accordion>
        <Accordion title={t('dev.api.sdk')}>
          <div className="dapps-code">{t('dev.api.sdkGuide')}</div>
        </Accordion>
        <button className="dapps-btn right">{t('dev.api.downloadSdk')}</button>
      </div>
    </div>
  );
}
