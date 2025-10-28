import useSrInit from '../../hooks/useSrInit'
import { useTranslation } from 'react-i18next';
import {useSession} from "../../../../../../app/session/PlatformSessionProvider";
import {useNavigate} from "react-router-dom";
import useAccountSummary from "../../hooks/useAccountSummary";
import ProposalPreview from "../../components/proposals/ProposalPreview";
import ProposalPreviewSkeleton from "../../components/proposals/ProposalPreviewSkeleton";
import useProposals from "../../hooks/useProposals";
import React, {useEffect, useState} from "react";
// ✅ 新增：从 sr store 取汇总（sumVotes、nextTime）
import {SrProvider, useSr} from '../../state/store';

import TronPulseCoreRing from "../../components/dashboard/countdown/TronPulseCoreRing";


 function Content() {
    const { t } = useTranslation('sr')
    const { user } = useSession()
    const navigate = useNavigate()

    const { loading, error, voteTotal, pendingTRX } = useAccountSummary(user?.name)
    const { loading: pLoading, error: pError, list: proposals, refresh: refreshP } = useProposals(2)
    const toVote = () => navigate('/ecosystem/sr/vote')
    const toRewards = () => navigate('/ecosystem/sr/rewards')

    // ✅ 新增：读取 sumVotes / nextTime，并计算倒计时
    const { state } = useSrInit()
    const sumVotes = state.sumVotes
    const nextTime = state.nextTime
    const left = useCountdown(nextTime)

     // 🔥 新增：检查网络数据是否已加载
     const networkDataLoading = state.pageLoading || sumVotes === 0
     // 🔥 检查 nextTime 是否有效
     const hasValidNextTime = nextTime && nextTime.trim() !== ''
    return (
        <div className="sr-page">
            <header className="sr-header">
                <h1 className="sr-title-neon">{t('dashboard.title')}</h1>
                <p className="sr-desc">{t('dashboard.subtitle')}</p>
            </header>

            {error ? <div className="sr-badge danger" style={{ marginBottom: 12 }}>{error}</div> : null}

            {/* 顶部三卡片 */}
            <section className="sr-auto-grid lg">
                <StatCard
                    title={t('dashboard.cards.myVotes.title')}
                    value={loading ? undefined : voteTotal.toLocaleString()}
                    action={t('dashboard.actions.viewDetails')}
                    onAction={toVote}
                    loading={loading}
                />
                <StatCard
                    title={t('dashboard.cards.estIncome.title')}
                    value={loading ? undefined : '—'}
                    action={t('dashboard.actions.viewIncome')}
                    onAction={toRewards}
                    loading={loading}
                />
                <StatCard
                    title={t('dashboard.cards.toClaim.title')}
                    value={loading ? undefined : pendingTRX.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    unit=" TRX"
                    action={t('dashboard.actions.claimNow')}
                    onAction={toRewards}
                    loading={loading}
                />
            </section>

            {/* 网络状态 */}
            <section className="sr-panel">
                <div className="sr-panel__head">
                    <div className="sr-panel__title">{t('dashboard.network.title')}</div>
                </div>
                <div className="sr-auto-grid sm">
                    {/* 1. 不变 */}
                    <StatCard title={t('dashboard.network.activeSr')} value="27" loading={false} action={""}/>
                    {/* 2. 总投票数 - 添加 loading 状态 */}
                    <StatCard
                        title={t('analytics.kpi.totalVotes')}
                        value={nf(sumVotes)}
                        loading={networkDataLoading}
                        action={""}
                    />
                    {/* 3. 倒计时 - 添加条件渲染 */}
                    <div className="sr-card sr-card-neon" style={{ display:'grid', placeItems:'center' }}>
                        <div className="sr-card__title">{t('dashboard.network.blockHeight')}</div>
                        {!hasValidNextTime ? (
                            <div className="sr-skeleton" style={{ margin: '12px 0' }}>
                                <div className="sr-skel-line" style={{ height: 80, width: 80, borderRadius: '50%' }} />
                            </div>
                        ) : (
                            <TronPulseCoreRing nextTime={nextTime} />
                        )}
                    </div>
                </div>
            </section>

            {/* 趋势图（占位） */}
            {/*<section className="sr-panel">*/}
            {/*    <div className="sr-panel__head">*/}
            {/*        <div className="sr-panel__title">{t('dashboard.trend.title')}</div>*/}
            {/*        <div className="sr-row sr-gap-8">*/}
            {/*            <button className="sr-btn ghost">24h</button>*/}
            {/*            <button className="sr-btn ghost">7d</button>*/}
            {/*            <button className="sr-btn ghost">30d</button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="sr-card" style={{height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--sr-muted)'}}>*/}
            {/*        {t('common.chartPlaceholder')}*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* 提案概览（示例） */}
            <section className="sr-panel">
                <div className="sr-panel__head">
                    <div className="sr-panel__title">{t('dashboard.proposalsOverview.title')}</div>
                    <a className="sr-link" onClick={() => navigate('/ecosystem/sr/proposals')}>{t('proposals.title')} →</a>
                </div>

                {pError ? <div className="sr-badge danger" style={{ marginBottom: 12 }}>{pError}</div> : null}

                <div className="sr-auto-grid">
                    {pLoading
                        ? [0,1].map(i => <ProposalPreviewSkeleton key={i} />)
                        : proposals.map(p => (
                            <ProposalPreview
                                key={p.number}
                                p={p}
                                t={t}
                                interactive={false}
                                hideDetailButton={true}
                            />
                        ))}
                </div>
            </section>

            {/* 活动（示例） */}
            <section className="sr-panel">
                <div className="sr-panel__head">
                    <div className="sr-panel__title">{t('dashboard.activity.title')}</div>
                </div>
                <div className="sr-timeline">
                    <Node t={t('toast.voteSuccess')} sub={`${t('nav.vote')} · ${voteTotal.toLocaleString()} votes`} />
                    <Node t={t('rewards.title')} sub={`${t('dashboard.cards.toClaim.title')} · ${pendingTRX.toLocaleString(undefined, { maximumFractionDigits: 6 })} TRX`} />
                    <Node t="System" sub="New proposal published" />
                </div>
            </section>

            {/* 新闻（示例） */}
            <section className="sr-panel">
                <div className="sr-panel__head">
                    <div className="sr-panel__title">{t('dashboard.news.title')}</div>
                </div>
                <div className="sr-auto-grid">
                    <NewsCard tag="公告" title="TRON 网络升级完成，性能提升 30%" />
                    <NewsCard tag="教程" title="如何优化您的 SR 投票策略" />
                </div>
            </section>
        </div>
    )
}

/* ------- 子组件（保持原样式接口） ------- */

function StatCard({
                      title,
                      value,
                      action,
                      onAction,
                      loading,
                      unit = '',
                  }: {
    title: string
    value?: string
    action: string
    onAction?: () => void
    loading?: boolean
    unit?: string
}) {
    return (
        <div className="sr-card sr-card-neon">
            <div className="sr-card__title">{title}</div>
            {loading ? (
                <div className="sr-skeleton" style={{ margin: '6px 0 12px' }}>
                    <div className="sr-skel-line" style={{ height: 32, width: '60%' }} />
                </div>
            ) : (
                <div className="sr-number-big">{value ?? '—'}{value ? unit : ''}</div>
            )}
            <button className="sr-btn" onClick={onAction}>{action}</button>
        </div>
    )
}


function ProposalStrip({ status = 'running' }: { status?: 'running' | 'pending' }) {
    return (
        <div className="sr-card">
            <div className="sr-row sr-space-between" style={{ marginBottom: 8 }}>
                <div className="sr-muted">#2025-0904-001</div>
                <span className={'sr-badge ' + (status === 'running' ? 'success' : '')}>
          {status === 'running' ? '进行中' : '等待中'}
        </span>
            </div>
            <div className="sr-card__title">提案：网络拥塞优化</div>
            <div className="sr-progress">
                <div className="sr-progress__bar" style={{ width: status === 'running' ? '73%' : '45%' }} />
            </div>
            <div className="sr-row sr-gap-8">
                <button className="sr-btn primary">支持</button>
                <button className="sr-btn ghost">反对</button>
            </div>
        </div>
    )
}

function Node({ t, sub }: { t: string; sub: string }) {
    return (
        <div className="sr-node">
            <div className="sr-node__dot" />
            <div className="sr-node__body">
                <div className="sr-node__title">{t}</div>
                <div className="sr-muted">{sub}</div>
            </div>
        </div>
    )
}

function NewsCard({ tag, title }: { tag: string; title: string }) {
    return (
        <div className="sr-card">
            <div className="sr-badge">{tag}</div>
            <div className="sr-card__title" style={{ marginTop: 8 }}>{title}</div>
            <div className="sr-muted">这是新闻摘要内容，用于展示列表中的简介文本…</div>
        </div>
    )
}

// —— 工具：千分位
function nf(n?: number) {
    const v = Number(n ?? 0)
    if (!Number.isFinite(v)) return '—'
    return v.toLocaleString()
}

// —— 工具：倒计时（nextTime: "YYYY-MM-DD HH:mm:ss"）
function useCountdown(nextTime?: string) {
    const [left, setLeft] = useState<string>('—')

    useEffect(() => {
        if (!nextTime) { setLeft('—'); return }
        // 兼容 Safari：把 '-' 替换成 '/' 再解析
        const target = Date.parse(String(nextTime).replace(/-/g, '/'))
        if (!Number.isFinite(target)) { setLeft('—'); return }

        const tick = () => {
            const diff = target - Date.now()
            if (diff <= 0) { setLeft('—'); return }
            const s = Math.floor(diff / 1000)
            const d = Math.floor(s / 86400)
            const h = Math.floor((s % 86400) / 3600)
            const m = Math.floor((s % 3600) / 60)
            const sec = s % 60
            setLeft(
                d > 0
                    ? `${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
                    : `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
            )
        }

        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [nextTime])

    return left
}
export default function DashboardPage() {
    return (
        <SrProvider>
            <Content />
        </SrProvider>
    )
}