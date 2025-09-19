import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useResolvedPath } from 'react-router-dom'
import { getAtlasPoints, type AtlasPoint } from '../../shared/api/atlas'
import { useElementSize } from '../../../../../../../shared/hooks/useElementSize'
import { useTranslation } from 'react-i18next'
// @ts-ignore
import Globe from 'react-globe.gl'

export default function GlobePage() {
    const [points, setPoints] = useState<AtlasPoint[]>([])
    const [autoRotate, setAutoRotate] = useState(true)
    const [panelOpen, setPanelOpen] = useState(true)
    const nav = useNavigate()
    const globeRef = useRef<any>(null)
    const { t } = useTranslation(['wallet'])

    useEffect(() => { getAtlasPoints().then(setPoints) }, [])

    // 读取主题色
    const colors = useMemo(() => ({
        point: getComputedStyle(document.documentElement).getPropertyValue('--accent')?.trim() || '#2d8cf0',
        grid:  getComputedStyle(document.documentElement).getPropertyValue('--border')?.trim() || '#2a2a2a'
    }), [])

    // 父容器尺寸（避免 100vw 溢出）
    const [wrapRef, size] = useElementSize<HTMLDivElement>()

    // 自转设置
    useEffect(() => {
        const g = globeRef.current
        if (!g) return
        const controls = g.controls()
        controls.autoRotate = autoRotate
        controls.autoRotateSpeed = 0.6
        controls.minDistance = 150
        controls.maxDistance = 1200
    }, [autoRotate])

    return (
        <div
            ref={wrapRef}
            style={{
                width: '100%',
                // 72 改成你导航条的实际高度（px）
                height: 'calc(100vh - 72px)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* 顶部操作 */}
            <div style={{position:'absolute', right:20, top:16, zIndex:5}} className="row">
                <button className="btn ghost" onClick={()=>setAutoRotate(a=>!a)}>
                    {autoRotate ? t('globe.pauseRotation') : t('globe.resumeRotation')}
                </button>
                <button className="btn ghost" onClick={()=>{
                    const g = globeRef.current; if (!g) return
                    g.pointOfView({ lat: 20, lng: 100, altitude: 2.5 }, 1200)
                }}>{t('globe.resetView')}</button>
            </div>

            {/* 可选地区（可折叠） */}
            <div style={{position:'absolute', right:20, top:64, width:300, zIndex:5}}>
                <div className="card" style={{padding:'10px 12px'}}>
                    <button
                        className="btn ghost"
                        style={{width:'100%', justifyContent:'space-between'}}
                        onClick={()=>setPanelOpen(o=>!o)}
                        aria-expanded={panelOpen}
                    >
                        <span className="secondary">{t('globe.selectRegions')}</span>
                        <span>{panelOpen ? '▾' : '▸'}</span>
                    </button>
                    <div
                        style={{
                            marginTop: panelOpen ? 10 : 0,
                            maxHeight: panelOpen ? 360 : 0,
                            overflow: 'auto',
                            transition: 'all .2s',
                            opacity: panelOpen ? 1 : 0,
                            pointerEvents: panelOpen ? 'auto' : 'none'
                        }}
                    >
                        {points.map(p=>(
                            <button key={p.id}
                                    className="btn ghost"
                                    style={{width:'100%', justifyContent:'flex-start', marginTop:6}}
                                    onClick={()=>nav(`${p.region}`)}
                            >
                                {/* 使用国际化名称（回退到原始 name） */}
                                {t(`region.name.${p.region}` as any) || p.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 让地球占满父容器 */}
            <Globe
                ref={globeRef}
                width={Math.floor(size.width)}
                height={Math.floor(size.height)}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
                showAtmosphere
                atmosphereColor={colors.point}
                atmosphereAltitude={0.25}
                showGraticules
                particlesColor={colors.grid}
                pointsData={points}
                pointAltitude={0.02}
                pointRadius={0.8}
                pointColor={() => colors.point}
                pointLabel={(o: any) => {
                    const d = o as AtlasPoint
                    return t(`region.name.${d.region}` as any) || d.name
                }}
                onPointClick={(o: any, _evt: MouseEvent, _coords: { lat: number; lng: number; altitude: number }) => {
                    const d = o as AtlasPoint
                    nav(`${d.region}`)
                }}
            />
        </div>
    )
}
