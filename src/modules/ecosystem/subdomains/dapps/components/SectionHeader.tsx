import React from 'react'

export default function SectionHeader({
  title,
  sub,
  right,
}: {
  title: string
  sub?: string
  right?: React.ReactNode
}) {
  return (
    <div className="dapps-section-hd">
      <div className="dapps-section-hd__lhs">
        <div className="dapps-section-hd__title">{title}</div>
        {sub && <div className="dapps-section-hd__sub">{sub}</div>}
      </div>
      {right && <div className="dapps-section-hd__rhs">{right}</div>}
    </div>
  )
}
