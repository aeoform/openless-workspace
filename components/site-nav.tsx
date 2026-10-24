"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";

export function Logo({ size = 24 }: { size?: number }) {
  return (
    <span className="ol-nav-logo">
      <Image src="/logo-128.png" alt="OpenLess" width={size} height={size} style={{ borderRadius: 6 }} />
      <span>OpenLess</span>
    </span>
  );
}

export function SiteNav({ active = "home" }: { active?: "home" | "docs" }) {
  const { lang, setLang, t } = useI18n();
  return (
    <header className="ol-nav">
      <div className="ol-container ol-nav-inner">
        <Link href="/"><Logo /></Link>
        <nav className="ol-nav-links">
          <Link href="/" className={active === "home" ? "active" : ""}>{t.nav.product}</Link>
          <a href="https://github.com/Open-Less/openless#readme" target="_blank" rel="noreferrer" className={active === "docs" ? "active" : ""}>{t.nav.docs}</a>
          <a href="https://github.com/Open-Less/openless" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
        <div className="ol-nav-right">
          <div className="ol-lang-switch" role="tablist">
            <button className={lang === "zh" ? "on" : ""} onClick={() => setLang("zh")}>中</button>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <a href="#download" className="ol-btn ol-btn-primary" style={{ padding: "10px 16px", fontSize: 13.5 }}>
            {t.nav.download}
            <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </header>
  );
}
