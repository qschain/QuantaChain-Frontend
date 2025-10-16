import React, { useEffect } from "react";

export function UnderConstruction() {
    useEffect(() => {
        const root = document.querySelector(".uc-particles");
        if (!root) return;
        const N = 22;
        const arr: HTMLDivElement[] = [];
        for (let i = 0; i < N; i++) {
            const d = document.createElement("div");
            d.className = "uc-dot";
            d.style.left = Math.random() * 100 + "%";
            d.style.top = Math.random() * 100 + "%";
            d.style.animationDelay = (Math.random() * 12).toFixed(2) + "s";
            d.style.opacity = String(0.15 + Math.random() * 0.6);
            d.style.transform = `translate(-50%, -50%) scale(${0.6 + Math.random() * 1.2})`;
            root.appendChild(d);
            arr.push(d);
        }
        return () => {
            arr.forEach((n) => n.remove());
        };
    }, []);

    return (
        <div className="uc-wrap">
            <div className="uc-bg">
                <div className="uc-beam a"/>
                <div className="uc-beam b"/>
                <div className="uc-beam c"/>
                <div className="uc-vignette"/>
                <div className="uc-noise"/>
                <div className="uc-particles" aria-hidden/>
            </div>

            <div className="uc-center">
                <h1 className="uc-title">正在开发中......</h1>
                <p className="uc-sub">页面正在紧锣密鼓建设中，敬请期待上线！</p>
                <div className="uc-actions">
                    <button className="uc-btn" onClick={() => window.history.back()}>返回上一页</button>
                    <a className="uc-btn ghost" href="/">返回主页</a>
                </div>
            </div>

            <div className="uc-badge">QUANTACHAIN</div>

            <style>{styles}</style>
        </div>
    );
}

const styles = `
:root{
  --bg:#0b0e12; --panel:#0f141b; --line:#243042;
  --text:#e6ebf2; --muted:#92a3b6; --neon:#16f4ff; --neon-2:#05ffd2;
}
*{box-sizing:border-box}
html,body,#root{height:100%;margin:0;}
body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif}

.uc-wrap{position:relative;width:100%;height:100vh;overflow:hidden;background:radial-gradient(1200px 600px at 50% 0%, #0d1721 0%, var(--bg) 60%);display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center}

.uc-bg{position:absolute;inset:0;pointer-events:none}
.uc-beam{position:absolute;inset:-30% -20%;filter:blur(60px);opacity:.35;mix-blend-mode:screen;background:radial-gradient(closest-side, rgba(22,244,255,.55), transparent 70%)}
.uc-beam.a{animation:spin 26s linear infinite}
.uc-beam.b{animation:spin 38s linear reverse infinite; opacity:.28}
.uc-beam.c{animation:spin 52s linear infinite; opacity:.2}
@keyframes spin{to{transform:rotate(360deg)}}
.uc-vignette{position:absolute;inset:0;box-shadow:inset 0 0 220px 80px #000}
.uc-noise{position:absolute;inset:-20%;background-image:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"140\" height=\"140\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\" opacity=\"0.05\"/></svg>');opacity:.25;mix-blend-mode:overlay;animation:drift 80s linear infinite}
@keyframes drift{to{transform:translate3d(-10%, -10%, 0)}}

.uc-particles{position:absolute;inset:0}
.uc-dot{position:absolute;left:50%;top:50%;width:2px;height:2px;background:var(--neon);border-radius:50%;box-shadow:0 0 14px rgba(22,244,255,.85), 0 0 36px rgba(22,244,255,.35);
  animation:float 14s ease-in-out infinite}
@keyframes float{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(calc(-50% + 10px), calc(-50% - 20px)) scale(1.25)}}

.uc-center{position:relative;z-index:1;max-width:90%;}

.uc-title{font-size: clamp(34px, 8vw, 80px);font-weight:900;line-height:1.2;margin:0 0 18px;letter-spacing:.02em;color:#ecfeff;text-shadow:0 0 22px rgba(22,244,255,.45), 0 0 60px rgba(5,255,210,.25), 0 2px 0 rgba(0,0,0,.4)}
.uc-title::after{content:"";display:block;margin:14px auto 0;width:min(80vw,720px);height:1px;background:linear-gradient(90deg,transparent, rgba(22,244,255,.8), transparent);filter:drop-shadow(0 0 20px rgba(22,244,255,.6))}

.uc-sub{margin:0 0 28px;color:var(--muted);font-size:clamp(16px,2.5vw,20px);font-weight:600}

.uc-actions{display:flex;gap:12px;justify-content:center}
.uc-btn{appearance:none;border:1px solid rgba(22,244,255,.45);background:linear-gradient(180deg, rgba(22,244,255,.16), rgba(22,244,255,.08));color:#03161a;padding:10px 16px;border-radius:12px;cursor:pointer;font-weight:800;letter-spacing:.2px;box-shadow:0 6px 24px rgba(22,244,255,.35), inset 0 0 0 1px rgba(0,0,0,.22);transition:transform .12s ease, box-shadow .12s ease, background .12s ease, color .12s ease;color:#03161a; background:#16f4ff;}
.uc-btn:hover{transform:translateY(-1px);box-shadow:0 10px 30px rgba(22,244,255,.45)}
.uc-btn:active{transform:translateY(0)}
.uc-btn.ghost{background:transparent;color:#e6fbff;border-color:#264855;box-shadow:none}
.uc-btn.ghost:hover{background:rgba(22,244,255,.08);}

.uc-badge{position:fixed;right:14px;top:14px;padding:6px 10px;border-radius:10px;border:1px solid #20313a;background:rgba(7,12,16,.7);backdrop-filter:blur(6px);font-weight:800;font-size:12px;color:#a6e8f0;letter-spacing:.3px}

@media (prefers-reduced-motion: reduce) {
  .uc-beam,.uc-noise,.uc-dot{animation:none}
}
`;
