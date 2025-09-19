import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StatCard from '../components/StatCard';
import Skeleton from '../components/Skeleton';
import { api } from '../shared/api/api';
import type { ChainOverview } from '../state/types';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#00e6ff', '#8fb4ff', '#ffd166', '#2dc78a', '#ff6b6b', '#c084fc'];

export default function ExplorerStats(){
    const { t } = useTranslation('explorer');
    const [ov,setOv] = useState<ChainOverview>();
    const [stats,setStats] = useState<any>();

    useEffect(()=>{
        api.getOverview().then(setOv);
        fetch('/api/explorer/stats').then(r=>r.json()).then(setStats);
    },[]);

    return (
        <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <h2 style={{ margin:0 }}>{t('stats.title')}</h2>
                <a href="/ecosystem/explorer" className="secondary">← {t('stats.back')}</a>
            </div>

            {!ov ? <Skeleton rows={1}/> : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                    <StatCard title="TPS" value={ov.tps.toLocaleString()} />
                    <StatCard title="Avg Block Time" value="~3s" />
                    <StatCard title="Active Validators" value={ov.validators.toLocaleString()} />
                </div>
            )}

            {/* 网络增长 */}
            <Panel title={t('stats.networkGrowth')}>
                <Chart placeholder={!stats}>
                    {stats && (
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={stats.accounts}>
                                <CartesianGrid strokeOpacity={.1} />
                                <XAxis dataKey="t" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="active" stroke={COLORS[0]} dot={false}/>
                                <Line type="monotone" dataKey="total"  stroke={COLORS[1]} dot={false}/>
                                <Legend />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </Chart>
            </Panel>

            {/* 交易活动 */}
            <Panel title={t('stats.txActivity')}>
                <Chart placeholder={!stats}>
                    {stats && (
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={stats.txs}>
                                <CartesianGrid strokeOpacity={.1} />
                                <XAxis dataKey="t" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="count" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={.2}/>
                                <Area type="monotone" dataKey="avgFee" stroke={COLORS[3]} fill={COLORS[3]} fillOpacity={.15}/>
                                <Legend />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </Chart>
            </Panel>

            {/* 代币生态总览：占比 + 热门对 */}
            <Panel title={t('stats.tokenOverview')}>
                <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', gap:16 }}>
                    <Chart placeholder={!stats}>
                        {stats && (
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie data={stats.tokenShare} dataKey="value" nameKey="name" outerRadius={100}>
                                        {stats.tokenShare.map((_:any, idx:number)=>(<Cell key={idx} fill={COLORS[idx % COLORS.length]} />))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </Chart>

                    <div className="card" style={{ padding:12 }}>
                        <table style={{ width:'100%', borderCollapse:'collapse' }}>
                            <thead>
                            <tr style={{ opacity:.8 }}>
                                <th style={{ textAlign:'left', padding:'8px' }}>Pair</th>
                                <th style={{ textAlign:'left', padding:'8px' }}>24h Volume</th>
                            </tr>
                            </thead>
                            <tbody>
                            {!stats ? <tr><td colSpan={2}><Skeleton rows={3}/></td></tr> : stats.topPairs.map((p:any,i:number)=>(
                                <tr key={i} style={{ borderTop:'1px solid #1d232a' }}>
                                    <td style={{ padding:'8px' }}>{p.pair}</td>
                                    <td style={{ padding:'8px' }}>${p.volume.toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Panel>

            {/* 超级代表分析（占位图） */}
            <Panel title={t('stats.srAnalysis')}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <Chart placeholder={!stats}>
                        {stats && (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={stats.voteWeight} dataKey="value" nameKey="sr" outerRadius={90}>
                                        {stats.voteWeight.map((_:any, idx:number)=>(<Cell key={idx} fill={COLORS[idx % COLORS.length]} />))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </Chart>
                    <Chart placeholder={!stats}>
                        {stats && (
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={stats.staking}>
                                    <CartesianGrid strokeOpacity={.1} />
                                    <XAxis dataKey="t" /><YAxis /><Tooltip />
                                    <Line type="monotone" dataKey="rate" stroke={COLORS[5]} dot={false}/>
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </Chart>
                </div>
            </Panel>
        </div>
    );
}

function Panel({ title, children }:{ title:string; children:React.ReactNode }){
    return (
        <div className="card" style={{ padding:16, marginBottom:16 }}>
            <div style={{ fontWeight:800, marginBottom:10 }}>{title}</div>
            {children}
        </div>
    );
}
function Chart({ children, placeholder }:{ children:React.ReactNode; placeholder:boolean }){
    if (placeholder) return <div style={{ height:240 }}><Skeleton rows={6}/></div>;
    return <>{children}</>;
}
