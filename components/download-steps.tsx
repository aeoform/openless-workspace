"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n-provider";

function DownloadIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14"/></svg>;
}
function GitHubIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4 1 0 2 .1 3 .4 2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>;
}

const RELEASES = "https://github.com/Open-Less/openless/releases/latest";

function DLArt({ i }: { i: number }) {
  if (i === 0) {
    return (
      <svg className="dl-art" width="120" height="120" viewBox="0 0 120 120" style={{ position: "absolute", bottom: 24, right: 28, opacity: 0.18 }}>
        <rect x="20" y="34" width="80" height="58" rx="10" stroke="var(--ol-ink)" strokeWidth="1.5" fill="none"/>
        <path d="M40 64h40M60 50v28M50 70l10 10 10-10" stroke="var(--ol-blue)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    );
  }
  if (i === 1) {
    return (
      <svg className="dl-art" width="120" height="120" viewBox="0 0 120 120" style={{ position: "absolute", bottom: 24, right: 28, opacity: 0.18 }}>
        <rect x="14" y="40" width="92" height="46" rx="8" stroke="var(--ol-ink)" strokeWidth="1.5" fill="none"/>
        <text x="60" y="68" textAnchor="middle" fontFamily="var(--ol-mono)" fontSize="10" fill="var(--ol-ink)">Install</text>
      </svg>
    );
  }
  return (
    <svg className="dl-art" width="120" height="120" viewBox="0 0 120 120" style={{ position: "absolute", bottom: 24, right: 28, opacity: 0.2 }}>
      <circle cx="60" cy="60" r="34" stroke="var(--ol-ink)" strokeWidth="1.5" fill="none"/>
      <path d="M48 56a12 12 0 0124 0v8a12 12 0 01-24 0v-8z" fill="none" stroke="var(--ol-blue)" strokeWidth="1.5"/>
      <path d="M52 88h16" stroke="var(--ol-ink)" strokeWidth="1.5"/>
    </svg>
  );
}

export function DownloadSteps() {
  const { t } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let raf: number | null = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const rect = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = wrap.offsetHeight - vh;
        const scrolled = -rect.top;
        const p = Math.max(0, Math.min(1, scrolled / total));
        setProgress(p);
        const parent = track.parentElement;
        if (!parent) return;
        const trackW = track.scrollWidth - parent.clientWidth;
        track.style.transform = `translateX(${-p * trackW}px)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const activeStep = Math.min(2, Math.floor(progress * 3 + 0.001));

  return (
    <section className="dl-section" id="download">
      <div ref={wrapRef} className="dl-wrap">
        <div className="dl-sticky">
          <div className="ol-container dl-head">
            <span className="ol-eyebrow"><span className="dot" />{t.download.eyebrow}</span>
            <h2 className="ol-h2" style={{ marginTop: 16 }}>{t.download.title}</h2>
            <p className="section-sub" style={{ maxWidth: 560, margin: "16px auto 0" }}>{t.download.sub}</p>
          </div>

          <div className="dl-progress ol-container">
            {t.download.steps.map((s, i) => (
              <div key={i} className={`dl-tick ${i <= activeStep ? "on" : ""}`}>
                <span className="tick-num ol-mono">{s.n}</span>
                <span className="tick-line" />
              </div>
            ))}
          </div>

          <div className="dl-track-wrap">
            <div ref={trackRef} className="dl-track">
              {t.download.steps.map((s, i) => (
                <div key={i} className={`dl-card ${i === activeStep ? "on" : ""}`}>
                  <div className="dl-num ol-serif">{s.n}</div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  <div className="dl-code ol-mono">{s.code}</div>
                  <DLArt i={i} />
                </div>
              ))}
              <div className="dl-card final">
                <div className="dl-num ol-serif">→</div>
                <h3>{t.download.finalTitle}</h3>
                <p>{t.download.finalDesc}</p>
                <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                  {t.download.platforms.map((platform) => (
                    <a key={platform} className="ol-btn ol-btn-primary" href={RELEASES} target="_blank" rel="noreferrer">
                      <DownloadIcon />{platform}
                    </a>
                  ))}
                  <a className="ol-btn ol-btn-ghost" href="https://github.com/Open-Less/openless" target="_blank" rel="noreferrer"><GitHubIcon />GitHub</a>
                </div>
              </div>
            </div>
          </div>

          <div className="ol-container dl-hint ol-mono">{t.download.hint}</div>
        </div>
      </div>
      <style>{`
        .section-sub { color: var(--ol-ink-3); font-size: 17px; line-height: 1.6; }
        .dl-section { padding: 0; }
        .dl-wrap { position: relative; height: 320vh; }
        .dl-sticky { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 80px 0 60px; overflow: hidden; }
        .dl-head { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 36px; }
        .dl-progress { display: flex; gap: 16px; align-items: center; margin-bottom: 28px; }
        .dl-tick { display: flex; align-items: center; gap: 12px; flex: 1; opacity: 0.4; transition: opacity .3s; }
        .dl-tick.on { opacity: 1; }
        .tick-num { font-size: 12px; color: var(--ol-ink-3); }
        .dl-tick.on .tick-num { color: var(--ol-blue); font-weight: 500; }
        .tick-line { flex: 1; height: 2px; background: var(--ol-line); border-radius: 2px; position: relative; overflow: hidden; }
        .dl-tick.on .tick-line { background: var(--ol-blue); }
        .dl-track-wrap { padding-left: max(24px, calc((100vw - 1240px) / 2)); overflow: hidden; }
        .dl-track { display: flex; gap: 24px; will-change: transform; transition: transform .15s ease-out; }
        .dl-card {
          flex: 0 0 580px;
          background: #fff;
          border: 1px solid var(--ol-line);
          border-radius: var(--ol-radius-xl);
          padding: 40px;
          position: relative;
          min-height: 380px;
          display: flex;
          flex-direction: column;
          transition: border-color .3s, box-shadow .3s, transform .3s;
        }
        .dl-card.on { border-color: var(--ol-ink); box-shadow: 0 30px 60px -20px rgba(10,10,12,0.18); }
        .dl-card::before { content: ""; position: absolute; top: 0; left: 0; width: 0; height: 2px; background: var(--ol-blue); border-radius: 2px; transition: width .5s ease; }
        .dl-card.on::before { width: 60%; }
        .dl-card.final { background: var(--ol-ink); color: #fff; border-color: var(--ol-ink); }
        .dl-card.final p { color: rgba(255,255,255,0.65); }
        .dl-card.final .dl-num { color: var(--ol-blue); }
        .dl-card.final .ol-btn-primary { background: #fff; color: var(--ol-ink); }
        .dl-card.final .ol-btn-primary:hover { background: rgba(255,255,255,0.9); }
        .dl-card.final .ol-btn-ghost { color: #fff; border-color: rgba(255,255,255,0.3); }
        .dl-card.final .ol-btn-ghost:hover { background: rgba(255,255,255,0.1); }
        .dl-num { font-size: 72px; line-height: 1; color: var(--ol-blue); font-style: italic; opacity: 0.85; }
        .dl-card h3 { margin: 16px 0 12px; font-size: 28px; }
        .dl-card p { color: var(--ol-ink-3); font-size: 15px; line-height: 1.6; margin: 0; }
        .dl-code { font-size: 12.5px; padding: 14px 16px; background: var(--ol-ink); color: #fff; border-radius: 10px; overflow-x: auto; white-space: nowrap; margin-top: 18px; }
        .dl-code::before { content: "$ "; color: var(--ol-blue); }
        .dl-card.final .dl-code { display: none; }
        .dl-hint { text-align: center; font-size: 11px; color: var(--ol-muted); margin-top: 24px; letter-spacing: 0.16em; text-transform: uppercase; }
        @media (max-width: 800px) {
          .dl-wrap { height: auto; }
          .dl-sticky { position: relative; top: auto; height: auto; padding: 60px 0; }
          .dl-track-wrap { overflow-x: auto; padding: 0 24px; scroll-snap-type: x mandatory; }
          .dl-track { transform: none !important; }
          .dl-card { flex: 0 0 86vw; scroll-snap-align: center; min-height: auto; padding: 28px; }
          .dl-card h3 { font-size: 22px; }
          .dl-head { align-items: center; }
        }
      `}</style>
    </section>
  );
}
