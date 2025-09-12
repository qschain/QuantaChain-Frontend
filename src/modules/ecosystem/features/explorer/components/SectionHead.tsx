export default function SectionHead({ title, to }:{ title:string; to:string }) {
    return (
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <div style={{ fontWeight:800 }}>{title}</div>
            <a href={to} className="secondary">查看全部</a>
        </div>
    );
}
