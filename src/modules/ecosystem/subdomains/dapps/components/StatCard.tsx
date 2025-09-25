import React from 'react'

type StatIcon = 'apps' | 'users' | 'tx24' | 'total'

export default function StatCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string
  value: string
  delta?: string
  icon?: StatIcon
}) {
  return (
    <div className="dapps-stat-card">
      <div className="dapps-stat-card__meta">
        <div className="dapps-stat-card__label">{label}</div>
        <div className="dapps-stat-card__value">{value}</div>
        {delta && (
          <div
            className={`dapps-stat-card__delta ${
              delta.startsWith('-') ? 'down' : 'up'
            }`}
          >
            {delta}
          </div>
        )}
      </div>
      <span className={`dapps-stat-card__ic ${icon ?? ''}`} />
    </div>
  )
}
