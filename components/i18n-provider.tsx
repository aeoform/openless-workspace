"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { i18nContent, type I18n, type Lang } from "@/lib/i18n-content";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: I18n };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ol-lang") as Lang | null;
      if (stored === "zh" || stored === "en") setLangState(stored);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("ol-lang", l); } catch {}
  };

  return (
    <I18nCtx.Provider value={{ lang, setLang, t: i18nContent[lang] as I18n }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
