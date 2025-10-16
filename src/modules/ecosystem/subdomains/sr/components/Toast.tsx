import {useEffect, useState} from "react";

export default function Toast({ message, onDone }: { message?: string; onDone?: () => void }) {
    const [show, setShow] = useState(!!message)
    useEffect(() => {
        if (!message) return
        setShow(true)
        const t = setTimeout(() => { setShow(false); onDone && onDone() }, 2200)
        return () => clearTimeout(t)
    }, [message])

    if (!show || !message) return null
    return (
        <div style={{
            position:'fixed', top:16, left:'50%', transform:'translateX(-50%)',
            background:'rgba(15,20,26,.96)', color:'#d8e1ea', border:'1px solid #1f2a37',
            padding:'10px 14px', borderRadius:12, zIndex:130, boxShadow:'0 8px 24px rgba(0,0,0,.35)'
        }}>
            {message}
        </div>
    )
}
