"use client";
import { createContext, useState, useEffect, useContext } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Loading from '../components/Loading';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  const language = params?.lang || 'en';

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        let response = await fetch(`/locales/${language}.json`);
        if (!response.ok) {
          response = await fetch(`${window.location.origin}/locales/${language}.json`);
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (typeof data !== 'object' || data === null) {
          throw new Error('Invalid translation structure');
        }
        setTranslations(data);

        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('lang', language);

      } catch (error) {
        console.error('TRANSLATION LOAD ERROR:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  const changeLanguage = (newLang) => {
    if (newLang === language) return;
    const newPath = pathname === '/'
      ? `/${newLang}`
      : pathname.replace(/^\/\w{2}(\/|$)/, `/${newLang}$1`);
    router.push(newPath);
  };
  const t = (key, vars) => {
    if (isLoading) return key;
    const keys = key.split(".");
    let value = translations;
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    if (typeof value === 'string' && vars) {
      Object.entries(vars).forEach(([k, v]) => {
        value = value.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), v);
      });
    }
    return value || key;
  };
  // Show loading fallback until translations load
  if (isLoading || !minLoadingDone) {
    const handleMinDurationDone = () => setMinLoadingDone(true);

    return <Loading onLoaded={handleMinDurationDone} />;
  }
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
