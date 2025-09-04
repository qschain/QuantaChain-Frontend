export default function Donut({ data }:{ data:{label:string; value:number; color:string}[] }) {
    const items = data.length ? data : [
        { label:'Bitcoin (BTC)', value:70, color:'#41bdf7' },
        { label:'Ethereum (ETH)', value:30, color:'#19c37d' },
    ]
    const total = items.reduce((s,i)=>s+i.value,0)
    let acc = 0
    const segments = items.map(i=>{
        const start = (acc/total)*360; acc += i.value
        const end = (acc/total)*360
        return { start, end, color:i.color }
    })
    return (
        <div style={{width:260, height:260, borderRadius:'50%', position:'relative'}}>
            <svg viewBox="0 0 36 36" style={{transform:'rotate(-90deg)'}}>
                {segments.map((s,idx)=>{
                    const r=16, cx=18, cy=18
                    const start = polar(cx,cy,r,s.start), end = polar(cx,cy,r,s.end)
                    const large = s.end - s.start > 180 ? 1 : 0
                    const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`
                    return <path key={idx} d={d} fill={s.color} opacity={.85}/>
                })}
            </svg>
            <div style={{
                position:'absolute', inset:0, display:'grid', placeItems:'center',
                borderRadius:'50%', background:'radial-gradient(circle at center, transparent 52%, var(--bg-elevated) 53%)'
            }}>
                <div style={{textAlign:'center'}}>
                    <div className="secondary" style={{fontSize:12}}>总价值</div>
                    <div style={{fontSize:22, fontWeight:800}}>$127K</div>
                </div>
            </div>
        </div>
    )
}
function polar(cx:number, cy:number, r:number, deg:number){
    const rad = (deg*Math.PI)/180
    return { x: cx + r*Math.cos(rad), y: cy + r*Math.sin(rad) }
}
