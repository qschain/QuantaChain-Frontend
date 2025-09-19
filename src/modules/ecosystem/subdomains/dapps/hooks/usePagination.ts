import { useMemo, useState } from 'react';

export default function usePagination({pageSize=12}:{pageSize?:number}){
    const [page,setPage]=useState(1);
    const [total,setTotal]=useState(0);
    const pages = useMemo(()=>Math.max(1, Math.ceil(total/pageSize)),[total,pageSize]);
    return {
        page,pageSize,total,pages,
        setTotal,
        next:()=>setPage(p=>Math.min(pages, p+1)),
        prev:()=>setPage(p=>Math.max(1, p-1)),
        setPage
    };
}
