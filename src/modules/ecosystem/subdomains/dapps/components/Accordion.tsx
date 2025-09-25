import { useState, ReactNode } from 'react'

export default function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`dapps-accordion ${open ? 'is-open' : ''}`}>
      <button
        className="dapps-accordion__head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="dapps-accordion__title">{title}</span>
        <span className="dapps-accordion__icon">{open ? '▾' : '▸'}</span>
      </button>

      {open && <div className="dapps-accordion__body">{children}</div>}
    </div>
  )
}
