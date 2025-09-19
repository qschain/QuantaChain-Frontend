export default function QRCodePlaceholder({ text='0x1234...kLmN' }:{text?:string}) {
    return (
        <div className="card" style={{width:240, height:260, display:'grid', placeItems:'center', background:'#fff', color:'#111'}}>
            {text}
        </div>
    )
}
