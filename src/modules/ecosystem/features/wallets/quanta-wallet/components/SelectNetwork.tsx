import { useEffect, useState } from 'react'
import type { BridgeNetwork } from '../../../../../../services/api'
import { listBridgeNetworks } from '../../../../../../services/api'

export default function SelectNetwork({
                                          value,
                                          onChange,
                                          placeholder='选择网络'
                                      }:{
    value?: string
    onChange: (id:string)=>void
    placeholder?: string
}) {
    const [open, setOpen] = useState(false)
    const [list, setList] = useState<BridgeNetwork[]>([])
    useEffect(()=>{ listBridgeNetworks().then(setList) },[])

    const current = list.find(n=>n.id===value)

    return (
        <div style={{position:'relative'}}>
            <button className="input" style={{textAlign:'left'}} onClick={()=>setOpen(v=>!v)}>
                {current ? current.name : placeholder} <span style={{float:'right'}}>▾</span>
            </button>

            {open && (
                <div className="card" style={{
                    position:'absolute', zIndex:20, top:'110%', left:0, right:0,
                    maxHeight:280, overflow:'auto', background:'var(--bg-elevated)'
                }}>
                    {list.map(n=>(
                        <button key={n.id} className="btn ghost" style={{width:'100%', justifyContent:'flex-start'}}
                                onClick={()=>{ onChange(n.id); setOpen(false) }}>
                            {n.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
