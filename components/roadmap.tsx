"use client";

import { ArrowRight } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { ISSUES_URL } from "@/lib/site";

export function Roadmap() {
  const { t } = useI18n();

  return (
    <section className="ol-section" id="roadmap">
      <div className="ol-container">
        <header className="section-head">
          <span className="ol-eyebrow">
            <span className="dot" />
            {t.roadmap.eyebrow}
          </span>
          <h2 className="ol-h2">{t.roadmap.title}</h2>
          <p className="section-sub">{t.roadmap.sub}</p>
        </header>

        <ol className="rm-list">
          {t.roadmap.items.map((item, index) => (
            <li key={item.t} className={`rm-item ${item.status}`}>
              <div className="rm-rail" aria-hidden="true">
                <span className="rm-dot" />
              </div>
              <div className="rm-body">
                <div className="rm-top">
                  <span className={`rm-status ${item.status}`}>
                    {item.status === "active" ? t.roadmap.active : t.roadmap.planned}
                  </span>
                  <span className="rm-index ol-mono">0{index + 1}</span>
                </div>
                <h3 className="rm-title">{item.t}</h3>
                <p className="rm-desc">{item.d}</p>
                <a className="rm-link" href={item.href} target="_blank" rel="noreferrer">
                  GitHub
                  <ArrowRight size={12} />
                </a>
              </div>
            </li>
          ))}
        </ol>

        <div className="rm-foot">
          <span className="ol-mono">{t.roadmap.sub}</span>
          <a href={ISSUES_URL} target="_blank" rel="noreferrer" className="rm-link">
            Issues
            <ArrowRight size={12} />
          </a>
        </div>
      </div>

      <style>{`
        .rm-list { list-style: none; margin: 56px 0 0; padding: 0; display: grid; }
        .rm-item { display: grid; grid-template-columns: 28px 1fr; gap: 20px; }
        .rm-rail { position: relative; display: flex; justify-content: center; }
        .rm-rail::before { content: ""; position: absolute; top: 0; bottom: 0; width: 1px; background: var(--ol-line-2); }
        .rm-item:first-child .rm-rail::before { top: 18px; }
        .rm-item:last-child .rm-rail::before { bottom: calc(100% - 18px); }
        .rm-dot {
          position: relative; z-index: 1; margin-top: 12px;
          width: 9px; height: 9px; border-radius: 50%;
          background: #fff; border: 1.5px solid var(--ol-muted-2);
        }
        .rm-item.active .rm-dot { border-color: var(--ol-blue); background: var(--ol-blue); box-shadow: 0 0 0 4px rgba(30,99,255,0.14); }
        .rm-body { padding: 0 0 40px; }
        .rm-top { display: flex; align-items: center; gap: 10px; }
        .rm-status {
          font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
          padding: 4px 9px; border-radius: 999px;
          border: 1px solid var(--ol-line-2); color: var(--ol-muted);
        }
        .rm-status.active { color: var(--ol-blue-ink); border-color: rgba(30,99,255,0.28); background: var(--ol-blue-soft); }
        .rm-index { font-size: 11px; color: var(--ol-muted-2); letter-spacing: 0.16em; }
        .rm-title { margin: 12px 0 6px; font-size: 20px; font-weight: 500; letter-spacing: -0.01em; }
        .rm-desc { margin: 0; color: var(--ol-ink-3); font-size: 14.5px; line-height: 1.65; max-width: 620px; }
        .rm-link {
          margin-top: 10px; display: inline-flex; align-items: center; gap: 6px;
          font-size: 12.5px; color: var(--ol-ink-3);
          font-family: var(--ol-mono);
          transition: color .15s, gap .2s;
        }
        .rm-link:hover { color: var(--ol-blue); gap: 9px; }
        .rm-foot {
          display: flex; justify-content: space-between; align-items: center; gap: 16px;
          border-top: 1px solid var(--ol-line); padding-top: 20px; margin-top: 8px;
        }
        .rm-foot > .ol-mono { font-size: 11px; color: var(--ol-muted-2); letter-spacing: 0.06em; }
        @media (max-width: 700px) {
          .rm-foot > .ol-mono { display: none; }
        }
      `}</style>
    </section>
  );
}
