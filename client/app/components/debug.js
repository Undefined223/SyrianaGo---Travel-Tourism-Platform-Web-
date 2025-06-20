"use client";
import { useEffect } from 'react';

export default function TranslationDebugger() {
  useEffect(() => {
    const testLoad = async () => {
      try {
        const response = await fetch('/locales/en.json');
        console.log('English translations status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('English translations content:', data);
        }
      } catch (error) {
        console.error('Failed to test load en.json:', error);
      }
    };
    
    testLoad();
  }, []);

  return null;
}