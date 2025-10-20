import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../../styles/transfer.css'

type Values = { address: string; amount: string }

export default function TransferForm({
    onSubmit,
    loading,
    error,
}: {
    onSubmit: (v: Values) => void
    loading?: boolean
    error?: string | null
}) {
    const { t } = useTranslation(['wallet'])
    const [address, setAddress] = useState('')
    const [amount, setAmount] = useState('')
    const [unit, setUnit] = useState('sun')

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const regex = unit === 'sun' ? /^[1-9]\d*$/ : /^\d*\.?\d*$/ // sun: no decimals, trx: allow decimals

        if (regex.test(value) || value === '') {
            setAmount(value)
        }
    }

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newUnit = e.target.value
        setUnit(newUnit)
        // Convert amount to sun if switching to trx
        if (newUnit === 'trx') {
            setAmount((parseInt(amount) / 1000000).toString())
        } else {
            setAmount((parseInt(amount) * 1000000).toString())
        }
    }

    const submit = () => {
        const amountInSun = unit === 'trx' ? (parseInt(amount) * 100000).toString() : amount.trim()
        onSubmit({ address: address.trim(), amount: amountInSun })
    }

    return (
        <div className="form">
            <div className="form-group">
                <label>{t('recipientAddress')}</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('recipientAddressPlaceholder')}
                />
            </div>

            <div className="form-group">
                <label>{t('amount')}</label>
                <input
                    type="text" // Change to text to allow custom validation
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder={t('amountPlaceholder')}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '8px' }}>{t('unit')}</label> {/* 添加单位标签 */}
                    <select value={unit} onChange={handleUnitChange}>
                        <option value="sun">sun</option>
                        <option value="trx">trx</option>
                    </select>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
                className="btn primary"
                disabled={loading || !address || !amount}
                onClick={submit}
            >
                {loading ? t('sending') : t('send')}
            </button>
        </div>
    )
}