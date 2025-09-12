export default function Value({ amount, currency='TRX', usd }:{ amount:number|string; currency?:string; usd?:number }){
    const a = typeof amount==='string'? Number(amount):amount;
    return (
        <span>
      {a.toLocaleString(undefined,{ maximumFractionDigits:6 })} {currency}
            {usd!=null && <span style={{ opacity:.7 }}> · ${usd.toLocaleString()}</span>}
    </span>
    );
}
