"use client";

import { useI18n } from "@/components/i18n-provider";

export function Roadmap() {
  const { t } = useI18n();
  return (
    <section className="ol-section">
      <div className="ol-container">
        <header className="section-head">
          <span className="ol-eyebrow"><span className="dot" />{t.roadmap.eyebrow}</span>
          <h2 className="ol-h2" style={{ marginTop: 16 }}>{t.roadmap.title}</h2>
        </header>
      </div>
      <style>{`
        .section-head { text-align: center; max-width: 760px; margin: 0 auto; }
      `}</style>
    </section>
  );
}
