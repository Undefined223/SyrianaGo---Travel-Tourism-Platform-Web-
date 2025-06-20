'use client';

import { useState, useRef, useEffect } from 'react';
import { User, LogIn, UserPlus, Settings, Heart, Calendar, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useParams, usePathname } from 'next/navigation';


const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, loading } = useUser();
  const { t, language } = useLanguage();
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale || 'en';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Icon Button - matches your search/call icon style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group relative"
      >
        {user ? (
          // Logged in - show avatar or initials
          user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )
        ) : (
          // Not logged in - show user icon
          <User className="w-5 h-5 text-gray-600 group-hover:text-green-600 transition-colors" />
        )}

        {/* Online indicator for logged-in users */}
        {user && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          {user ? (
            // Logged in menu
            <>
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">




                <Link
                  href={`/${language}/dashboard`}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>{t('user.settings')}</span>
                </Link>

                {/* Divider */}
                <div className="border-t border-gray-100 my-1"></div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('auth.logout')}</span>
                </button>
              </div>
            </>
          ) : (
            // Not logged in menu
            <div className="py-1">
              <Link
                href={`/${locale}/login`}
                className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                <span>{t('auth.login')}</span>
              </Link>
              <Link
                href={`/${locale}/register`}
                className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus className="w-4 h-4" />
                <span>{t('auth.register')}</span>
              </Link>

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;