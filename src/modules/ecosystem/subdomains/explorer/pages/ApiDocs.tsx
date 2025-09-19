import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Param = { name:string; type:string; required?:boolean; desc:string; example?:string };

const endpoint = '/api/explorer/address/info';

const params:Param[] = [
    { name:'address', type:'string', required:true,  desc:'TRON账户地址', example:'TRX9Uhjyx...K6GRQHWD' },
    { name:'visible', type:'boolean', required:false, desc:'是否返回可见格式', example:'true' }
];

export default function ApiDocs(){
    const { t } = useTranslation('explorer');
    const [addr,setAddr] = useState(params[0].example || '');
    const [visible,setVisible] = useState('true');
    const [resp,setResp] = useState<string>('');

    async function run(){
        const res = await fetch('/api/explorer/try', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ endpoint, address: addr, visible })
        }).then(r=>r.json());
        setResp(JSON.stringify(res, null, 2));
    }

    return (
        <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <h2 style={{ margin:0 }}>{t('api.title')}</h2>
                <a className="secondary" href="/ecosystem/explorer">← {t('api.backHome')}</a>
            </div>

            {/* 端点 */}
            <section className="card" style={{ padding:16, marginBottom:16 }}>
                <div style={{ fontWeight:800, marginBottom:6 }}>{t('api.endpoint')}</div>
                <div className="card" style={{ padding:'10px 12px', borderRadius:10, border:'1px dashed #28303a', background:'#0f1216' }}>
                    https://api.chainfusion.com/v1/account/info
                </div>
            </section>

            {/* 参数 */}
            <section className="card" style={{ padding:16, marginBottom:16 }}>
                <div style={{ fontWeight:800, marginBottom:6 }}>{t('api.params')}</div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead><tr style={{ opacity:.8 }}>
                        <th style={{ textAlign:'left', padding:'8px' }}>Name</th>
                        <th style={{ textAlign:'left', padding:'8px' }}>Type</th>
                        <th style={{ textAlign:'left', padding:'8px' }}>Required</th>
                        <th style={{ textAlign:'left', padding:'8px' }}>Desc</th>
                        <th style={{ textAlign:'left', padding:'8px' }}>Example</th>
                    </tr></thead>
                    <tbody>
                    {params.map(p=>(
                        <tr key={p.name} style={{ borderTop:'1px solid #1d232a' }}>
                            <td style={{ padding:'8px' }}>{p.name}</td>
                            <td style={{ padding:'8px' }}>{p.type}</td>
                            <td style={{ padding:'8px' }}>{p.required ? 'Yes' : 'No'}</td>
                            <td style={{ padding:'8px' }}>{p.desc}</td>
                            <td style={{ padding:'8px' }}>{p.example}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>

            {/* 交互式测试 */}
            <section className="card" style={{ padding:16 }}>
                <div style={{ fontWeight:800, marginBottom:10 }}>{t('api.tryIt')}</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <div className="card" style={{ padding:12 }}>
                        <div style={{ marginBottom:8 }}>
                            <div>address *</div>
                            <input value={addr} onChange={e=>setAddr(e.target.value)} style={inputStyle}/>
                        </div>
                        <div style={{ marginBottom:8 }}>
                            <div>visible</div>
                            <input value={visible} onChange={e=>setVisible(e.target.value)} style={inputStyle}/>
                        </div>
                        <button className="btn primary" onClick={run}>{t('api.run')}</button>
                    </div>
                    <div className="card" style={{ padding:12 }}>
                        <div style={{ fontWeight:800, marginBottom:8 }}>{t('api.response')}</div>
                        <pre style={{ margin:0, maxHeight:260, overflow:'auto' }}>{resp || '// 点击“执行测试”查看 API 响应结果'}</pre>
                    </div>
                </div>
            </section>
        </div>
    );
}
const inputStyle:React.CSSProperties = { width:'100%', padding:'10px 12px', borderRadius:10, background:'#101317', border:'1px solid #28303a', color:'#e8eef6' };
