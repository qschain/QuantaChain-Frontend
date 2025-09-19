import { API_SR_BASE } from '../../constants';
import type { Page, SrItem, RewardRecord, Proposal } from '../../types';

async function json<T>(r: Response) { if (!r.ok) throw new Error(r.statusText); return r.json() as Promise<T>; }

export const srApi = {
    getDashboard: () => fetch(`${API_SR_BASE}/dashboard`).then(json<any>),
    listSR: (q?: Record<string, any>) => fetch(`${API_SR_BASE}/list`).then(json<Page<SrItem>>),
    vote:  (payload: any) => fetch(`${API_SR_BASE}/vote`, { method:'POST', body: JSON.stringify(payload) }),
    batchVote: (payload: any) => fetch(`${API_SR_BASE}/vote/batch`, { method:'POST', body: JSON.stringify(payload) }),

    getRewardsSummary: () => fetch(`${API_SR_BASE}/rewards/summary`).then(json<any>),
    getRewardsHistory: () => fetch(`${API_SR_BASE}/rewards/history`).then(json<Page<RewardRecord>>),
    claimRewards: (payload:any) => fetch(`${API_SR_BASE}/rewards/claim`, { method:'POST', body: JSON.stringify(payload) }),

    listProposals: () => fetch(`${API_SR_BASE}/proposals`).then(json<Page<Proposal>>),

    getAnalyticsOverview: () => fetch(`${API_SR_BASE}/analytics/overview`).then(json<any>),
    getAnalyticsDistribution: () => fetch(`${API_SR_BASE}/analytics/distribution`).then(json<any>),
    getAnalyticsTrends: () => fetch(`${API_SR_BASE}/analytics/trends`).then(json<any>),

    getLearn: () => fetch(`${API_SR_BASE}/learn`).then(json<any>)
};
