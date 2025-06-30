'use client';

import { useLanguage } from '@/app/contexts/LanguageContext';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const logos = [
  '/assets/images/partners/cloudSolution.webp',
  '/assets/images/partners/financialInvestment.webp',
  '/assets/images/partners/housePaiting.webp',
  '/assets/images/partners/roofRepair.webp',
  '/assets/images/partners/worldTravel.png',
  '/assets/images/partners/barberShop.png',
  '/assets/images/partners/open.png',
  '/assets/images/partners/nextstar.png',
];

// Duplicate logos to simulate infinite scroll
const infiniteLogos = [...logos, ...logos, ...logos];

const PartnersSlider = () => {
  const sliderRef = useRef(null);
  const controls = useAnimation();
  const [xPosition, setXPosition] = useState(0);
  const { t } = useLanguage(); // Get translation function

  // Infinite scroll loop
  useEffect(() => {
    const slide = () => {
      setXPosition((prev) => {
        const newX = prev - 1;
        // reset when we reach half length
        if (Math.abs(newX) >= (logos.length * 200)) {
          return 0;
        }
        return newX;
      });
    };

    const interval = setInterval(slide, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="partners" className="py-16 bg-[#101c23] text-white text-center">
      <h2 className="text-3xl font-bold mb-2">{t('partners.title')}</h2>
      <div className="w-12 h-1 bg-white mx-auto mb-10" />

      <div className="overflow-hidden max-w-7xl mx-auto">
        <motion.div
          ref={sliderRef}
          className="flex gap-6"
          animate={{ x: xPosition }}
          transition={{ ease: 'linear', duration: 0 }}
        >
          {infiniteLogos.map((logo, i) => (
            <div
              key={i}
              className="min-w-[200px] h-[120px] rounded-xl shadow-md flex items-center justify-center p-4"
            >
              <img
                src={logo}
                alt={t('partners.logoAlt', { number: i + 1 })}
                className="h-full object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSlider;