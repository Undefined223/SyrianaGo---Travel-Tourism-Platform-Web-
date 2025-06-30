'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '@/app/contexts/LanguageContext';

const testimonials = [
  {
    en: {
      name: 'Alice Johnson',
      role: 'Project Manager',
      quote: 'The services provided by PlatformHub transformed the way our team operates.',
    },
    fr: {
      name: 'Alice Johnson',
      role: 'Chef de projet',
      quote: 'Les services fournis par PlatformHub ont transformé la façon dont notre équipe fonctionne.',
    },
    ar: {
      name: 'أليس جونسون',
      role: 'مدير المشروع',
      quote: 'الخدمات المقدمة من PlatformHub غيرت طريقة عمل فريقنا.',
    },
    image: 'https://images.cdn-files-a.com/ready_uploads/media/2692771/400_5e0a2995b2eae.jpg',
    rating: 5,
  },
  {
    en: {
      name: 'Michael Brown',
      role: 'Small Business Owner',
      quote: 'Amazing experience! Prompt support and excellent platform.',
    },
    fr: {
      name: 'Michael Brown',
      role: 'Propriétaire de petite entreprise',
      quote: 'Expérience incroyable ! Support rapide et plateforme excellente.',
    },
    ar: {
      name: 'مايكل براون',
      role: 'صاحب عمل صغير',
      quote: 'تجربة رائعة! دعم سريع ومنصة ممتازة.',
    },
    image: 'https://images.cdn-files-a.com/ready_uploads/media/137733/400_5ce9807c4d1fe.jpg',
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);
  const { t, language } = useLanguage();
  
  const prevTestimonial = () =>
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const nextTestimonial = () =>
    setIndex((prev) => (prev + 1) % testimonials.length);
  
  const currentTestimonial = testimonials[index];
  const translation = currentTestimonial[language] || currentTestimonial.en;

  return (
    <section id="testimonials" className="py-16 bg-white text-center relative">
      <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Tennyson BC' }}>
        {t('testimonials.title')}
      </h2>
      <div className="w-12 h-1 bg-black mx-auto mb-10" />

      <button
        onClick={prevTestimonial}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-gray-500 hover:text-black"
        aria-label={t('testimonials.prevTestimonial')}
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={nextTestimonial}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-gray-500 hover:text-black"
        aria-label={t('testimonials.nextTestimonial')}
      >
        <FaChevronRight />
      </button>

      <div className="max-w-xl mx-auto px-4 h-[350px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute w-full top-0 left-0"
          >
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg mb-6">
              <img
                src={currentTestimonial.image}
                alt={translation.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black text-white p-2 rounded-full text-lg">
                <FaQuoteLeft />
              </div>
            </div>

            <p className="text-gray-800 mb-4">{translation.quote}</p>

            <div className="flex justify-center mb-2 text-yellow-500">
              {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>

            <h4 className="font-bold">{translation.name.toUpperCase()}</h4>
            <p className="text-gray-600">{translation.role}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TestimonialsSection;