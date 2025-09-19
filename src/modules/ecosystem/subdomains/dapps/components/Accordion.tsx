import { useState, ReactNode } from 'react';
export default function Accordion({title, children, defaultOpen=false}:{title:string;children:ReactNode;defaultOpen?:boolean}) {
    const [open,setOpen]=useState(defaultOpen);
    return (
        <div className="accordion">
            <button className="acc-head" onClick={()=>setOpen(v=>!v)}>
                <span>{title}</span><span>{open?'▾':'▸'}</span>
            </button>
            {open && <div className="acc-body">{children}</div>}
        </div>
    );
}
