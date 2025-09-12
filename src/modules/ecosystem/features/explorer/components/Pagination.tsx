export default function Pagination({ page, pages, onChange }:{ page:number; pages:number; onChange:(p:number)=>void }){
    return (
        <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:12 }}>
            <button disabled={page<=1} onClick={()=>onChange(page-1)}>{'«'}</button>
            {Array.from({length:pages}).slice(0,5).map((_,i)=> {
                const p = i+1;
                return <button key={p} onClick={()=>onChange(p)} style={{ fontWeight: p===page?800:400 }}>{p}</button>;
            })}
            <button disabled={page>=pages} onClick={()=>onChange(page+1)}>{'»'}</button>
        </div>
    );
}
