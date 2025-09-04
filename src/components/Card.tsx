export default function Card({ title, right, children }:{title?: React.ReactNode; right?:React.ReactNode; children:React.ReactNode}) {
    return (
        <div className="card">
            {(title || right) && <div className="row space-between mb-4">
                <h3 style={{margin:0}}>{title}</h3>
                <div>{right}</div>
            </div>}
            {children}
        </div>
    )
}
