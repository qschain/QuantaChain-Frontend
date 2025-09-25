import React from 'react'
import type { Dapp } from '../api/dappApi'

export default function DappCard({ dapp }: { dapp: Dapp }) {
  return (
    <div className="dapps-card">
      <div className="dapps-card__logo">
        {(dapp.name || 'DP').slice(0, 2).toUpperCase()}
      </div>

      <div className="dapps-card__title">{dapp.name}</div>
      <div className="dapps-card__sub">{dapp.category}</div>

      <div className="dapps-card__metric">
        <span className="dapps-card__metric-key">
          {dapp.metricLabel ?? '24h 交易量'}
        </span>
        <span className="dapps-card__metric-val">
          {dapp.metricValue ?? dapp.volume24hDisplay ?? '—'}
        </span>
      </div>
    </div>
  )
}
