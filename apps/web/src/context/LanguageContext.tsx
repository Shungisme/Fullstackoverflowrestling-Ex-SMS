"use client";
import { Language, TRANSLATIONS } from "../constants/translations";
import { createContext, useContext, useMemo, useState } from "react";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS[Language.VIETNAMESE]) => string;
}

const contextValue = {
    language: Language.VIETNAMESE,
    setLanguage: () => {},
    t: () => "",
};

const LanguageContext = createContext<LanguageContextType>(contextValue);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(Language.VIETNAMESE);

  const t = (key: keyof typeof TRANSLATIONS[Language.VIETNAMESE]) => {
    return TRANSLATIONS[language][key];
  };

  const value = useMemo(() => ({ language, setLanguage, t }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
