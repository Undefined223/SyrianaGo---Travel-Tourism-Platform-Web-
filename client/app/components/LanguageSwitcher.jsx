'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="relative group">
      <div className="flex items-center space-x-1 px-3 py-2 rounded-md bg-gray-50 text-gray-700 hover:bg-green-100 cursor-pointer transition-colors">
        <Globe className="w-5 h-5 text-gray-600" />
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-transparent focus:outline-none text-sm cursor-pointer appearance-none"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="ar">العربية</option>
        </select>
      </div>
    </div>
  );
}
