"use client";

import { Marquee } from "@/components/ui/marquee";
import { COMPATIBLE_APPS } from "@/lib/site";
import { useI18n } from "@/components/i18n-provider";

export function WorksWith() {
  const { t } = useI18n();

  return (
    <section className="ol-section tight">
      <div className="ol-container" style={{ marginBottom: 24, textAlign: "center" }}>
        <span className="ol-eyebrow">
          <span className="dot" />
          {t.works.label}
        </span>
      </div>
      <div className="works-mask">
        <Marquee className="[--duration:60s] [--gap:64px] py-2" pauseOnHover>
          {COMPATIBLE_APPS.map((app) => (
            <span key={app} className="works-item">
              <span className="works-dot" aria-hidden="true" />
              {app}
            </span>
          ))}
        </Marquee>
      </div>
      <style>{`
        .works-mask {
          width: 100%;
          mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
        }
        .works-item {
          font-family: var(--ol-serif);
          font-style: italic;
          font-size: 26px;
          color: var(--ol-ink-3);
          white-space: nowrap;
          opacity: 0.55;
          display: inline-flex;
          align-items: center;
          gap: 18px;
        }
        .works-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--ol-blue); opacity: 0.5; flex-shrink: 0; }
      `}</style>
    </section>
  );
}
