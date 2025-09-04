import React from 'react';

export type TabItem = { key: string; label: string };

export default function Tabs({
                                 items,
                                 value,
                                 onChange,
                             }: {
    items: TabItem[];
    value: string;
    onChange: (key: string) => void;
}) {
    return (
        <div
            style={{
                display: 'inline-flex',
                gap: 8,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                padding: 6,
                borderRadius: 999,
            }}
            role="tablist"
        >
            {items.map((it) => {
                const active = it.key === value;
                return (
                    <button
                        key={it.key}
                        role="tab"
                        aria-selected={active}
                        className="btn ghost"
                        onClick={() => onChange(it.key)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 999,
                            background: active ? '#ffffff12' : 'transparent',
                            border: 'none',
                            color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                        }}
                    >
                        {it.label}
                    </button>
                );
            })}
        </div>
    );
}
