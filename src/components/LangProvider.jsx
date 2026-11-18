import { useEffect, useState } from "react";
import { LangContext, dict } from "@/lib/i18n";

const STORAGE_KEY = "blueflix_lang";

export function LangProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "hi") setLangState(saved);
    } catch {
      // ignore
    }
  }, []);

  const setLang = (l) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</LangContext.Provider>
  );
}
