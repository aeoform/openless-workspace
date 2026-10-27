"use client";

import Link from "next/link";
import { useState } from "react";
import { AndroidIcon, AppleIcon, DownloadIcon, HarmonyIcon, LinuxIcon, WindowsIcon } from "@/components/icons";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useI18n } from "@/components/i18n-provider";
import { useDownloadState, type Group, type PlatformOption } from "@/lib/release";

const ICONS: Record<Group, (props: { size?: number }) => React.ReactElement> = {
  macos: AppleIcon,
  windows: WindowsIcon,
  linux: LinuxIcon,
  android: AndroidIcon,
  harmony: HarmonyIcon,
};

const ORDER: Group[] = ["macos", "windows", "linux", "android", "harmony"];

function sizeLabel(bytes: number | null): string {
  return bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : "";
}

function Row({ entry, beta = false }: { entry: PlatformOption; beta?: boolean }) {
  const { t } = useI18n();
  const pending = !entry.href;

  return (
    <div className="pg-row">
      <div className="pg-row-main">
        <span className="pg-row-arch">{entry.arch}</span>
        {entry.recommended && <span className="pg-badge">{t.platforms.recommended}</span>}
        {beta && <span className="pg-badge is-beta">{t.platforms.beta}</span>}
      </div>
      <div className="pg-row-side">
        {pending ? (
          <span className="pg-pending">{t.platforms.notAvailable}</span>
        ) : (
          <>
            <span className="pg-size ol-mono">{sizeLabel(entry.size)}</span>
            <a className="ol-btn ol-btn-primary ol-btn-sm" href={entry.href!} rel="noreferrer">
              <DownloadIcon size={14} />
              {t.platforms.download}
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function PlatformCard({
  group,
  items,
  beta,
}: {
  group: Group;
  items: PlatformOption[];
  beta: boolean;
}) {
  const { t } = useI18n();
  const Icon = ICONS[group];
  const title = group === "macos" ? "macOS" : group === "harmony" ? "HarmonyOS" : group[0].toUpperCase() + group.slice(1);
  const pendingText = group === "harmony" ? t.downloadPage.harmonyPending : t.platforms.notAvailable;

  return (
    <section className="pg-card" aria-labelledby={`pg-${beta ? "beta-" : ""}${group}`}>
      <header className="pg-head">
        <span className="pg-icon">
          <Icon size={18} />
        </span>
        <h2 id={`pg-${beta ? "beta-" : ""}${group}`}>{title}</h2>
      </header>

      {items.length === 0 ? (
        <p className="pg-pending-block">{pendingText}</p>
      ) : (
        items.map((entry) => <Row key={entry.key} entry={entry} beta={beta} />)
      )}
    </section>
  );
}

export function DownloadView() {
  const { t } = useI18n();
  const { options, betaOptions, betaVersion, version, publishedAt, checksumsHref } =
    useDownloadState();
  const [channel, setChannel] = useState<"stable" | "beta">("stable");
  const beta = channel === "beta";
  const p = t.downloadPage;

  // Stable always shows every platform (pending ones included); the pre-release
  // tab only lists what actually exists there. Both grids are rendered so the
  // page works without JS and the link audit can see every installer.
  const stableGroups = ORDER.map((group) => ({
    group,
    items: options.filter((entry) => entry.group === group),
  }));
  const betaGroups = ORDER.map((group) => ({
    group,
    items: betaOptions.filter((entry) => entry.group === group),
  })).filter((entry) => entry.items.length > 0);

  return (
    <>
      <SiteNav active="download" />
      <main className="ol-page-content">
        <section className="ol-section first pg-hero">
          <div className="ol-container">
            <span className="ol-eyebrow">
              <span className="dot" />
              {p.eyebrow}
            </span>
            <h1 className="ol-h2 pg-title">{p.title}</h1>
            <p className="pg-sub">{p.sub}</p>

            <div className="pg-meta">
              {version && (
                <span className="ol-pill">
                  {p.versionLabel} · v{version}
                </span>
              )}
              {publishedAt && (
                <span className="ol-pill">
                  {p.publishedLabel} · {publishedAt.slice(0, 10)}
                </span>
              )}
              {checksumsHref && (
                <a className="ol-pill blue" href={checksumsHref} rel="noreferrer">
                  {p.checksums} ↓
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="ol-section tight">
          <div className="ol-container pg-channels">
            <div className="pg-tabs" role="tablist" aria-label={p.stableTitle}>
              <button
                type="button"
                role="tab"
                aria-selected={!beta}
                className={!beta ? "is-on" : ""}
                onClick={() => setChannel("stable")}
              >
                {p.stableTitle}
                {version && <span className="ol-mono">v{version}</span>}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={beta}
                className={beta ? "is-on" : ""}
                disabled={betaOptions.length === 0}
                onClick={() => setChannel("beta")}
              >
                {p.betaTitle}
                {betaVersion && <span className="ol-mono">v{betaVersion}</span>}
              </button>
            </div>
            <p className="pg-tabs-note">{beta ? p.betaNote : p.betaSwitch}</p>
          </div>

          <div className="ol-container pg-grid" hidden={beta}>
            {stableGroups.map(({ group, items }) => (
              <PlatformCard key={group} group={group} items={items} beta={false} />
            ))}
          </div>

          <div className="ol-container pg-grid" hidden={!beta}>
            {betaGroups.map(({ group, items }) => (
              <PlatformCard key={`beta-${group}`} group={group} items={items} beta />
            ))}
          </div>

          <div className="ol-container pg-foot">
            <Link href="/docs/#install" className="ol-btn ol-btn-ghost">
              {p.docsCta}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />

      <style>{`
        .pg-hero { padding-bottom: 0; }
        .pg-title { margin-top: 16px; max-width: 760px; }
        .pg-sub { margin: 20px 0 0; max-width: 620px; color: var(--ol-ink-3); font-size: 16.5px; line-height: 1.7; }
        .pg-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
        .pg-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .pg-grid[hidden] { display: none; }
        .pg-card { border: 1px solid var(--ol-line); border-radius: var(--ol-radius-lg); background: #fff; padding: 20px 22px; }
        .pg-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .pg-head h2 { margin: 0; font-size: 16px; font-weight: 500; letter-spacing: -0.01em; }
        .pg-icon { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px; background: var(--ol-bg-tint); color: var(--ol-ink-2); }
        .pg-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 0; border-top: 1px solid var(--ol-line); }
        .pg-row:first-of-type { border-top: 0; }
        .pg-row-main { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .pg-row-arch { font-size: 14px; color: var(--ol-ink); }
        .pg-row-side { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .pg-size { font-size: 11.5px; color: var(--ol-muted-2); }
        .pg-badge { font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 6px; border-radius: 999px; background: var(--ol-blue); color: #fff; }
        .pg-pending { font-size: 11.5px; color: var(--ol-muted-2); }
        .pg-pending-block { margin: 0; color: var(--ol-muted); font-size: 13.5px; line-height: 1.6; }
        .pg-channels { margin-bottom: 18px; }
        .pg-tabs { display: inline-flex; gap: 4px; padding: 4px; border: 1px solid var(--ol-line-2); border-radius: 999px; background: #fff; }
        .pg-tabs button {
          display: inline-flex; align-items: center; gap: 8px;
          border: 0; border-radius: 999px; background: transparent; cursor: pointer;
          padding: 8px 16px; font-size: 13.5px; font-family: inherit; color: var(--ol-muted);
          transition: background .15s, color .15s;
        }
        .pg-tabs button:hover:not(:disabled) { color: var(--ol-ink); }
        .pg-tabs button.is-on { background: var(--ol-ink); color: #fff; }
        .pg-tabs button:disabled { opacity: 0.4; cursor: not-allowed; }
        .pg-tabs button .ol-mono { font-size: 11px; opacity: 0.7; }
        .pg-tabs button:focus-visible { outline: 2px solid var(--ol-blue); outline-offset: 2px; }
        .pg-tabs-note { margin: 12px 0 0; max-width: 640px; color: var(--ol-muted); font-size: 13px; line-height: 1.6; }
        .pg-beta { margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--ol-line); }
        .pg-beta-head { margin-bottom: 18px; }
        .pg-beta-head h2 { margin: 0 0 8px; font-size: 16px; font-weight: 500; display: flex; align-items: center; gap: 10px; }
        .pg-beta-head h2 .ol-mono { font-size: 12px; color: var(--ol-muted-2); font-weight: 400; }
        .pg-beta-head p { margin: 0; max-width: 640px; color: var(--ol-muted); font-size: 13.5px; line-height: 1.65; }
        .pg-badge.is-beta { background: var(--ol-bg-tint); color: var(--ol-ink-2); border: 1px solid var(--ol-line-2); }
        .pg-foot { display: flex; justify-content: center; margin-top: 40px; }
        @media (max-width: 820px) { .pg-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
