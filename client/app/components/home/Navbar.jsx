'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, PhoneCall, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import LanguageSwitcher from '../LanguageSwitcher';
import UserDropdown from '../UserMenu';
import { useLanguage } from '@/app/contexts/LanguageContext';

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { t, language } = useLanguage();

  // Load custom font
  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace('Tennyson', 'url(/assets/fonts/Tennyson.ttf)');
        await font.load();
        document.fonts.add(font);
      } catch (error) {
        console.log('Failed to load Tennyson font:', error);
      }
    };
    loadFont();
  }, []);

  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setActiveSection(id);
    }
  };

  // Scroll spy to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'categories', 'about', 'testimonials', 'partners', 'team', 'contact'];
      const scrollPosition = window.scrollY + 100; // Offset for navbar height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Split navigation items for left and right sides
  const navItems = [
    { key: 'nav.home', href: '#home', id: 'home' },
    { key: 'nav.categories', href: '#categories', id: 'categories' },
    { key: 'nav.about', href: '#about', id: 'about' },
    { key: 'nav.testimonials', href: '#testimonials', id: 'testimonials' },
    { key: 'nav.partners', href: '#partners', id: 'partners' },
    { key: 'nav.team', href: '#team', id: 'team' },
    { key: 'nav.contact', href: '#contact', id: 'contact' },
  ];

  // Split navigation items for left and right sides
  const leftNavItems = navItems.slice(0, 3);
  const rightNavItems = navItems.slice(3);

  const isActive = (id) => activeSection === id;

  return (
    <>
      <style jsx global>{`
        .tennyson-font {
          font-family: 'Tennyson', serif;
        }
      `}</style>

      <nav className="w-full bg-white shadow-lg fixed top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Left Navigation */}
            <div className="hidden lg:flex items-center space-x-6 flex-1 justify-end pr-8">
              {leftNavItems.map((item) => (
                <a
                  key={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.id)}
                  href={item.href}
                  className={
                    `relative font-bold text-gray-800 hover:text-green-600 
              transition-all duration-200 text-base tracking-wide tennyson-font
           ${isActive(item.id) ? 'text-green-600' : ''}
              hover:scale-105 transform`
                  }
                >
                  {/* Use t() function with nav keys */}
                  {t(`${item.key}`)}
                  {activeSection === item.key && (
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-green-600 rounded-full"></span>
                  )}
                </a>
              ))}
            </div>

            {/* Centered Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 mx-16">
              <Image
                src="/assets/images/logoNoBuff.png"
                alt="SyrianaGo Logo"
                width={200}
                height={80}
                className="object-contain max-h-16 w-auto"
                priority
              />
            </Link>

            {/* Right Navigation */}
            <div className="hidden lg:flex items-center space-x-5 flex-1 justify-start pl-8">
              {rightNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.id)}
                  className={
                    `relative font-bold text-gray-800 hover:text-green-600 
              transition-all duration-200 text-base tracking-wide tennyson-font
             ${isActive(item.id) ? 'text-green-600' : ''}
              hover:scale-105 transform`
                  }
                >
                  {/* Use t() function with nav keys */}
                  {t(`${item.key}`)}
                  {activeSection === item.key && (
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-green-600 rounded-full"></span>
                  )}
                </a>
              ))}
            </div>

            {/* Right Side Icons and User Menu */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Search, Phone, and User Icons */}
              <div className="hidden sm:flex items-center space-x-3">
               
                <UserDropdown />
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-600" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-20 bg-transparent bg-opacity-25 z-40">
            <div className="bg-white shadow-lg border-t border-gray-100">
              <div className="px-4 py-6 space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={
                      `block px-4 py-3 rounded-lg font-medium text-gray-700 
                    hover:text-green-600 hover:bg-green-50 transition-all duration-200 tennyson-font
                    ${activeSection === item.key ? 'text-green-600 bg-green-50' : ''}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {/* Use t() function with nav keys */}
                    {t(`${item.key}`)}
                  </a>
                ))}
                {/* Mobile Icons */}
                <div className="flex items-center justify-end space-x-4 px-4 py-4 border-t border-gray-100 mt-4">
                 <UserDropdown />
                 <LanguageSwitcher />
                 
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;