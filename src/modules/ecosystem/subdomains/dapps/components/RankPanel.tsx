import React from 'react'
import type { Dapp } from '../api/dappApi'

export default function RankPanel({
  title,
  items,
  limit = 4,
}: {
  title: string
  items: Dapp[]
  limit?: number
}) {
  return (
    <div className="dapps-rank">
      <div className="dapps-rank__head">{title}</div>

      <ul className="dapps-rank__list">
        {items.slice(0, limit).map((d, idx) => (
          <li key={d.id} className="dapps-rank__item">
            <span className="dapps-rank__pos">{idx + 1}</span>

            <span className="dapps-rank__logo">
              {(d.name || 'DP').slice(0, 2).toUpperCase()}
            </span>

            <div className="dapps-rank__info">
              <div className="dapps-rank__name">{d.name}</div>
              <div className="dapps-rank__sub">{d.category}</div>
            </div>

            <div className="dapps-rank__val">
              {d.kpiDisplay ?? d.volume24hDisplay ?? d.users24hDisplay ?? '—'}
            </div>

            {/* 根据数据动态加 class：up / down */}
            <div
              className={`dapps-rank__chg ${
                d.change && d.change.startsWith('-') ? 'down' : 'up'
              }`}
            >
              {d.change ?? ''}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
