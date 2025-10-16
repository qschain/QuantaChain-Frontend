import React, { useMemo, useState } from 'react';

type Props = {
    page: number;
    pages: number;
    onChange: (p: number) => void;
};

export default function ExPagination({ page, pages, onChange }: Props) {
    const [jump, setJump] = useState<number>(page);

    const numbers = useMemo(() => {
        const knownTotal = Number.isFinite(pages) && pages < 999;
        if (!knownTotal) return [page];
        const range: number[] = [];
        const start = Math.max(1, page - 1);
        const end = Math.min(pages, page + 1);
        for (let i = start; i <= end; i++) range.push(i);
        if (start > 1) range.unshift(1);
        if (end < pages) range.push(pages);
        return Array.from(new Set(range)).sort((a, b) => a - b);
    }, [page, pages]);

    const goto = (p: number) => {
        const knownTotal = Number.isFinite(pages) && pages < 999;
        const maxP = knownTotal ? pages : Math.max(1, p);
        const np = Math.max(1, Math.min(maxP, p));
        if (np !== page) onChange(np);
    };

    return (
        <div className="ex-pagination">
            <button
                className={`ex-pagination-btn ${page <= 1 ? 'is-disabled' : ''}`}
                onClick={() => goto(page - 1)}
                disabled={page <= 1}
            >
                上一页
            </button>

            {numbers.map((n) => (
                <button
                    key={n}
                    className={`ex-pagination-btn ${n === page ? 'is-active' : ''}`}
                    onClick={() => goto(n)}
                >
                    {n}
                </button>
            ))}

            <button
                className="ex-pagination-btn"
                onClick={() => goto(page + 1)}
            >
                下一页
            </button>

            <span className="ex-pagination-text">跳转到</span>
            <input
                className="ex-pagination-input"
                type="number"
                min={1}
                max={Number.isFinite(pages) ? pages : undefined}
                value={jump}
                onChange={(e) => setJump(Number(e.target.value || 1))}
                onKeyDown={(e) => e.key === 'Enter' && goto(jump)}
                onBlur={() => goto(jump)}
            />
            <span className="ex-pagination-text">页</span>
        </div>
    );
}
