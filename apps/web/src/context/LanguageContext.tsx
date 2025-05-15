"use client";
import { TRANSLATIONS } from "../constants/translations";
import { Language } from "../constants/constants";
import { createContext, useContext, useMemo, useState } from "react";

interface LanguageContextType {
  language: Language;
  setLanguageHandler: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS[Language.VIETNAMESE]) => string;
}

const contextValue = {
    language: Language.VIETNAMESE,
    setLanguageHandler: () => {},
    t: () => "",
};

const LanguageContext = createContext<LanguageContextType>(contextValue);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Get the initial language from localStorage
  const initialLanguage = (typeof window !== "undefined" && localStorage.getItem("language")) as Language;
  const [language, setLanguage] = useState<Language>(initialLanguage || Language.VIETNAMESE);

  const t = (key: keyof typeof TRANSLATIONS[Language.VIETNAMESE]) => {
    return TRANSLATIONS[language][key];
  };

  const setLanguageHandler = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  const value = useMemo(() => ({ language, setLanguageHandler, t }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
