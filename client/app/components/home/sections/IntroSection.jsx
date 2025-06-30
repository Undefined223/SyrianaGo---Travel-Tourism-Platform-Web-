'use client';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { useState, useEffect } from 'react';

const IntroSection = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useLanguage(); // Get translation function

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => setShowVideo(true), 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="relative h-[85vh] w-full overflow-hidden">
      {/* Background layers container */}
      <div className="absolute inset-0">
        {/* Image layer with controlled darkness */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-100'}`}>
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img 
            src="/assets/images/introImage.jpeg" 
            alt={t('common.syrianaGo')} 
            className="w-full h-full object-cover brightness-90"
          />
        </div>
        
        {/* Video layer with controlled darkness */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover brightness-95"
          >
            <source src="/assets/videos/intro.mp4" type="video/mp4" />
            {t('common.videoNotSupported')}
          </video>
        </div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-20">
        <div className={`transition-all duration-1000 ${isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-tennyson text-white mb-4 tracking-tight drop-shadow-lg">
            {t('common.syrianaGo')}
          </h1>
          <div className={`h-px bg-[#337914] transition-all duration-700 mx-auto ${isTransitioning ? 'w-0' : 'w-64'} my-6`}></div>
          <p className="text-xl md:text-2xl text-white font-serif opacity-95 drop-shadow-md">
            {t('home.tagline')}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-0 right-0 flex justify-center z-20 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="animate-bounce">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </div>

      <style jsx global>{`
        @font-face {
          font-family: 'Tennyson BC';
          src: url('/assets/fonts/TennysonBC.woff2') format('woff2');
          font-display: swap;
        }
        .font-tennyson {
          font-family: 'Tennyson BC', serif;
          font-weight: 400;
          letter-spacing: -0.5px;
        }
      `}</style>
    </section>
  );
};

export default IntroSection;