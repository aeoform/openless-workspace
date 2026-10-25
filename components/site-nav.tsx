"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";

export function Logo({ size = 24 }: { size?: number }) {
  return (
    <span className="ol-nav-logo">
      <Image src="/logo-128.png" alt="" width={size} height={size} style={{ borderRadius: 6 }} />
      <span>OpenLess</span>
    </span>
  );
}

export function SiteNav({ active = "home" }: { active?: "home" | "docs" | "download" }) {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="ol-nav">
      <div className="ol-container ol-nav-inner">
        <Link href="/" aria-label="OpenLess">
          <Logo />
        </Link>
        <nav className="ol-nav-links" aria-label={t.nav.product}>
          <Link href="/" className={active === "home" ? "active" : ""} aria-current={active === "home" ? "page" : undefined}>
            {t.nav.product}
          </Link>
          <Link href="/docs" className={active === "docs" ? "active" : ""} aria-current={active === "docs" ? "page" : undefined}>
            {t.nav.docs}
          </Link>
          <a href="https://github.com/Open-Less/openless" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
        <div className="ol-nav-right">
          <div className="ol-lang-switch" role="group" aria-label={t.nav.language}>
            <button type="button" className={lang === "zh" ? "on" : ""} aria-pressed={lang === "zh"} onClick={() => setLang("zh")}>
              中
            </button>
            <button type="button" className={lang === "en" ? "on" : ""} aria-pressed={lang === "en"} onClick={() => setLang("en")}>
              EN
            </button>
          </div>
          <Link href="/download" className="ol-btn ol-btn-primary ol-btn-sm">
            {t.nav.download}
            <ArrowRight className="arrow" />
          </Link>
        </div>
      </div>
    </header>
  );
}
