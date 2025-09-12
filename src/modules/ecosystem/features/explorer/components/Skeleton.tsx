export default function Skeleton({ rows=5 }:{ rows?:number }){
    return (
        <div className="skeleton">
            {Array.from({length:rows}).map((_,i)=>(
                <div key={i} style={{ height:22, background:'#1a2027', borderRadius:6, margin:'10px 0', opacity:.6 }} />
            ))}
        </div>
    );
}
