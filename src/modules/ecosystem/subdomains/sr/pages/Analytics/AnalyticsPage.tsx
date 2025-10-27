import { useTranslation } from 'react-i18next';
import {useSession} from "../../../../../../app/session/PlatformSessionProvider";
import {useNavigate} from "react-router-dom";
import useAccountSummary from "../../hooks/useAccountSummary";
import useWitnessOverview from "../../hooks/useWitnessOverview";
import PieDonut from "../../components/analystic/PieDonut";
import ProposalPreviewSkeleton from "../../components/proposals/ProposalPreviewSkeleton";

export default function AnalyticsPage() {
    const { t } = useTranslation('sr')
    const { user } = useSession()
    const navigate = useNavigate()

    // 账户摘要仍保留（你有待领取奖励等用处）
    const { loading: accLoading, error: accError, voteTotal, pendingTRX } = useAccountSummary(user?.name)

    // ✅ 新 witness 概览（前 27 个）
    const {
        loading: wLoading,
        error: wError,
        sumVotes,
        freezeRatePct,
        avgApyPct,
        top10,
        othersPct,
        segments,
    } = useWitnessOverview()

    const toVote = () => navigate('/ecosystem/sr/vote')
    const toRewards = () => navigate('/ecosystem/sr/rewards')

    // @ts-ignore
    return (
        <div className="sr-page">
            <header className="sr-header">
                <h1 className="sr-title-neon">{t('dashboard.title')}</h1>
                <p className="sr-desc">{t('dashboard.subtitle')}</p>
            </header>

            {(accError || wError) ? (
                <div className="sr-badge danger" style={{ marginBottom: 12 }}>
                    {accError || wError}
                </div>
            ) : null}

            {/* 顶部三卡片 —— 来自 witness 概览 */}
            <section className="sr-auto-grid lg">
                <StatCard
                    title={t('analytics.kpi.totalVotes')}
                    value={wLoading ? undefined : (sumVotes || 0).toLocaleString()}
                    // action={t('dashboard.actions.viewDetails')}
                    // onAction={toVote}
                    loading={wLoading}
                />
                <StatCard
                    title={t('analytics.kpi.totalStakeRate')}
                    value={wLoading ? undefined : freezeRatePct}
                    // action={t('dashboard.actions.viewIncome')}
                    // onAction={toRewards}
                    loading={wLoading}
                />
                <StatCard
                    title={t('analytics.kpi.avgApy')}
                    value={wLoading ? undefined : avgApyPct}
                    // action={t('dashboard.actions.claimNow')}
                    // onAction={toRewards}
                    loading={wLoading}
                />
            </section>

            {/* 投票权分布 & 排名前列 SR */}
            <section className="sr-panel">
                <div className="sr-panel__title">{t('analytics.distribution.title')}</div>
                <div className="sr-row sr-gap-16">
                    <div className="sr-card sr-flex-1">
                        {wLoading ? (
                            <div className="sr-skeleton" style={{ height: 240 }}>
                                <div className="sr-skel-line" style={{ height: 240 }} />
                            </div>
                        ) : (
                            <PieDonut segments={segments} size={260} hole={80} showCenter />
                        )}
                    </div>

                    <div className="sr-card" style={{ width: 360 }}>
                        <div className="sr-card__title">{t('analytics.distribution.ranking')}</div>
                        {wLoading ? (
                            <div className="sr-skeleton" style={{ marginTop: 8 }}>
                                <div className="sr-skel-line" style={{ height: 16, margin: '8px 0' }} />
                                <div className="sr-skel-line" style={{ height: 16, margin: '8px 0' }} />
                                <div className="sr-skel-line" style={{ height: 16, margin: '8px 0' }} />
                            </div>
                        ) : (
                            <ul style={{ margin: '8px 0 0 14px', lineHeight: 1.9, color: 'var(--sr-text)' }}>
                                {top10.map((r, i) => (
                                    <li key={i}>{r.name} — {r.pct.toFixed(1)}%</li>
                                ))}
                                {othersPct > 0 ? <li>Others — {othersPct.toFixed(1)}%</li> : null}
                            </ul>
                        )}
                    </div>
                </div>
            </section>

            {/* 网络状态（仍占位） */}
            {/*<section className="sr-panel">*/}
            {/*    <div className="sr-panel__head">*/}
            {/*        <div className="sr-panel__title">{t('dashboard.network.title')}</div>*/}
            {/*    </div>*/}
            {/*    <div className="sr-auto-grid sm">*/}
            {/*        <MetricCard label={t('dashboard.network.activeSr')} value="27" />*/}
            {/*        <MetricCard label={t('dashboard.network.blockRate')} value="98.7%" />*/}
            {/*        <MetricCard label={t('dashboard.network.blockHeight')} value="#47,893" />*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/*/!* 提案概览（保留你原来的） *!/*/}
            {/*<section className="sr-panel">*/}
            {/*    <div className="sr-panel__head">*/}
            {/*        <div className="sr-panel__title">{t('dashboard.proposalsOverview.title')}</div>*/}
            {/*        <a className="sr-link" onClick={() => navigate('/ecosystem/sr/proposals')}>{t('proposals.title')} →</a>*/}
            {/*    </div>*/}

            {/*    /!* 你的 proposals hook 逻辑不变 *!/*/}
            {/*    <ProposalPreviewSkeleton />/!* 可按你的 loading 逻辑替换 *!/*/}
            {/*</section>*/}

            {/* 活动（示例，保留） */}
            {/*<section className="sr-panel">*/}
            {/*    <div className="sr-panel__head">*/}
            {/*        <div className="sr-panel__title">{t('dashboard.activity.title')}</div>*/}
            {/*    </div>*/}
            {/*    <div className="sr-timeline">*/}
            {/*        <Node t={t('toast.voteSuccess')} sub={`${t('nav.vote')} · ${voteTotal.toLocaleString()} votes`} />*/}
            {/*        <Node t={t('rewards.title')} sub={`${t('dashboard.cards.toClaim.title')} · ${pendingTRX.toLocaleString(undefined, { maximumFractionDigits: 6 })} TRX`} />*/}
            {/*        <Node t="System" sub="New proposal published" />*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* 新闻（示例，保留） */}
            <section className="sr-panel">
                <div className="sr-panel__head">
                    <div className="sr-panel__title">{t('dashboard.news.title')}</div>
                </div>
                {/*<div className="sr-auto-grid">*/}
                {/*    <NewsCard tag="公告" title="TRON 网络升级完成，性能提升 30%" />*/}
                {/*    <NewsCard tag="教程" title="如何优化您的 SR 投票策略" />*/}
                {/*</div>*/}
            </section>
        </div>
    )
}

function StatCard({
                      title,
                      value,
                      loading,
                      unit = '',
                  }: {
    title: string
    value?: string
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
        </div>
    )
}
