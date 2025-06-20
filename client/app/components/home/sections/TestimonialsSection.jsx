'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Alice Johnson',
    role: 'Project Manager',
    image: 'https://images.cdn-files-a.com/ready_uploads/media/2692771/400_5e0a2995b2eae.jpg',
    quote: 'The services provided by PlatformHub transformed the way our team operates.',
    rating: 5,
  },
  {
    name: 'Michael Brown',
    role: 'Small Business Owner',
    image: 'https://images.cdn-files-a.com/ready_uploads/media/137733/400_5ce9807c4d1fe.jpg',
    quote: 'Amazing experience! Prompt support and excellent platform.',
    rating: 5,
  },
 
];

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);

  const prevTestimonial = () =>
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const nextTestimonial = () =>
    setIndex((prev) => (prev + 1) % testimonials.length);

  return (
    <section className="py-16 bg-white text-center relative">
      <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Tennyson BC' }}>TESTIMONIALS</h2>
      <div className="w-12 h-1 bg-black mx-auto mb-10" />

      <button
        onClick={prevTestimonial}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-gray-500 hover:text-black"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={nextTestimonial}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-gray-500 hover:text-black"
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
                src={testimonials[index].image}
                alt={testimonials[index].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black text-white p-2 rounded-full text-lg">
                <FaQuoteLeft />
              </div>
            </div>

            <p className="text-gray-800 mb-4">{testimonials[index].quote}</p>

            <div className="flex justify-center mb-2 text-yellow-500">
              {Array.from({ length: testimonials[index].rating }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>

            <h4 className="font-bold">{testimonials[index].name.toUpperCase()}</h4>
            <p className="text-gray-600">{testimonials[index].role}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TestimonialsSection;
