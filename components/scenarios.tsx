"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { BorderBeam } from "@/components/ui/border-beam";

const ACCENTS = ["#10A37F", "#1E63FF", "#FF6A1A", "#0A0A0C"];
const APPS = ["ChatGPT", "Cursor", "Mail", "Notion"];

function ScenIcon({ i, large = false }: { i: number; large?: boolean }) {
  const sz = large ? 64 : 14;
  const props = {
    width: sz,
    height: sz,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: large ? 1.2 : 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: large ? { color: "var(--accent)", opacity: 0.5 } : undefined,
  };
  if (i === 0) {
    return (
      <svg {...props}>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/>
        <path d="M19 16l.9 2.6L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.4L19 16z"/>
      </svg>
    );
  }
  if (i === 1) {
    return (
      <svg {...props}>
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <path d="M3 7l9 6 9-6"/>
      </svg>
    );
  }
  if (i === 2) {
    return (
      <svg {...props}>
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6M14 4l-4 16"/>
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <path d="M14 2v6h6M9 13h6M9 17h4"/>
    </svg>
  );
}

export function Scenarios() {
  const { t, lang } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const items = t.scenarios.items;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = wrap.getBoundingClientRect();
        const winH = window.innerHeight;
        const total = wrap.offsetHeight - winH;
        const scrolled = Math.min(Math.max(-r.top, 0), total);
        const p = total > 0 ? scrolled / total : 0;
        setProgress(p);
        const i = Math.min(items.length - 1, Math.floor(p * items.length));
        setActive(i);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  return (
    <section className="scen-section">
      <div className="ol-container">
        <header className="section-head" style={{ marginBottom: 40 }}>
          <span className="ol-eyebrow"><span className="dot" />{t.scenarios.eyebrow}</span>
          <h2 className="ol-h2" style={{ marginTop: 16 }}>{t.scenarios.title}</h2>
        </header>
      </div>
      <div className="scen-wrap" ref={wrapRef}>
        <div className="scen-sticky">
          <div className="ol-container">
            <div className="scen-stage" style={{ ["--accent" as string]: ACCENTS[active] }}>
              <div className="scen-meta">
                <span className="scen-tag ol-mono">
                  {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
                <h3 className="scen-heading">{items[active].t}</h3>
                <p className="scen-desc">{items[active].d}</p>
                <div className="scen-pips">
                  {items.map((_, i) => (
                    <span key={i} className={`scen-pip ${i === active ? "on" : ""} ${i < active ? "past" : ""}`} />
                  ))}
                </div>
                <span className="scen-hint ol-mono">{t.scenarios.hint}</span>
              </div>
              <div className="scen-visual">
                {items.map((_, i) => (
                  <div
                    key={i}
                    className={`scen-frame ${i === active ? "on" : i < active ? "past" : "future"}`}
                    style={{ ["--accent" as string]: ACCENTS[i] }}
                  >
                    <div className="scen-frame-bar">
                      <span className="hv-dot r" /><span className="hv-dot y" /><span className="hv-dot g" />
                      <span className="scen-frame-title ol-mono">{APPS[i].toLowerCase()}.app</span>
                    </div>
                    <div className="scen-frame-body">
                      <span className="scen-image-label ol-mono">
                        {t.scenarios.placeholder(APPS[i])}
                      </span>
                      <ScenIcon i={i} large />
                    </div>
                    {i === active && (
                      <BorderBeam size={140} duration={7} colorFrom={ACCENTS[i]} colorTo="#7AA7FF" borderWidth={1.5} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="scen-progress">
              <span style={{ width: progress * 100 + "%" }} />
            </div>
          </div>
        </div>
      </div>
      <span style={{ display: "none" }}>{lang}</span>
      <style>{`
        .hv-dot { width: 10px; height: 10px; border-radius: 50%; }
        .hv-dot.r { background: #FF5F57; }
        .hv-dot.y { background: #FEBC2E; }
        .hv-dot.g { background: #28C840; }
        .section-head { text-align: center; max-width: 760px; margin: 0 auto; }
        .scen-section { padding-top: 80px; padding-bottom: 0; }
        .scen-wrap { position: relative; height: 360vh; }
        .scen-sticky { position: sticky; top: 10vh; height: 80vh; display: flex; align-items: center; }
        .scen-stage {
          --accent: #1E63FF;
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 64px;
          align-items: center;
          width: 100%;
        }
        .scen-meta { display: flex; flex-direction: column; gap: 18px; }
        .scen-tag {
          font-size: 11.5px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--accent);
          padding: 5px 12px;
          background: color-mix(in oklab, var(--accent) 8%, transparent);
          border-radius: 999px;
          align-self: flex-start;
          transition: color .4s, background .4s;
        }
        .scen-heading { margin: 0; font-size: clamp(32px, 4vw, 48px); letter-spacing: -0.025em; line-height: 1.05; font-weight: 500; }
        .scen-desc { color: var(--ol-ink-3); font-size: 16px; line-height: 1.6; margin: 0; }
        .scen-pips { display: flex; gap: 6px; margin-top: 12px; }
        .scen-pip { width: 28px; height: 3px; border-radius: 2px; background: var(--ol-line-2); transition: background .3s, width .3s; }
        .scen-pip.on { background: var(--accent); width: 44px; }
        .scen-pip.past { background: color-mix(in oklab, var(--accent) 35%, transparent); }
        .scen-hint { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ol-muted); margin-top: 8px; }
        .scen-visual { position: relative; aspect-ratio: 16 / 10; width: 100%; }
        .scen-frame {
          position: absolute; inset: 0;
          background: #fff;
          border: 1px solid var(--ol-line);
          border-radius: var(--ol-radius-xl);
          box-shadow: 0 30px 80px -30px rgba(10,10,12,0.22);
          overflow: hidden;
          display: flex; flex-direction: column;
          opacity: 0;
          transform: translateY(24px) scale(0.98);
          transition: opacity .55s ease, transform .55s cubic-bezier(.22,.61,.36,1);
          pointer-events: none;
        }
        .scen-frame.on { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
        .scen-frame.past { opacity: 0; transform: translateY(-24px) scale(0.98); }
        .scen-frame-bar { height: 38px; flex-shrink: 0; display: flex; align-items: center; padding: 0 14px; gap: 8px; border-bottom: 1px solid var(--ol-line); background: rgba(248,248,250,0.7); }
        .scen-frame-title { margin-left: 14px; font-size: 11.5px; color: var(--ol-muted); letter-spacing: 0.04em; }
        .scen-frame-body {
          flex: 1; position: relative;
          background:
            radial-gradient(circle at 50% 60%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 55%),
            linear-gradient(135deg, #fafbfd, #eef1f8);
          display: grid; place-items: center;
          color: var(--ol-ink-3);
        }
        .scen-image-label {
          position: absolute; top: 16px; left: 50%; transform: translateX(-50%);
          font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--ol-muted);
          padding: 5px 12px;
          background: rgba(255,255,255,0.92);
          border: 1px dashed var(--ol-line-2);
          border-radius: 999px;
          z-index: 2;
        }
        .scen-progress { margin-top: 32px; height: 2px; background: var(--ol-line-2); border-radius: 2px; overflow: hidden; max-width: 260px; }
        .scen-progress > span { display: block; height: 100%; background: var(--ol-blue); transition: width .25s ease; }
        @media (max-width: 900px) {
          .scen-stage { grid-template-columns: 1fr; gap: 32px; }
          .scen-wrap { height: 320vh; }
          .scen-sticky { top: 6vh; }
        }
      `}</style>
    </section>
  );
}
