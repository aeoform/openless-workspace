"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useI18n } from "@/components/i18n-provider";
import { docsContent, type Block } from "@/lib/docs";

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="doc-p">{block.text}</p>;
    case "ul":
      return (
        <ul className="doc-ul">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre className="doc-code ol-mono">
          <code>{block.text}</code>
        </pre>
      );
    case "note":
      return <p className="doc-note">{block.text}</p>;
    case "table":
      return (
        <div className="doc-table-wrap">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{block.head[0]}</th>
                <th>{block.head[1]}</th>
              </tr>
            </thead>
            <tbody>
              {block.rows.map(([left, right]) => (
                <tr key={left}>
                  <td>{left}</td>
                  <td>{right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export function DocsView() {
  const { lang } = useI18n();
  const doc = docsContent[lang];
  const [activeId, setActiveId] = useState(doc.sections[0]?.id ?? "");

  // Highlight the section currently under the sticky header.
  useEffect(() => {
    const sections = doc.sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [doc]);

  return (
    <>
      <SiteNav active="docs" />
      <main className="ol-page-content">
        <section className="ol-section first doc-hero">
          <div className="ol-container">
            <span className="ol-eyebrow">
              <span className="dot" />
              {doc.eyebrow}
            </span>
            <h1 className="ol-h2 doc-title">{doc.title}</h1>
            <p className="doc-intro">{doc.intro}</p>
          </div>
        </section>

        <section className="ol-section tight doc-body">
          <div className="ol-container doc-layout">
            <nav className="doc-toc" aria-label={doc.toc}>
              <span className="ol-mono doc-toc-label">{doc.toc}</span>
              <ol>
                {doc.sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={activeId === section.id ? "is-active" : ""}
                      aria-current={activeId === section.id ? "true" : undefined}
                    >
                      <span className="ol-mono">{String(index + 1).padStart(2, "0")}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="doc-content">
              {doc.sections.map((section, index) => (
                <article key={section.id} id={section.id} className="doc-section">
                  <h2 className="doc-h2">
                    <span className="ol-mono doc-h2-index">{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </h2>
                  {section.blocks.map((block, blockIndex) => (
                    <BlockView key={blockIndex} block={block} />
                  ))}
                </article>
              ))}

              <div className="doc-next">
                <h3>{doc.next.title}</h3>
                <p>{doc.next.text}</p>
                <Link href="/download/" className="ol-btn ol-btn-primary">
                  {doc.next.cta}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />

      <style>{`
        .doc-hero { padding-bottom: 0; }
        .doc-title { margin-top: 16px; max-width: 820px; }
        .doc-intro { margin-top: 20px; max-width: 680px; color: var(--ol-ink-3); font-size: 16.5px; line-height: 1.7; }
        .doc-layout { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 64px; align-items: start; }
        .doc-toc { position: sticky; top: 96px; }
        .doc-toc-label { display: block; font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ol-muted-2); margin-bottom: 12px; }
        .doc-toc ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
        .doc-toc a { display: flex; gap: 10px; padding: 6px 8px; border-radius: 7px; font-size: 13.5px; color: var(--ol-ink-3); transition: background .15s, color .15s; }
        .doc-toc a:hover { background: var(--ol-bg-tint); color: var(--ol-ink); }
        .doc-toc a.is-active { background: var(--ol-bg-tint); color: var(--ol-ink); font-weight: 500; }
        .doc-toc a.is-active span { color: var(--ol-blue); }
        .doc-toc a span { font-size: 10.5px; color: var(--ol-muted-2); padding-top: 2px; }
        .doc-content { min-width: 0; display: flex; flex-direction: column; gap: 56px; }
        .doc-section { scroll-margin-top: 96px; }
        .doc-h2 { display: flex; align-items: baseline; gap: 12px; font-size: clamp(24px, 2.6vw, 32px); font-weight: 500; letter-spacing: -0.02em; margin: 0 0 16px; }
        .doc-h2-index { font-size: 11px; letter-spacing: 0.16em; color: var(--ol-blue); }
        .doc-p { margin: 0 0 14px; color: var(--ol-ink-3); font-size: 15.5px; line-height: 1.75; }
        .doc-ul { margin: 0 0 16px; padding-left: 18px; display: grid; gap: 8px; color: var(--ol-ink-3); font-size: 15px; line-height: 1.65; }
        .doc-ul li::marker { color: var(--ol-blue); }
        .doc-code { margin: 0 0 16px; padding: 16px 18px; background: var(--ol-ink); color: #fff; border-radius: 12px; font-size: 12.5px; line-height: 1.6; overflow-x: auto; }
        .doc-code code { font-family: var(--ol-mono); white-space: pre; }
        .doc-note { margin: 0 0 16px; padding: 12px 16px; border-left: 2px solid var(--ol-blue); background: var(--ol-blue-soft); color: var(--ol-blue-ink); font-size: 14px; line-height: 1.65; border-radius: 0 8px 8px 0; }
        .doc-table-wrap { margin: 0 0 18px; border: 1px solid var(--ol-line); border-radius: 12px; overflow-x: auto; }
        .doc-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .doc-table th, .doc-table td { text-align: left; padding: 11px 16px; border-bottom: 1px solid var(--ol-line); vertical-align: top; }
        .doc-table th { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ol-muted); font-weight: 500; background: var(--ol-bg-soft); }
        .doc-table td { color: var(--ol-ink-3); line-height: 1.6; }
        .doc-table tr:last-child td { border-bottom: 0; }
        .doc-table td:first-child { color: var(--ol-ink); width: 32%; }
        .doc-next { margin-top: 8px; padding: 32px; border-radius: var(--ol-radius-lg); background: var(--ol-ink); color: #fff; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
        .doc-next h3 { margin: 0; font-size: 22px; font-weight: 500; }
        .doc-next p { margin: 0 0 8px; color: rgba(255,255,255,0.65); font-size: 14.5px; line-height: 1.6; max-width: 520px; }
        .doc-next .ol-btn-primary { background: #fff; color: var(--ol-ink); }
        @media (max-width: 900px) {
          .doc-layout { grid-template-columns: 1fr; gap: 32px; }
          .doc-toc { position: static; }
          .doc-toc ol { display: flex; flex-wrap: wrap; gap: 6px; }
          .doc-toc a { border: 1px solid var(--ol-line); }
        }
      `}</style>
    </>
  );
}
