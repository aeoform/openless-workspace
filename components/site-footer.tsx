"use client";

import { Logo } from "@/components/site-nav";
import { useI18n } from "@/components/i18n-provider";

const REPO = "https://github.com/Open-Less/openless";
const FOOTER_LINKS = {
  product: [
    `${REPO}/releases`,                  // 下载 / Download
    `${REPO}#readme`,                    // 文档 / Docs
    `${REPO}#roadmap`,                   // Roadmap
    `${REPO}/releases`,                  // Changelog
  ],
  resource: [
    REPO,                                // GitHub
    `${REPO}/blob/main/USAGE.md`,        // USAGE.md
    `${REPO}#architecture`,              // 技术架构 / Architecture
    `${REPO}#compare`,                   // 对比 / Compare
  ],
  community: [
    `${REPO}/issues`,                    // Issues
    `${REPO}/discussions`,               // Discussions
    `${REPO}/releases`,                  // Releases
    `${REPO}/blob/main/LICENSE`,         // MIT License
  ],
} as const;

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="ol-footer">
      <div className="ol-container">
        <div className="ol-footer-grid">
          <div>
            <Logo />
            <p style={{ marginTop: 14, fontSize: 13.5, color: "var(--ol-muted)", maxWidth: 320, lineHeight: 1.6 }}>
              {t.footer.tag}
            </p>
            <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
              <a className="ol-pill" href={REPO} target="_blank" rel="noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4 1 0 2 .1 3 .4 2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>
                GitHub
              </a>
              <a className="ol-pill" href={`${REPO}/releases/latest`} target="_blank" rel="noreferrer">Releases</a>
            </div>
          </div>
          <div>
            <h4>{t.footer.product}</h4>
            <ul>{t.footer.links.product.map((l, i) => (
              <li key={l}><a href={FOOTER_LINKS.product[i]} target="_blank" rel="noreferrer">{l}</a></li>
            ))}</ul>
          </div>
          <div>
            <h4>{t.footer.resource}</h4>
            <ul>{t.footer.links.resource.map((l, i) => (
              <li key={l}><a href={FOOTER_LINKS.resource[i]} target="_blank" rel="noreferrer">{l}</a></li>
            ))}</ul>
          </div>
          <div>
            <h4>{t.footer.community}</h4>
            <ul>{t.footer.links.community.map((l, i) => (
              <li key={l}><a href={FOOTER_LINKS.community[i]} target="_blank" rel="noreferrer">{l}</a></li>
            ))}</ul>
          </div>
        </div>
        <div className="ol-footer-bottom">
          <span>{t.footer.rights}</span>
          <span style={{ display: "flex", gap: 16 }}>
            <span>macOS · Windows · Linux</span>
            <span style={{ color: "var(--ol-blue)" }}>● status: shipping</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
