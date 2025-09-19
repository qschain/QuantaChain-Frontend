import { useTranslation } from 'react-i18next';

export default function LearnPage() {
    const { t } = useTranslation('sr');

    return (
        <div className="sr-page">
            <header className="sr-header">
                <h1 className="title-neon">{t('learn.title')}</h1>
                <p className="desc">{t('learn.subtitle')}</p>
            </header>

            <div className="tabs">
                <div className="chip">新手入门</div>
                <div className="chip">进阶指南</div>
                <div className="chip">术语表</div>
                <div className="chip">实践案例</div>
                <div className="chip">问答机器人</div>
            </div>

            <div className="col gap-12">
                <Accordion title="SR基础概念" desc="了解SR的角色与职责，以及保障网络安全和去中心化的重要性。" />
                <Accordion title="如何参与投票" desc="质押 TRX 获得投票权（TP），完成 SR 投票流程。" />
                <Accordion title="奖励领取指南" desc="奖励计算方式、发放周期与领取方法。" />
            </div>
        </div>
    );
}

function Accordion({ title, desc }:{title:string; desc:string}) {
    return (
        <div className="card">
            <div className="card__title">{title}</div>
            <div className="muted">{desc}</div>
            <a className="link" href="#">{'了解更多 →'}</a>
        </div>
    );
}
