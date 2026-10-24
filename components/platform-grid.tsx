"use client";

import { AppleIcon, AndroidIcon, ArrowRight, HarmonyIcon, LinuxIcon, WindowsIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { useDownloadTargets, useLatestRelease, type AssetSlot, type Platform } from "@/lib/release";
import { REPO_URL } from "@/lib/site";

type Card = {
  key: string;
  os: string;
  arch: string;
  Icon: (props: { size?: number }) => React.ReactElement;
  slots: AssetSlot[];
  detected: Platform;
  note?: "macArch" | "linuxPending" | "harmony";
  href?: string;
};

const CARDS: Card[] = [
  { key: "mac-arm", os: "macOS", arch: "Apple Silicon", Icon: AppleIcon, slots: ["macosArm"], detected: "macos", note: "macArch" },
  { key: "mac-intel", os: "macOS", arch: "Intel", Icon: AppleIcon, slots: ["macosIntel"], detected: "macos", note: "macArch" },
  { key: "windows", os: "Windows", arch: "x64", Icon: WindowsIcon, slots: ["windowsX64", "windowsMSI"], detected: "windows" },
  { key: "linux", os: "Linux", arch: "deb / rpm", Icon: LinuxIcon, slots: ["linuxDeb", "linuxRpm"], detected: "linux", note: "linuxPending" },
  { key: "android", os: "Android", arch: "arm64-v8a", Icon: AndroidIcon, slots: ["androidArm64", "androidArmv7", "androidX86_64", "androidX86"], detected: "other" },
  {
    key: "harmony",
    os: "HarmonyOS",
    arch: "NEXT",
    Icon: HarmonyIcon,
    slots: [],
    detected: "other",
    note: "harmony",
    href: `${REPO_URL}/tree/main/openless-all/app/harmony`,
  },
];

function formatSize(bytes: number | undefined): string {
  if (!bytes || bytes <= 0) return "";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function PlatformGrid() {
  const { t } = useI18n();
  const release = useLatestRelease();
  const { primary, detected, version, href, checksums } = useDownloadTargets();
  const p = t.platforms;

  return (
    <section className="ol-section platforms-section" id="platforms">
      <div className="ol-container">
        <header className="section-head">
          <span className="ol-eyebrow">
            <span className="dot" />
            {p.eyebrow}
          </span>
          <h2 className="ol-h2">{p.title}</h2>
          <p className="section-sub">{p.sub}</p>
        </header>

        <div className="pf-grid">
          {CARDS.map((card) => {
            const assets = card.slots.map((slot) => ({ slot, asset: release?.assets?.[slot] })).filter((entry) => entry.asset);
            const [main, ...others] = assets;
            const recommended = card.detected === detected && card.slots.includes(primary?.id as AssetSlot);
            const disabled = assets.length === 0;

            return (
              <article key={card.key} className={`pf-card ${recommended ? "is-recommended" : ""} ${disabled ? "is-pending" : ""}`}>
                <div className="pf-head">
                  <span className="pf-icon">
                    <card.Icon size={18} />
                  </span>
                  <div className="pf-name">
                    <strong>{card.os}</strong>
                    <span className="ol-mono">{card.arch}</span>
                  </div>
                  {recommended && <span className="pf-badge">{p.recommended}</span>}
                </div>

                {main?.asset ? (
                  <>
                    <p className="pf-file ol-mono" title={main.asset.name}>
                      {main.asset.name}
                    </p>
                    <div className="pf-actions">
                      <a className="ol-btn ol-btn-primary ol-btn-sm" href={main.asset.url} target="_blank" rel="noreferrer">
                        {p.download}
                      </a>
                      <span className="pf-size ol-mono">{formatSize(main.asset.size)}</span>
                    </div>
                  </>
                ) : (
                  <div className="pf-pending">
                    <p className="pf-file ol-mono">
                      {card.note === "harmony" ? p.harmonyPending : p.notAvailable}
                    </p>
                    <a className="ol-btn ol-btn-ghost ol-btn-sm" href={card.href ?? href} target="_blank" rel="noreferrer">
                      {card.note === "harmony" ? p.harmonyLink : p.allReleases}
                      <ArrowRight size={12} />
                    </a>
                  </div>
                )}

                {others.length > 0 && (
                  <div className="pf-others">
                    <span className="ol-mono">{p.otherBuilds}</span>
                    {others.map((entry) => (
                      <a key={entry.slot} href={entry.asset!.url} target="_blank" rel="noreferrer" className="ol-mono">
                        {entry.asset!.name.split("_").pop()}
                      </a>
                    ))}
                  </div>
                )}

                {card.note === "macArch" && recommended && <p className="pf-note">{p.macArchNote}</p>}
              </article>
            );
          })}
        </div>

        <div className="pf-foot">
          <span className="ol-mono">
            {version ? `v${version}` : p.latest}
            {release?.publishedAt ? ` · ${release.publishedAt.slice(0, 10)}` : ""}
          </span>
          <span className="pf-links">
            <a href={href} target="_blank" rel="noreferrer">
              {p.allReleases} ↗
            </a>
            {checksums && (
              <a href={checksums.href} target="_blank" rel="noreferrer">
                {p.checksums} ↗
              </a>
            )}
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </span>
        </div>
      </div>

      <style>{`
        .pf-grid { margin-top: 48px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .pf-card {
          display: flex; flex-direction: column; gap: 12px;
          background: #fff; border: 1px solid var(--ol-line);
          border-radius: var(--ol-radius-lg); padding: 22px;
          transition: border-color .2s, box-shadow .2s, transform .2s;
        }
        .pf-card:hover { border-color: var(--ol-line-2); box-shadow: var(--ol-shadow-soft); }
        .pf-card.is-recommended { border-color: var(--ol-blue); box-shadow: 0 0 0 3px rgba(30,99,255,0.10); }
        .pf-card.is-pending { background: var(--ol-bg-soft); }
        .pf-head { display: flex; align-items: center; gap: 10px; }
        .pf-icon {
          display: grid; place-items: center; width: 32px; height: 32px;
          border-radius: 9px; background: var(--ol-bg-tint); color: var(--ol-ink-2);
        }
        .pf-name { display: flex; flex-direction: column; line-height: 1.25; }
        .pf-name strong { font-size: 14.5px; font-weight: 500; }
        .pf-name span { font-size: 11px; color: var(--ol-muted); letter-spacing: 0.04em; }
        .pf-badge {
          margin-left: auto; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 3px 8px; border-radius: 999px; background: var(--ol-blue); color: #fff;
        }
        .pf-file { margin: 0; font-size: 11.5px; color: var(--ol-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pf-actions { display: flex; align-items: center; gap: 10px; }
        .pf-size { font-size: 11px; color: var(--ol-muted-2); }
        .pf-pending { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
        .pf-others { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; font-size: 11px; color: var(--ol-muted); }
        .pf-others > span { letter-spacing: 0.12em; text-transform: uppercase; opacity: .7; }
        .pf-others a { color: var(--ol-ink-3); border-bottom: 1px dashed var(--ol-line-2); }
        .pf-others a:hover { color: var(--ol-blue); border-color: var(--ol-blue); }
        .pf-note { margin: 0; font-size: 11px; color: var(--ol-muted-2); margin-top: auto; }
        .pf-foot {
          margin-top: 28px; padding-top: 20px; border-top: 1px solid var(--ol-line);
          display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;
          font-size: 11.5px; color: var(--ol-muted);
        }
        .pf-links { display: flex; gap: 16px; flex-wrap: wrap; }
        .pf-links a:hover { color: var(--ol-blue); }
        @media (max-width: 900px) { .pf-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 620px) { .pf-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
