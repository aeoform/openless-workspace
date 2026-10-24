"use client";

import { useI18n } from "@/components/i18n-provider";
import { Meteors } from "@/components/ui/meteors";

function DownloadIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14"/></svg>;
}
function GitHubIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4 1 0 2 .1 3 .4 2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>;
}

export function BigCTA() {
  const { t } = useI18n();
  return (
    <section className="ol-section tight">
      <div className="ol-container">
        <div className="cta-shell">
          <h2 className="cta-title" style={{ whiteSpace: "pre-line" }}>{t.cta.title}</h2>
          <p>{t.cta.sub}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap", position: "relative", zIndex: 2 }}>
            <a href="#download" className="ol-btn ol-btn-primary" style={{ background: "#fff", color: "#0a0a0c" }}>
              <DownloadIcon />{t.cta.btn1}
            </a>
            <a href="https://github.com/Open-Less/openless" target="_blank" rel="noreferrer" className="ol-btn ol-btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
              <GitHubIcon />{t.cta.btn2}
            </a>
          </div>
          <Meteors number={28} className="bg-blue-400 shadow-[0_0_0_1px_#1E63FF20]" />
        </div>
      </div>
      <style>{`
        .cta-shell {
          background: var(--ol-ink);
          color: #fff;
          border-radius: var(--ol-radius-xl);
          padding: 80px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .cta-shell .cta-title { font-size: clamp(40px, 5.5vw, 76px); line-height: 1.0; letter-spacing: -0.03em; max-width: 900px; margin: 0 auto; position: relative; z-index: 2; }
        .cta-shell p { font-size: 17px; color: rgba(255,255,255,0.65); margin-top: 24px; position: relative; z-index: 2; }
      `}</style>
    </section>
  );
}
