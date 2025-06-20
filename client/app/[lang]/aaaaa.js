"use client";
import { useLanguage } from "../contexts/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{t('welcome')}</h1>
      <div className={t('home') === 'الرئيسية' ? 
          "text-right border-r-4 pr-4" : 
          "text-left border-l-4 pl-4"}>
        <p>{t('home')} content with dynamic alignment</p>
      </div>
    </div>
  );
}