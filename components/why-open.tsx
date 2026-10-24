"use client";

import { useI18n } from "@/components/i18n-provider";
import { MagicCard } from "@/components/ui/magic-card";

function WhyIcon({ i, size = 18 }: { i: number; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (i === 0) {
    return (
      <svg {...props}>
        <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z"/>
        <circle cx="12" cy="13" r="2" fill="currentColor" stroke="none"/>
      </svg>
    );
  }
  if (i === 1) {
    return (
      <svg {...props}>
        <circle cx="8" cy="12" r="4"/>
        <path d="M12 12h10M18 12v4M21 12v3"/>
      </svg>
    );
  }
  if (i === 2) {
    return (
      <svg {...props}>
        <path d="M3 6h18M3 12h18M3 18h12"/>
        <circle cx="20" cy="18" r="2.5" fill="currentColor" stroke="none"/>
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M12 2a4 4 0 00-4 4v6a4 4 0 008 0V6a4 4 0 00-4-4z"/>
      <path d="M5 11a7 7 0 0014 0M12 18v3"/>
    </svg>
  );
}

export function WhyOpen() {
  const { t } = useI18n();
  return (
    <section className="ol-section why-section">
      <div className="ol-container">
        <div className="why-grid">
          {/* LEFT: title + asymmetric scattered decor */}
          <aside className="why-left">
            <span className="ol-eyebrow"><span className="dot" />{t.why.eyebrow}</span>
            <h2 className="ol-h2 why-left-title" style={{ whiteSpace: "pre-line" }}>{t.why.title}</h2>
            <p className="why-left-desc">{t.why.sub}</p>

            {/* offset decorative elements */}
            <span className="why-decor why-decor-a ol-serif" aria-hidden="true">local · open · yours</span>
            <span className="why-decor why-decor-b ol-mono" aria-hidden="true">MIT</span>
            <span className="why-decor why-decor-c" aria-hidden="true"><WhyIcon i={0} size={36} /></span>
            <span className="why-decor why-decor-d" aria-hidden="true"><WhyIcon i={2} size={28} /></span>
          </aside>

          {/* RIGHT: vertical stack of compact MagicCards */}
          <div className="why-right">
            {t.why.cards.map((c, i) => (
              <MagicCard
                key={i}
                gradientColor="#1E63FF20"
                gradientOpacity={0.18}
                className="why-card"
              >
                <div className="why-card-meta">
                  <span className="why-card-num ol-mono">0{i + 1}</span>
                  <span className="why-card-key">{c.k}</span>
                  <span className="why-card-icon"><WhyIcon i={i} size={16} /></span>
                </div>
                <h3 className="why-card-title">{c.t}</h3>
                <p className="why-card-desc">{c.d}</p>
              </MagicCard>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .why-section { padding: 120px 0; }
        .why-grid {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          gap: 80px;
          align-items: start;
        }
        .why-left {
          position: sticky; top: 120px;
          padding-right: 16px;
          min-height: 480px;
        }
        .why-left-title { margin-top: 16px; }
        .why-left-desc {
          margin-top: 24px;
          color: var(--ol-ink-3);
          font-size: 16px;
          line-height: 1.65;
          max-width: 380px;
        }
        .why-decor {
          position: absolute;
          color: var(--ol-muted-2);
          opacity: 0.8;
          pointer-events: none;
        }
        .why-decor-a {
          top: 260px; right: 24px;
          font-size: 22px;
          color: var(--ol-blue);
          opacity: 0.55;
        }
        .why-decor-b {
          top: 360px; right: 100px;
          font-size: 11px;
          letter-spacing: 0.18em;
          padding: 4px 10px;
          border: 1px dashed var(--ol-line-2);
          border-radius: 999px;
          color: var(--ol-muted);
          background: rgba(255,255,255,0.6);
        }
        .why-decor-c {
          top: 410px; left: 12px;
          color: var(--ol-blue);
          opacity: 0.32;
        }
        .why-decor-d {
          top: 460px; right: 56px;
          color: var(--ol-ink-3);
          opacity: 0.28;
        }
        .why-right {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .why-card {
          padding: 22px 24px;
          border-radius: var(--ol-radius-lg);
          border: 1px solid var(--ol-line);
          background: #fff;
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .why-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--ol-shadow-soft);
        }
        .why-card:nth-child(2) { transform: translateX(28px); }
        .why-card:nth-child(2):hover { transform: translateX(28px) translateY(-2px); }
        .why-card:nth-child(4) { transform: translateX(14px); }
        .why-card:nth-child(4):hover { transform: translateX(14px) translateY(-2px); }
        .why-card-meta {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 8px;
          color: var(--ol-blue);
        }
        .why-card-num { font-size: 11px; letter-spacing: 0.18em; opacity: 0.7; }
        .why-card-key {
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .why-card-icon { margin-left: auto; opacity: 0.7; }
        .why-card-title {
          margin: 0 0 6px;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ol-ink);
        }
        .why-card-desc {
          margin: 0;
          color: var(--ol-ink-3);
          font-size: 13.5px;
          line-height: 1.6;
        }
        @media (max-width: 900px) {
          .why-grid { grid-template-columns: 1fr; gap: 32px; }
          .why-left { position: static; min-height: auto; padding-right: 0; }
          .why-decor { display: none; }
          .why-card,
          .why-card:nth-child(2),
          .why-card:nth-child(4) { transform: none; }
        }
      `}</style>
    </section>
  );
}
