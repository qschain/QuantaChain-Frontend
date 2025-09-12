export type Page<T> = { list: T[]; page: number; pageSize: number; total: number };
export type SrItem = { id: string; name: string; address: string; apy: number; voters: number; votes: number; onlineRate: number };
export type RewardRecord = { time: string; srName: string; amount: number; status: 'claimed'|'pending'; txid?: string };
export type Proposal = { id: string; title: string; status: string; supportPct: number; againstPct: number; author?: string; start?: string; end?: string };
