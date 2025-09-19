import React from 'react';
import type { Dapp } from '../api/dappApi';

export default function RankPanel({ title, items, limit = 4 }:{
    title: string; items: Dapp[]; limit?: number;
}) {
    return (
        <div className="rank-panel">
            <div className="rank-head">{title}</div>
            <ul className="rank-list">
                {items.slice(0, limit).map((d, idx) => (
                    <li key={d.id} className="rank-item">
                        <span className="rk">{idx + 1}</span>
                        <span className="logo">{(d.name || 'DP').slice(0, 2).toUpperCase()}</span>
                        <div className="info">
                            <div className="name">{d.name}</div>
                            <div className="sub">{d.category}</div>
                        </div>
                        <div className="val">{d.kpiDisplay ?? d.volume24hDisplay ?? d.users24hDisplay ?? '—'}</div>
                        <div className="chg up"> </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
