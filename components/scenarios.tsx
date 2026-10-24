"use client";

import { useEffect, useRef, useState } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { useI18n } from "@/components/i18n-provider";
import { SCENARIO_ACCENTS } from "@/lib/site";

export function Scenarios() {
  const { t } = useI18n();
  const items = t.scenarios.items;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const item = items[active];

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
      const ratio = total > 0 ? scrolled / total : 0;
      setProgress(ratio);
      setActive(Math.min(items.length - 1, Math.floor(ratio * items.length)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items.length]);

  const goTo = (index: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const total = wrap.offsetHeight - window.innerHeight;
    const top = wrap.offsetTop + (index + 0.5) * (total / items.length);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="scen-section">
      <div className="ol-container">
        <header className="section-head">
          <span className="ol-eyebrow">
            <span className="dot" />
            {t.scenarios.eyebrow}
          </span>
          <h2 className="ol-h2">{t.scenarios.title}</h2>
        </header>
      </div>

      <div className="scen-wrap" ref={wrapRef}>
        <div className="scen-sticky">
          <div className="ol-container">
            <div className="scen-stage" style={{ ["--accent" as string]: SCENARIO_ACCENTS[active] }}>
              <div className="scen-meta">
                <span className="scen-tag ol-mono">
                  {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
                <span className="scen-kicker">{item.tag}</span>
                <h3 className="scen-heading">{item.t}</h3>
                <p className="scen-desc">{item.d}</p>
                <div className="scen-pips">
                  {items.map((entry, index) => (
                    <button
                      key={entry.tag}
                      type="button"
                      className={`scen-pip ${index === active ? "on" : ""} ${index < active ? "past" : ""}`}
                      aria-label={`${index + 1}. ${entry.tag}`}
                      aria-current={index === active ? "true" : undefined}
                      onClick={() => goTo(index)}
                    />
                  ))}
                </div>
                <span className="scen-hint ol-mono">{t.scenarios.hint}</span>
              </div>

              <div className="scen-demo" aria-live="polite">
                <div className="scen-demo-bar">
                  <span className="hv-dot r" aria-hidden="true" />
                  <span className="hv-dot y" aria-hidden="true" />
                  <span className="hv-dot g" aria-hidden="true" />
                  <span className="scen-demo-title ol-mono">{item.app.toLowerCase()}.app</span>
                  <span className="scen-demo-mode ol-mono">{item.mode}</span>
                </div>

                <div className="scen-demo-body" key={active}>
                  <div className="scen-block">
                    <span className="scen-label ol-mono">{t.scenarios.draftLabel}</span>
                    <p className="scen-draft">{item.draft}</p>
                  </div>

                  <div className="scen-flow" aria-hidden="true">
                    <span className="scen-flow-line" />
                    <span className="scen-flow-dot" />
                  </div>

                  <div className="scen-block scen-block-result">
                    <span className="scen-label ol-mono">{t.scenarios.resultLabel}</span>
                    <div className="scen-result">
                      {item.result.split("\n").map((line, index) => (
                        <span
                          key={`${active}-${index}`}
                          className="scen-line"
                          style={{ animationDelay: `${140 + index * 90}ms` }}
                        >
                          {line || "\u00a0"}
                        </span>
                      ))}
                      <span className="scen-caret" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                <div className="scen-demo-foot">
                  <span className="scen-wave" aria-hidden="true">
                    {Array.from({ length: 9 }, (_, index) => (
                      <i key={index} style={{ animationDelay: `${index * 70}ms` }} />
                    ))}
                  </span>
                  <span className="scen-mode-label ol-mono">
                    {t.scenarios.modeLabel} · {item.mode}
                  </span>
                </div>

                <BorderBeam size={140} duration={8} colorFrom={SCENARIO_ACCENTS[active]} colorTo="#7AA7FF" borderWidth={1.5} />
              </div>
            </div>

            <div className="scen-progress" aria-hidden="true">
              <span style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hv-dot { width: 10px; height: 10px; border-radius: 50%; }
        .hv-dot.r { background: #FF5F57; }
        .hv-dot.y { background: #FEBC2E; }
        .hv-dot.g { background: #28C840; }
        .scen-section { padding-top: 80px; padding-bottom: 0; }
        .scen-wrap { position: relative; height: 360vh; }
        .scen-sticky { position: sticky; top: 10vh; height: 80vh; display: flex; align-items: center; }
        .scen-stage { display: grid; grid-template-columns: 360px 1fr; gap: 64px; align-items: center; width: 100%; }
        .scen-meta { display: flex; flex-direction: column; gap: 14px; }
        .scen-tag {
          font-size: 11.5px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--accent);
          padding: 5px 12px;
          background: color-mix(in oklab, var(--accent) 8%, transparent);
          border-radius: 999px;
          align-self: flex-start;
          transition: color .4s, background .4s;
        }
        .scen-kicker { font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ol-muted); }
        .scen-heading { margin: 0; font-size: clamp(28px, 3.2vw, 42px); letter-spacing: -0.025em; line-height: 1.08; font-weight: 500; }
        .scen-desc { color: var(--ol-ink-3); font-size: 15.5px; line-height: 1.6; margin: 0; }
        .scen-pips { display: flex; gap: 6px; margin-top: 10px; }
        .scen-pip {
          width: 28px; height: 4px; border-radius: 2px; padding: 0;
          border: 0; background: var(--ol-line-2); cursor: pointer;
          transition: background .3s, width .3s;
        }
        .scen-pip:hover { background: var(--ol-muted-2); }
        .scen-pip.on { background: var(--accent); width: 44px; }
        .scen-pip.past { background: color-mix(in oklab, var(--accent) 35%, transparent); }
        .scen-hint { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ol-muted); margin-top: 6px; }

        .scen-demo {
          position: relative;
          background: #fff;
          border: 1px solid var(--ol-line);
          border-radius: var(--ol-radius-xl);
          box-shadow: 0 30px 80px -30px rgba(10,10,12,0.22);
          overflow: hidden;
          display: flex; flex-direction: column;
          aspect-ratio: 16 / 10;
          min-height: 380px;
        }
        .scen-demo-bar { height: 40px; flex-shrink: 0; display: flex; align-items: center; padding: 0 14px; gap: 8px; border-bottom: 1px solid var(--ol-line); background: rgba(248,248,250,0.7); }
        .scen-demo-title { margin-left: 12px; font-size: 11.5px; color: var(--ol-muted); letter-spacing: 0.04em; }
        .scen-demo-mode { margin-left: auto; font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent); background: color-mix(in oklab, var(--accent) 8%, transparent); border-radius: 999px; padding: 3px 9px; }
        .scen-demo-body { flex: 1; min-height: 0; overflow-y: auto; padding: 26px 30px; display: flex; flex-direction: column; gap: 12px; justify-content: center; background: radial-gradient(circle at 70% 20%, color-mix(in oklab, var(--accent) 7%, transparent), transparent 60%), #fff; }
        .scen-block { display: flex; flex-direction: column; gap: 7px; }
        .scen-label { font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ol-muted); }
        .scen-draft { margin: 0; font-size: 15px; line-height: 1.55; color: var(--ol-muted); font-style: italic; }
        .scen-flow { display: flex; align-items: center; gap: 8px; padding: 2px 0; }
        .scen-flow-line { flex: 1; height: 1px; background: repeating-linear-gradient(90deg, var(--ol-line-2) 0 4px, transparent 4px 8px); }
        .scen-flow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent) 14%, transparent); }
        .scen-result { position: relative; font-size: 15px; line-height: 1.6; color: var(--ol-ink); display: flex; flex-direction: column; gap: 2px; }
        .scen-line { display: block; animation: scen-line-in .5s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes scen-line-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .scen-caret { display: inline-block; width: 2px; height: 1.05em; margin-left: 2px; vertical-align: -0.18em; background: var(--accent); animation: scen-blink 1.1s steps(1) infinite; }
        @keyframes scen-blink { 50% { opacity: 0; } }
        .scen-demo-foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 30px; border-top: 1px solid var(--ol-line); background: rgba(250,250,252,0.8); }
        .scen-wave { display: inline-flex; align-items: flex-end; gap: 3px; height: 18px; }
        .scen-wave i { width: 3px; height: 6px; border-radius: 2px; background: var(--accent); opacity: .55; animation: scen-wave 1.1s ease-in-out infinite; }
        @keyframes scen-wave { 0%, 100% { height: 5px; opacity: .4; } 50% { height: 17px; opacity: .9; } }
        .scen-mode-label { font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ol-muted); }

        .scen-progress { margin-top: 32px; height: 2px; background: var(--ol-line-2); border-radius: 2px; overflow: hidden; max-width: 260px; }
        .scen-progress > span { display: block; height: 100%; background: var(--ol-blue); transition: width .25s ease; }

        @media (max-width: 900px) {
          .scen-stage { grid-template-columns: 1fr; gap: 28px; }
          .scen-wrap { height: 320vh; }
          .scen-sticky { top: 6vh; }
          .scen-demo { aspect-ratio: auto; min-height: 320px; }
          .scen-demo-body { padding: 20px; }
          .scen-demo-foot { padding: 10px 20px; }
        }
      `}</style>
    </section>
  );
}
