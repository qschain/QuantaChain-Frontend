import React from 'react';

export default function SectionHeader({
                                          title, sub, right,
                                      }: { title: string; sub?: string; right?: React.ReactNode }) {
    return (
        <div className="section-hd">
            <div className="lhs">
                <div className="h1">{title}</div>
                {sub && <div className="sub">{sub}</div>}
            </div>
            {right && <div className="rhs">{right}</div>}
        </div>
    );
}
