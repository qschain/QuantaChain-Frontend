import { useState } from 'react';

export default function HashLink({ text, short=10, href }:{ text:string; short?:number; href?:string }){
    const [copied,setCopied]=useState(false);
    const s = text.length> short? `${text.slice(0,short)}…${text.slice(-4)}`:text;
    return (
        <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
      {href ? <a href={href} style={{ color:'#7dfcff', textDecoration:'none' }}>{s}</a> : <span style={{ color:'#7dfcff' }}>{s}</span>}
            <button onClick={()=>{ navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),1200); }} style={{ background:'transparent', border:'none', color:'#9db0c6', cursor:'pointer' }}>
        {copied ? '✓' : '⎘'}
      </button>
    </span>
    );
}
