export default function AddressCopy({ value }:{ value: string }) {
    return (
        <div className="row">
            <input className="input" readOnly value={value}/>
            <button className="btn secondary" onClick={()=>navigator.clipboard.writeText(value)}>复制</button>
        </div>
    )
}
