"use client";

import { GitHubIcon } from "@/components/icons";
import { Logo } from "@/components/site-nav";
import { FOOTER_LINKS, LATEST_RELEASE_URL, REPO_URL } from "@/lib/site";
import { useI18n } from "@/components/i18n-provider";

const COLUMNS = [
  { key: "product", links: FOOTER_LINKS.product },
  { key: "resource", links: FOOTER_LINKS.resource },
  { key: "community", links: FOOTER_LINKS.community },
] as const;

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="ol-footer">
      <div className="ol-container">
        <div className="ol-footer-grid">
          <div>
            <Logo />
            <p className="ol-footer-tag">{t.footer.tag}</p>
            <div className="ol-footer-pills">
              <a className="ol-pill" href={REPO_URL} target="_blank" rel="noreferrer">
                <GitHubIcon size={14} />
                GitHub
              </a>
              <a className="ol-pill" href={LATEST_RELEASE_URL} target="_blank" rel="noreferrer">
                Releases
              </a>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.key}>
              <h4>{t.footer[column.key]}</h4>
              <ul>
                {t.footer.links[column.key].map((label, index) => (
                  <li key={label}>
                    <a href={column.links[index]} target="_blank" rel="noreferrer">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ol-footer-bottom">
          <span>{t.footer.rights}</span>
          <span className="ol-footer-meta">
            <span>macOS · Windows · Linux</span>
            <span className="ol-footer-status">● MIT</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
