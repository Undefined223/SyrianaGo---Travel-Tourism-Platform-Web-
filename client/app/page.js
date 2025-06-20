"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from './components/Loading';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Client-side redirect based on stored preference or browser language
    const storedLang = localStorage.getItem('lang');
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'fr', 'ar'];
    
    const lang = supportedLangs.includes(storedLang) 
      ? storedLang 
      : supportedLangs.includes(browserLang) 
        ? browserLang 
        : 'en';
    
    router.replace(`/${lang}`);
  }, [router]);

  return (
   <Loading  />
  );
}