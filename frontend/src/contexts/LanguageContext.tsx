import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Language } from "../types/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("language") as Language) || "fin"
  );

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
