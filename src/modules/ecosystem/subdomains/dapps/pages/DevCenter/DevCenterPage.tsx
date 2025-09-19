// src/modules/ecosystem/features/dapps/pages/DevCenter/DevCenterPage.tsx
import SectionHeader from '../../components/SectionHeader';
import Accordion from '../../components/Accordion';
import { useTranslation } from 'react-i18next';

export default function DevCenterPage(){
    const { t } = useTranslation('dapps');
    return (
        <div className="container vertical">
            <SectionHeader title={t('dev.title')} right={<button className="btn ghost">{t('common.backHome')}</button>}/>
            <div className="panel tall">
                <div className="panel-title">{t('dev.submit.title')}</div>
                {/* 表单占位 */}
                <div className="grid cols-2 gap">
                    <div className="panel">
                        <label className="lbl">{t('dev.form.name')}<input className="input"/></label>
                        <label className="lbl">{t('dev.form.desc')}<textarea className="input" rows={5}/></label>
                        <label className="lbl">URL<input className="input" placeholder="https://example.com"/></label>
                    </div>
                    <div className="panel">
                        <label className="lbl">{t('dev.form.email')}<input className="input"/></label>
                        <label className="lbl">{t('dev.form.logo')}<div className="upload">{t('dev.form.uploadImg')}</div></label>
                        <label className="lbl">{t('dev.form.pkg')}<div className="upload">{t('dev.form.uploadPkg')}</div></label>
                    </div>
                </div>
                <button className="btn right">{t('dev.submit.cta')}</button>
            </div>

            <div className="panel">
                <div className="panel-title">{t('dev.api.title')}</div>
                <Accordion title="GET /api/dapps">
                    <div className="code">curl /api/dapps</div>
                </Accordion>
                <Accordion title="POST /api/transactions">
                    <div className="code">curl -X POST /api/transactions</div>
                </Accordion>
                <Accordion title={t('dev.api.sdk')}>
                    <div className="code">{t('dev.api.sdkGuide')}</div>
                </Accordion>
                <button className="btn right">{t('dev.api.downloadSdk')}</button>
            </div>
        </div>
    );
}
