import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SearchRedirect(){
    const nav = useNavigate();
    const q = new URLSearchParams(useLocation().search).get('q')?.trim()||'';
    useEffect(()=>{
        if(/^\d+$/.test(q)) return nav(`/ecosystem/explorer/block/${Number(q)}`,{replace:true});
        if(/^(0x)?[0-9a-fA-F]{64}$/.test(q)) return nav(`/ecosystem/explorer/tx/${q}`,{replace:true});
        // 可扩展地址/代币
        nav('/ecosystem/explorer',{ replace:true });
    },[q]);
    return null;
}
