"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <main className="ol-page-content">
      <section className="ol-section first">
        <div className="ol-container nf-wrap">
          <span className="ol-mono nf-code">404</span>
          <h1 className="ol-h2">{t.notFound.title}</h1>
          <p className="nf-desc">{t.notFound.desc}</p>
          <div className="nf-actions">
            <Link href="/" className="ol-btn ol-btn-primary">
              {t.notFound.home}
            </Link>
            <Link href="/#download" className="ol-btn ol-btn-ghost">
              {t.notFound.download}
            </Link>
          </div>
        </div>
      </section>
      <style>{`
        .nf-wrap { max-width: 560px; padding: 80px 0 120px; display: flex; flex-direction: column; gap: 16px; }
        .nf-code { font-size: 13px; letter-spacing: 0.3em; color: var(--ol-blue); }
        .nf-desc { color: var(--ol-ink-3); font-size: 16px; line-height: 1.6; margin: 0; }
        .nf-actions { display: flex; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
      `}</style>
    </main>
  );
}
