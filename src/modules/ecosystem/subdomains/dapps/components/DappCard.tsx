import React from 'react';
import type { Dapp } from '../api/dappApi';

export default function DappCard({ dapp }: { dapp: Dapp }) {
    return (
        <div className="dapp-card">
            <div className="logo">{(dapp.name || 'DP').slice(0, 2).toUpperCase()}</div>
            <div className="title">{dapp.name}</div>
            <div className="sub">{dapp.category}</div>
            <div className="metric">
                <span className="k">{dapp.metricLabel ?? '24h 交易量'}</span>
                <span className="v">{dapp.metricValue ?? dapp.volume24hDisplay ?? '—'}</span>
            </div>
        </div>
    );
}
