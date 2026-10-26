"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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

const LINKS = [
  { key: "product", href: "/" },
  { key: "docs", href: "/docs/" },
] as const;

export function SiteNav({ active = "home" }: { active?: "home" | "docs" | "download" }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

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
          <a href="https://github.com/Open-Less/openless" target="_blank" rel="noreferrer" onClick={close}>
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
          <button
            type="button"
            className="ol-nav-burger"
            aria-expanded={open}
            aria-controls="ol-nav-drawer"
            aria-label={t.nav.menu}
            onClick={() => setOpen((value) => !value)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="ol-nav-drawer" className="ol-nav-drawer">
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={active === link.key ? "active" : ""}
              aria-current={active === link.key ? "page" : undefined}
              onClick={close}
            >
              {t.nav[link.key]}
            </Link>
          ))}
          <a href="https://github.com/Open-Less/openless" target="_blank" rel="noreferrer" onClick={close}>
            GitHub ↗
          </a>
        </div>
      )}
    </header>
  );
}
