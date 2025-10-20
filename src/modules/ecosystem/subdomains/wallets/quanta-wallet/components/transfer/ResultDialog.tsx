import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/transfer.css';

export default function ResultDialog({
  titleKey,
  children,
  onClose,
  primaryTextKey = 'ok',
}: {
  titleKey: string;
  children: React.ReactNode;
  onClose: () => void;
  primaryTextKey?: string;
}) {
  const { t } = useTranslation(['wallet']);
  
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3>{t(titleKey)}</h3>
        <div style={{marginTop: 8}}>{children}</div>
        <div className="modal-actions" style={{marginTop: 16}}>
          <button className="btn primary" onClick={onClose}>{t(primaryTextKey)}</button>
        </div>
      </div>
    </div>
  );
}