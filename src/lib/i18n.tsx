"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language } from "@/data/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const fallbackLanguageContext: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: translations.en,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Persist language preference
  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "en" || saved === "kh")) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    if (lang === 'kh') {
      document.body.classList.add('lang-kh');
    } else {
      document.body.classList.remove('lang-kh');
    }
  };

  // Set initial class on mount
  useEffect(() => {
    if (language === 'kh') {
      document.body.classList.add('lang-kh');
    } else {
      document.body.classList.remove('lang-kh');
    }
  }, [language]);

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    if (process.env.NODE_ENV === "development") {
      console.warn("useLanguage: LanguageProvider missing; using English fallback.");
    }
    return fallbackLanguageContext;
  }
  return context;
}

