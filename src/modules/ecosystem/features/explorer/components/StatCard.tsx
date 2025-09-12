export default function StatCard({ title, value, right }:{ title:string; value:React.ReactNode; right?:React.ReactNode }){
    return (
        <div className="card" style={{ padding:18, borderRadius:14, background:'#14161a', border:'1px solid #20252c' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <div style={{ opacity:.8 }}>{title}</div>
                {right}
            </div>
            <div style={{ fontSize:24, fontWeight:800 }}>{value}</div>
        </div>
    );
}
