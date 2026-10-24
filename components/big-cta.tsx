"use client";

import { DownloadIcon, GitHubIcon } from "@/components/icons";
import { REPO_URL } from "@/lib/site";
import { useI18n } from "@/components/i18n-provider";
import { Meteors } from "@/components/ui/meteors";

export function BigCTA() {
  const { t } = useI18n();

  return (
    <section className="ol-section tight">
      <div className="ol-container">
        <div className="cta-shell">
          <h2 className="cta-title">{t.cta.title}</h2>
          <p>{t.cta.sub}</p>
          <div className="cta-actions">
            <a href="#download" className="ol-btn ol-btn-primary cta-primary">
              <DownloadIcon />
              {t.cta.btn1}
            </a>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="ol-btn ol-btn-ghost cta-ghost">
              <GitHubIcon />
              {t.cta.btn2}
            </a>
          </div>
          <Meteors number={28} className="cta-meteor bg-blue-400 shadow-[0_0_0_1px_#1E63FF20]" />
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
        .cta-title { font-size: clamp(40px, 5.5vw, 76px); line-height: 1; letter-spacing: -0.03em; max-width: 900px; margin: 0 auto; position: relative; z-index: 2; font-weight: 400; white-space: pre-line; }
        .cta-shell p { font-size: 17px; color: rgba(255,255,255,0.65); margin-top: 24px; position: relative; z-index: 2; }
        .cta-actions { display: flex; gap: 12px; justify-content: center; margin-top: 28px; flex-wrap: wrap; position: relative; z-index: 2; }
        .cta-primary { background: #fff; color: #0a0a0c; }
        .cta-ghost { color: #fff; border-color: rgba(255,255,255,0.3); }
        .cta-ghost:hover { background: rgba(255,255,255,0.1); }
        @media (max-width: 700px) {
          .cta-shell { padding: 56px 24px; }
        }
      `}</style>
    </section>
  );
}
