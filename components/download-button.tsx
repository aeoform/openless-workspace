"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DownloadIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { LATEST_RELEASE, useDownloadState, type Group, type PlatformOption } from "@/lib/release";

const GROUP_LABEL: Record<Group, string> = {
  macos: "macOS",
  windows: "Windows",
  linux: "Linux",
  android: "Android",
  harmony: "HarmonyOS",
};

const GROUP_ORDER: Group[] = ["macos", "windows", "linux", "android", "harmony"];

function size(bytes: number | null): string {
  if (!bytes) return "";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function DownloadButton({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { t } = useI18n();
  const { options, betaExtras, betaVersion, recommended, version, releasesHref, checksumsHref, mirror } =
    useDownloadState();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const mainLabel = recommended ? `${t.download.prefix} ${recommended.os} · ${recommended.arch}` : t.hero.cta_download;
  const mainHref = recommended?.href ?? LATEST_RELEASE;

  const groups = GROUP_ORDER.map((group) => ({
    group,
    items: options.filter((entry) => entry.group === group),
  })).filter((entry) => entry.items.length > 0);

  return (
    <div className={`dl-split ${variant === "dark" ? "is-dark" : ""}`} ref={wrapRef}>
      <div className="dl-split-main">
        {recommended ? (
          <a className="dl-split-primary" href={mainHref} rel="noreferrer" title={mainHref}>
            <DownloadIcon />
            <span>{mainLabel}</span>
            {recommended.size ? <em className="ol-mono">{size(recommended.size)}</em> : null}
          </a>
        ) : (
          // No installer for this OS in the current release: open the platform
          // menu instead of sending people to GitHub.
          <button type="button" className="dl-split-primary" onClick={() => setOpen(true)}>
            <DownloadIcon />
            <span>{t.download.choose}</span>
          </button>
        )}
        <button
          type="button"
          ref={buttonRef}
          className="dl-split-toggle"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={t.download.choose}
          onClick={() => setOpen((value) => !value)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="dl-menu" role="menu" aria-label={t.download.choose}>
          <div className="dl-menu-head">
            <span className="ol-mono">{t.download.choose}</span>
            {version ? <span className="ol-mono">v{version}</span> : null}
          </div>

          {groups.map(({ group, items }) => (
            <div className="dl-menu-group" key={group}>
              <span className="dl-menu-group-label ol-mono">{GROUP_LABEL[group]}</span>
              {items.map((entry) => (
                <MenuRow key={entry.key} entry={entry} onNavigate={() => setOpen(false)} />
              ))}
            </div>
          ))}

          {betaExtras.length > 0 && (
            <div className="dl-menu-group">
              <span className="dl-menu-group-label ol-mono">
                {t.downloadPage.betaTitle}
                {betaVersion ? ` · v${betaVersion}` : ""}
              </span>
              {betaExtras.map((entry) => (
                <MenuRow key={entry.key} entry={entry} beta onNavigate={() => setOpen(false)} />
              ))}
            </div>
          )}

          <div className="dl-menu-foot">
            <a href={releasesHref} target="_blank" rel="noreferrer">
              {t.platforms.allReleases} ↗
            </a>
            {checksumsHref && (
              <a href={checksumsHref} rel="noreferrer" onClick={() => setOpen(false)}>
                {t.platforms.checksums} ↓
              </a>
            )}
            {betaVersion && (
              <Link href="/download/" onClick={() => setOpen(false)}>
                {t.downloadPage.allBetas} ↗
              </Link>
            )}
            {mirror && (
              <a href={LATEST_RELEASE} target="_blank" rel="noreferrer" className="dl-menu-fallback">
                {t.download.githubFallback}
              </a>
            )}
          </div>
        </div>
      )}

      <style>{`
        .dl-split { position: relative; display: inline-flex; flex-direction: column; }
        .dl-split-main { display: inline-flex; align-items: stretch; border-radius: 999px; overflow: hidden; background: var(--ol-ink); box-shadow: 0 0 0 0 rgba(30,99,255,0); transition: box-shadow .25s; }
        .dl-split-main:hover { box-shadow: 0 10px 30px -10px rgba(30,99,255,0.55), 0 0 0 4px rgba(30,99,255,0.10); }
        .dl-split-primary { display: inline-flex; align-items: center; gap: 10px; padding: 14px 18px 14px 22px; color: #fff; font-size: 14.5px; font-weight: 500; white-space: nowrap; }
        button.dl-split-primary { border: 0; background: transparent; cursor: pointer; font-family: inherit; }
        .dl-split-primary em { font-style: normal; font-size: 11px; color: rgba(255,255,255,0.6); }
        .dl-split-toggle { display: grid; place-items: center; padding: 0 16px; border: 0; border-left: 1px solid rgba(255,255,255,0.18); background: transparent; color: #fff; cursor: pointer; transition: background .2s; }
        .dl-split-toggle:hover { background: rgba(255,255,255,0.10); }
        .dl-split-toggle:focus-visible, .dl-split-primary:focus-visible { outline: 2px solid var(--ol-blue); outline-offset: -3px; }

        .dl-menu {
          position: absolute; top: calc(100% + 10px); left: 0; z-index: 60;
          width: min(92vw, 420px); max-height: 62vh; overflow-y: auto;
          background: #fff; color: var(--ol-ink);
          border: 1px solid var(--ol-line-2); border-radius: 16px;
          box-shadow: 0 24px 60px -20px rgba(10,10,12,0.28);
          padding: 10px; text-align: left;
        }
        .dl-menu-head { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px 10px; border-bottom: 1px solid var(--ol-line); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ol-muted); }
        .dl-menu-group { padding: 10px 0 4px; }
        .dl-menu-group + .dl-menu-group { border-top: 1px solid var(--ol-line); }
        .dl-menu-group-label { display: block; padding: 0 10px 6px; font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ol-muted-2); }
        .dl-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 9px; transition: background .15s; }
        .dl-row:hover { background: var(--ol-bg-tint); }
        .dl-row-main { flex: 1; display: flex; align-items: baseline; gap: 8px; min-width: 0; }
        .dl-row-arch { font-size: 13px; }
        .dl-row-size { font-size: 11px; color: var(--ol-muted-2); }
        .dl-row-badge.is-beta { background: var(--ol-bg-tint); color: var(--ol-ink-2); }
        .dl-row-badge { font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 6px; border-radius: 999px; background: var(--ol-blue); color: #fff; }
        .dl-row-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .dl-row-get { font-size: 12px; color: var(--ol-blue); white-space: nowrap; }
        .dl-row-get:hover { text-decoration: underline; }
        .dl-row-pending { font-size: 11.5px; color: var(--ol-muted-2); }
        .dl-menu-foot { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding: 10px; border-top: 1px solid var(--ol-line); font-size: 11.5px; color: var(--ol-muted); }
        .dl-menu-foot a:hover { color: var(--ol-blue); }
        .dl-menu-fallback { margin-left: auto; color: var(--ol-muted-2); }
        .dl-menu-foot .ol-mono { margin-left: auto; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ol-muted-2); }

        .dl-split.is-dark .dl-split-main { background: #fff; }
        .dl-split.is-dark .dl-split-primary { color: var(--ol-ink); }
        .dl-split.is-dark .dl-split-primary em { color: var(--ol-muted); }
        .dl-split.is-dark .dl-split-toggle { color: var(--ol-ink); border-left-color: rgba(10,10,12,0.12); }
        .dl-split.is-dark .dl-split-toggle:hover { background: rgba(10,10,12,0.06); }

        @media (max-width: 560px) {
          .dl-split, .dl-split-main { width: 100%; }
          .dl-split-primary { flex: 1; justify-content: center; padding: 13px 12px; font-size: 13.5px; }
          .dl-split-toggle { padding: 0 14px; }
          .dl-menu { width: calc(100vw - 32px); left: 0; }
        }
      `}</style>
    </div>
  );
}

function MenuRow({
  entry,
  beta = false,
  onNavigate,
}: {
  entry: PlatformOption;
  beta?: boolean;
  onNavigate: () => void;
}) {
  const { t } = useI18n();
  const pending = !entry.href;

  return (
    <div className="dl-row" role="none">
      <div className="dl-row-main">
        <span className="dl-row-arch">{entry.arch}</span>
        {entry.size ? <span className="dl-row-size ol-mono">{size(entry.size)}</span> : null}
        {entry.recommended && <span className="dl-row-badge">{t.platforms.recommended}</span>}
        {beta && <span className="dl-row-badge is-beta">{t.platforms.beta}</span>}
      </div>

      {pending ? (
        <span className="dl-row-pending">
          {entry.group === "harmony" ? t.platforms.harmonyPending : t.platforms.notAvailable}
        </span>
      ) : (
        <div className="dl-row-actions">
          <a className="dl-row-get" href={entry.href!} rel="noreferrer" onClick={onNavigate} role="menuitem">
            {t.platforms.download} ↓
          </a>
        </div>
      )}
    </div>
  );
}
