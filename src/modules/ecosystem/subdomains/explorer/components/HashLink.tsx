import { useState } from "react";

export default function HashLink({
                                     text,
                                     short = 10,
                                     href,
                                     className,
                                 }: { text?: string; short?: number; href?: string; className?: string }) {
    const [copied, setCopied] = useState(false);
    const safe = text ?? '';
    const s = safe.length > short ? `${safe.slice(0, short)}…${safe.slice(-4)}` : safe;

    const baseStyle: React.CSSProperties = {
        color: '#7dfcff',
        textDecoration: 'none',
    };

    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {href ? (
          <a
              className={className}
              href={href}
              style={baseStyle}
              onClick={(e) => e.stopPropagation()}
          >
              {s}
          </a>
      ) : (
          <span className={className} style={baseStyle}>{s}</span>
      )}

            {safe && (
                <button
                    type="button"
                    onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigator.clipboard.writeText(safe);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                    }}
                    aria-label="Copy hash"
                    title="Copy"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#9db0c6',
                        cursor: 'pointer',
                    }}
                >
                    {copied ? '✓' : '⎘'}
                </button>
            )}
    </span>
    );
}
