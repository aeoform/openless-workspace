"use client";

import Link from "next/link";
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

function Row({ entry }: { entry: PlatformOption }) {
  const { t } = useI18n();
  const pending = !entry.href;

  return (
    <div className="pg-row">
      <div className="pg-row-main">
        <span className="pg-row-arch">{entry.arch}</span>
        {entry.recommended && <span className="pg-badge">{t.platforms.recommended}</span>}
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

export function DownloadView() {
  const { t } = useI18n();
  const { options, version, publishedAt, checksumsHref } = useDownloadState();
  const p = t.downloadPage;

  const groups = ORDER.map((group) => ({
    group,
    items: options.filter((entry) => entry.group === group),
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
          <div className="ol-container pg-grid">
            {groups.map(({ group, items }) => {
              const Icon = ICONS[group];
              const harmony = group === "harmony";
              return (
                <section key={group} className="pg-card" aria-labelledby={`pg-${group}`}>
                  <header className="pg-head">
                    <span className="pg-icon">
                      <Icon size={18} />
                    </span>
                    <h2 id={`pg-${group}`}>{group === "harmony" ? p.harmonyTitle : group.toUpperCase() === "MACOS" ? "macOS" : group[0].toUpperCase() + group.slice(1)}</h2>
                  </header>

                  {harmony ? (
                    <p className="pg-pending-block">{p.harmonyPending}</p>
                  ) : (
                    items.map((entry) => <Row key={entry.key} entry={entry} />)
                  )}
                </section>
              );
            })}
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
        .pg-foot { display: flex; justify-content: center; margin-top: 40px; }
        @media (max-width: 820px) { .pg-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
