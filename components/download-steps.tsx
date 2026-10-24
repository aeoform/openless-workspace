"use client";

import { useEffect, useRef, useState } from "react";
import { AppleIcon, DownloadIcon, LinuxIcon, WindowsIcon } from "@/components/icons";
import { REPO_URL } from "@/lib/site";
import { useDownloadTargets, type AssetSlot } from "@/lib/release";
import { useI18n } from "@/components/i18n-provider";

function TargetIcon({ slot }: { slot: AssetSlot }) {
  if (slot.startsWith("macos")) return <AppleIcon />;
  if (slot.startsWith("windows")) return <WindowsIcon />;
  return <LinuxIcon />;
}

function StepArt({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg className="dl-art" width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        <rect x="20" y="34" width="80" height="58" rx="10" stroke="var(--ol-ink)" strokeWidth="1.5" fill="none" />
        <path d="M40 64h40M60 50v28M50 70l10 10 10-10" stroke="var(--ol-blue)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg className="dl-art" width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
        <rect x="14" y="40" width="92" height="46" rx="8" stroke="var(--ol-ink)" strokeWidth="1.5" fill="none" />
        <text x="60" y="68" textAnchor="middle" fontFamily="var(--ol-mono)" fontSize="10" fill="var(--ol-ink)">
          Install
        </text>
      </svg>
    );
  }
  return (
    <svg className="dl-art" width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="34" stroke="var(--ol-ink)" strokeWidth="1.5" fill="none" />
      <path d="M48 56a12 12 0 0124 0v8a12 12 0 01-24 0v-8z" fill="none" stroke="var(--ol-blue)" strokeWidth="1.5" />
      <path d="M52 88h16" stroke="var(--ol-ink)" strokeWidth="1.5" />
    </svg>
  );
}

export function DownloadSteps() {
  const { t } = useI18n();
  const { targets, version, publishedAt, href, checksums, primary } = useDownloadTargets();
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const scroller = scrollerRef.current;
    if (!wrap || !track || !scroller) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const compact = window.matchMedia("(max-width: 800px)").matches;

      if (compact) {
        // Mobile: the track is a horizontal scroller, so progress follows it directly.
        const max = scroller.scrollWidth - scroller.clientWidth;
        setProgress(max > 0 ? Math.min(1, scroller.scrollLeft / max) : 0);
        track.style.transform = "";
        return;
      }

      const total = wrap.offsetHeight - window.innerHeight;
      const ratio = total > 0 ? Math.min(1, Math.max(0, -wrap.getBoundingClientRect().top / total)) : 0;
      setProgress(ratio);
      const distance = track.scrollWidth - scroller.clientWidth;
      track.style.transform = `translateX(${-ratio * Math.max(0, distance)}px)`;
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    scroller.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      scroller.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const activeStep = Math.min(2, Math.floor(progress * 3 + 0.001));

  return (
    <section className="dl-section" id="download">
      <div ref={wrapRef} className="dl-wrap">
        <div className="dl-sticky">
          <div className="ol-container dl-head">
            <span className="ol-eyebrow">
              <span className="dot" />
              {t.download.eyebrow}
            </span>
            <h2 className="ol-h2">{t.download.title}</h2>
            <p className="section-sub">{t.download.sub}</p>
          </div>

          <div className="dl-progress ol-container">
            {t.download.steps.map((step, index) => (
              <div key={step.n} className={`dl-tick ${index <= activeStep ? "on" : ""}`}>
                <span className="tick-num ol-mono">{step.n}</span>
                <span className="tick-line" />
              </div>
            ))}
          </div>

          <div className="dl-track-wrap" ref={scrollerRef}>
            <div ref={trackRef} className="dl-track">
              {t.download.steps.map((step, index) => (
                <div key={step.n} className={`dl-card ${index === activeStep ? "on" : ""}`}>
                  <div className="dl-num ol-serif">{step.n}</div>
                  <h3>{step.t}</h3>
                  <p>{step.d}</p>
                  <div className="dl-code ol-mono">{step.code}</div>
                  <StepArt index={index} />
                </div>
              ))}

              <div className="dl-card final">
                <div className="dl-num ol-serif">→</div>
                <h3>{t.download.finalTitle}</h3>
                <p>{t.download.finalDesc}</p>
                {version && (
                  <p className="dl-release ol-mono">
                    {t.download.latest} · v{version}
                    {publishedAt ? ` · ${t.download.published} ${publishedAt.slice(0, 10)}` : ""}
                  </p>
                )}
                <div className="dl-actions">
                  {targets.map((target) => (
                    <a
                      key={target.id}
                      className={`ol-btn ${target.recommended ? "ol-btn-primary" : "ol-btn-ghost"}`}
                      href={target.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TargetIcon slot={target.id} />
                      {target.label}
                      {target.recommended && <span className="dl-badge">{t.download.recommended}</span>}
                    </a>
                  ))}
                </div>
                <div className="dl-links">
                  <a href={href} target="_blank" rel="noreferrer">
                    {t.download.allReleases} ↗
                  </a>
                  {checksums && (
                    <a href={checksums.href} target="_blank" rel="noreferrer">
                      {t.download.checksums} ↗
                    </a>
                  )}
                  <a href={REPO_URL} target="_blank" rel="noreferrer">
                    GitHub ↗
                  </a>
                </div>
                {primary && <p className="dl-detected ol-mono">{t.download.detectedHint}</p>}
              </div>
            </div>
          </div>

          <div className="ol-container dl-hint ol-mono">
            <DownloadIcon size={12} />
            {t.download.hint}
          </div>
        </div>
      </div>

      <style>{`
        .dl-section { padding: 0; }
        .dl-wrap { position: relative; height: 320vh; }
        .dl-sticky { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 80px 0 60px; overflow: hidden; }
        .dl-head { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 36px; gap: 14px; }
        .dl-head .section-sub { max-width: 560px; margin: 0; }
        .dl-progress { display: flex; gap: 16px; align-items: center; margin-bottom: 28px; }
        .dl-tick { display: flex; align-items: center; gap: 12px; flex: 1; opacity: 0.4; transition: opacity .3s; }
        .dl-tick.on { opacity: 1; }
        .tick-num { font-size: 12px; color: var(--ol-ink-3); }
        .dl-tick.on .tick-num { color: var(--ol-blue); font-weight: 500; }
        .tick-line { flex: 1; height: 2px; background: var(--ol-line); border-radius: 2px; }
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
          overflow: hidden;
          transition: border-color .3s, box-shadow .3s;
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
        .dl-card h3 { margin: 16px 0 12px; font-size: 28px; font-weight: 500; letter-spacing: -0.02em; }
        .dl-card p { color: var(--ol-ink-3); font-size: 15px; line-height: 1.6; margin: 0; }
        .dl-code { font-size: 12.5px; padding: 14px 16px; background: var(--ol-ink); color: #fff; border-radius: 10px; overflow-x: auto; white-space: nowrap; margin-top: auto; }
        .dl-code::before { content: "$ "; color: var(--ol-blue); }
        .dl-card.final .dl-code { display: none; }
        .dl-actions { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; }
        .dl-badge { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 7px; border-radius: 999px; background: var(--ol-blue); color: #fff; }
        .dl-release { margin-top: 14px; font-size: 12px; color: rgba(255,255,255,0.75); letter-spacing: 0.04em; }
        .dl-links { display: flex; gap: 16px; margin-top: 14px; flex-wrap: wrap; font-size: 12px; }
        .dl-links a { color: rgba(255,255,255,0.62); transition: color .15s; }
        .dl-links a:hover { color: #fff; }
        .dl-detected { margin-top: 10px; font-size: 11px; color: rgba(255,255,255,0.45); letter-spacing: 0.04em; }
        .dl-art { position: absolute; bottom: 24px; right: 28px; opacity: 0.16; pointer-events: none; }
        .dl-hint { display: flex; align-items: center; justify-content: center; gap: 8px; text-align: center; font-size: 11px; color: var(--ol-muted); margin-top: 24px; letter-spacing: 0.16em; text-transform: uppercase; }
        @media (max-width: 800px) {
          .dl-wrap { height: auto; }
          .dl-sticky { position: relative; top: auto; height: auto; padding: 60px 0; }
          .dl-track-wrap { overflow-x: auto; padding: 0 24px; scroll-snap-type: x mandatory; }
          .dl-track { transform: none !important; }
          .dl-card { flex: 0 0 86vw; scroll-snap-align: center; min-height: auto; padding: 28px; }
          .dl-card h3 { font-size: 22px; }
        }
      `}</style>
    </section>
  );
}
