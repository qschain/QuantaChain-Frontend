
import { useMemo } from 'react';
import { useNodes } from '../../model/atlas/NodesStore';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
    LabelList, CartesianGrid
} from 'recharts';

type Row = { name: string; value: number };

export default function NodesRankingSectionCompact({
                                                       topN = 15,
                                                       height = 520,      // 一屏高度，可按页面调
                                                   }: { topN?: number; height?: number }) {
    const { counts } = useNodes();

    const theme = {
        axis: getVar('--muted', '#8a97a6'),
        bar:  getVar('--primary', '#75e6d5'),
        grid: getVar('--line', '#1c2530'),
        card: getVar('--bg-panel', '#0f1318'),
        text: getVar('--text', '#d8e1ea'),
    };

    const data = useMemo<Row[]>(() => {
        const list = Object.entries(counts).map(([k, v]) => ({ name: k, value: v || 0 }));
        list.sort((a,b)=> b.value - a.value);
        const head = list.slice(0, topN);
        const rest = list.slice(topN);
        const others = rest.reduce((s,x)=> s + x.value, 0);
        return others > 0 ? [...head, { name: 'Others', value: others }] : head;
    }, [counts, topN]);

    // 左轴宽度：动态按最长名称估算，避免溢出 & 无需横向滚动
    const yWidth = Math.min(180, Math.max(80, longestLabelPx(data, 11) + 16));

    return (
        <section id="nodes-ranking" style={{ padding: '16px 12px' }}>
            <h2 style={{ margin: 0 }}>Nodes Ranking</h2>
            <div style={{ color: theme.axis, margin: '4px 0 10px' }}>Ranked by country and region</div>

            <div style={{
                height,
                borderRadius: 16,
                border: `1px solid ${theme.grid}`,
                background: theme.card,
                padding: 8
            }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 8, right: 18, bottom: 8, left: 8 }}
                    >
                        <CartesianGrid horizontal stroke={theme.grid} strokeDasharray="3 6" />
                        <XAxis
                            type="number"
                            tick={{ fill: theme.axis, fontSize: 11 }}
                            axisLine={{ stroke: theme.grid }}
                            tickLine={{ stroke: theme.grid }}
                            // 紧凑一点的 domain，给右侧数值留位
                            domain={[0, (max) => Math.ceil((Number(max) || 0) * 1.05)]}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={yWidth}
                            tick={{ fill: theme.axis, fontSize: 12 }}
                            axisLine={{ stroke: theme.grid }}
                            tickLine={{ stroke: theme.grid }}
                            tickFormatter={(v) => ellipsis(v, 18)}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                            contentStyle={{
                                background: theme.card,
                                border: `1px solid ${theme.grid}`,
                                borderRadius: 12,
                                color: theme.text
                            }}
                        />
                        <Bar dataKey="value" fill={theme.bar} radius={[8,8,8,8]} barSize={14}>
                            <LabelList dataKey="value" position="right" fill={theme.axis} fontSize={11}/>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}

/* -------- utils -------- */
function getVar(name: string, fallback: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(name)?.trim() || fallback;
}
function ellipsis(s: string, n = 16) {
    if (!s) return '';
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
// 粗略估算中文/英文像素宽度（用于 Y 轴宽度）
function longestLabelPx(data: {name:string}[], fontSize = 12) {
    const avg = fontSize * 0.62; // 英文
    const avgCJK = fontSize * 0.9; // 中文偏宽
    return data.reduce((m, d) => {
        const s = d.name || '';
        const w = [...s].reduce((sum, ch) => {
            const isCJK = /[\u4e00-\u9fa5]/.test(ch);
            return sum + (isCJK ? avgCJK : avg);
        }, 0);
        return Math.max(m, w);
    }, 0);
}
