import React from 'react';

type StatIcon = 'apps' | 'users' | 'tx24' | 'total';

export default function StatCard({
                                     label, value, delta, icon,
                                 }: { label: string; value: string; delta?: string; icon?: StatIcon }) {
    return (
        <div className="stat-card">
            <div className="stat-meta">
                <div className="label">{label}</div>
                <div className="value">{value}</div>
                {delta && <div className={`delta ${delta.startsWith('-') ? 'down' : 'up'}`}>{delta}</div>}
            </div>
            <span className={`stat-ic ${icon ?? ''}`} />
        </div>
    );
}
