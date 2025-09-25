import { useMemo } from 'react';
import { useNodes } from '../../model/atlas/NodesStore';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, CartesianGrid } from 'recharts';

type Row = { name: string; value: number };

export default function NodesRankingSection() {
    const { counts } = useNodes();

    const data = useMemo<Row[]>(() => {
        const list = Object.entries(counts).map(([k, v]) => ({ name: k, value: v || 0 }));
        // 你图里似乎把长尾聚合成 Others；这里给个简单版（前 18，其余求和为 Others）
        list.sort((a,b)=> b.value - a.value);
        const top = list.slice(0, 18);
        const restSum = list.slice(18).reduce((s, x)=> s + x.value, 0);
        return restSum > 0 ? [...top, { name: 'Others', value: restSum }] : top;
    }, [counts]);

    const axisColor = getComputedStyle(document.documentElement).getPropertyValue('--muted')?.trim() || '#8a97a6';
    const barColor  = getComputedStyle(document.documentElement).getPropertyValue('--primary')?.trim() || '#f54d4d';
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--line')?.trim()    || '#1c2530';

    return (
        <section style={{ padding: '24px 16px' }} id="nodes-ranking">
            <h2 style={{ margin: 0 }}>Nodes Ranking</h2>
            <div className="secondary" style={{ marginTop: 4, marginBottom: 12 }}>Ranked by country and region</div>

            <div className="card" style={{ height: 560 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 16, right: 24, bottom: 16, left: 120 }}
                    >
                        <CartesianGrid horizontal stroke={gridColor} strokeDasharray="3 6" />
                        <XAxis
                            type="number"
                            tick={{ fill: axisColor, fontSize: 12 }}
                            axisLine={{ stroke: gridColor }}
                            tickLine={{ stroke: gridColor }}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={120}
                            tick={{ fill: axisColor, fontSize: 12 }}
                            axisLine={{ stroke: gridColor }}
                            tickLine={{ stroke: gridColor }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                            contentStyle={{
                                background: getComputedStyle(document.documentElement).getPropertyValue('--bg-surface')?.trim() || '#0f1318',
                                border: `1px solid ${gridColor}`,
                                borderRadius: 12
                            }}
                        />
                        <Bar dataKey="value" fill={barColor} radius={[8,8,8,8]} barSize={14}>
                            <LabelList dataKey="value" position="right" fill={axisColor} fontSize={12}/>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
