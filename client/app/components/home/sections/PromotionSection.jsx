'use client';

import { useLanguage } from "@/app/contexts/LanguageContext";

const PromotionSection = () => {
  const { t } = useLanguage(); // Get translation function

  return (
    <section id="promotion" className="relative h-[75vh] w-full overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://cdn-media.f-static.net/uploads/10845266/normal_pb-683c94db91966.mp4" type="video/mp4" />
        {t('common.videoNotSupported')}
      </video>

      {/* Shadow Overlay (left to right fade) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 flex items-center h-full px-6 md:px-20">
        <div>
          <h2 className="text-white text-4xl md:text-6xl font-extrabold mb-4 underline decoration-green-400 underline-offset-8">
            {t('promotion.title')}
          </h2>
          <p className="text-white text-lg md:text-2xl max-w-xl underline decoration-white/50 underline-offset-4">
            {t('promotion.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PromotionSection;