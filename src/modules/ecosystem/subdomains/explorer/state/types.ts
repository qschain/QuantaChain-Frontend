export type ChainOverview = {
    tps:number; height:number; validators:number; priceUSD:number;
};

export type BlockLite = {
    height:number; hash:string; time:string; txCount:number; miner?:string;
};

export type TxLite = {
    hash:string; time:string; from:string; to?:string;
    value:string; fee:string; status:'success'|'failed'|'pending'; blockHeight?:number; method?:string;
};

export type BlockDetail = BlockLite & {
    size?:number; parentHash?:string; gasUsed?:string; gasLimit?:string;
    transactions: TxLite[];
};

export type TxDetail = {
    code:string,
    meessage:string,
    data:{
        "blockNum": string
        "time": string
        "ownerAddress":string
        "toAddress":string
        "contractType":string
        "contractDescribe":string
        "amount":string
        "fee":string
        "status": string
        "hash":string
    }
};

export type TokenLite = { rank:number; symbol:string; name:string; price:number; change24h:number; marketcap:number; volume24h:number };
