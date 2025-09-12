export default function Sparkline({ values }:{ values:number[] }) {
    // 简洁占位折线：按比例绘制矩形条（比纯线更接近你图里的“柱条感”）
    const arr = values.length ? values : [8,14,10,16,9,12,18,11,13,9,15]
    const max = Math.max(...arr, 1)
    return (
        <div style={{
            height:250, display:'grid', gridAutoFlow:'column', gap:8,
            alignItems:'end', background:'linear-gradient(0deg,#0b0e1100,#0b0e111a)',
            padding:'8px 6px', borderRadius:10, border:'1px solid var(--border)'
        }}>
            {arr.map((v,i)=>(
                <div key={i} style={{
                    height:`${(v/max)*100}%`,
                    background:'linear-gradient(180deg,#2ea6ff88,#2ea6ff22)',
                    border:'1px solid #2ea6ff55', borderRadius:6, width:10
                }}/>
            ))}
        </div>
    )
}
