import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import './footbar.css';

type Props = { version?: string };

function FootbarBase({ version = 'v2.1.0' }: Props) {
    const { t } = useTranslation('common');

    return (
        <footer className="qc-footer" data-qc="footer">
            <div className="qc-footer__content">
                <div className="qc-footer__brand">
                    <div className="qc-footer__brand-title">{t('footer.brandTitle')}</div>
                    <p className="qc-footer__brand-desc">{t('footer.brandDesc')}</p>
                    {/*<p className="qc-footer__brand-links">*/}
                    {/*    {t('footer.summary')}*/}
                    {/*    <br />*/}
                    {/*    {t('footer.devTools')}*/}
                    {/*    <br />*/}
                    {/*    {t('footer.devLinks')}*/}
                    {/*    <br />*/}
                    {/*    {t('footer.contact')}*/}
                    {/*</p>*/}
                </div>

                <div className="qc-footer__meta">
                    <span>{t('footer.lang')}</span>
                    <button className="qc-footer__theme">{t('footer.theme')}</button>
                    <span className="qc-footer__ver">
            {t('footer.version')} {version}
          </span>
                </div>
            </div>

            <div className="qc-footer__copy">
                © 2025 QuantaChain Technologies Ltd. {t('footer.version')} {version}
            </div>
        </footer>
    );
}

export default memo(FootbarBase);
