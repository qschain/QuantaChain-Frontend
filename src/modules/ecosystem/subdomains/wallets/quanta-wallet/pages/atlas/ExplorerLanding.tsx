import GlobePage from './GlobePage';
import NodesRankingSection from '../../components/atlas/NodesRankingSection';

export default function ExplorerLanding() {
    return (
        <div style={{ width:'100%', minHeight:'100vh', overflowY:'auto' }}>
            {/* 第一屏：地球 */}
            <GlobePage />
            {/* 第二屏：排名 */}
            <NodesRankingSection />
        </div>
    );
}
