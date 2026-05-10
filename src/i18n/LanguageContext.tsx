import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import vi, { type Translations } from '@/i18n/vi';
import en from '@/i18n/en';

export type Language = 'vi' | 'en';

interface LanguageContextValue {
  lang: Language;
  t: Translations;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'tini-lang';

const translations: Record<Language, Translations> = { vi, en };

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    return saved === 'en' ? 'en' : 'vi';
  });

  const toggle = () =>
    setLang((prev) => {
      const next: Language = prev === 'vi' ? 'en' : 'vi';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, t: translations[lang], toggle }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLang = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
};