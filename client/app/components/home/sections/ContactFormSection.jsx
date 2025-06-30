'use client';

import { useLanguage } from "@/app/contexts/LanguageContext";

const ContactFormSection = () => {
  const { t } = useLanguage(); // Get translation function

  return (
    <section id="contact" className="px-4 py-20 bg-[#1b262c]">
      <h2 className="text-4xl font-bold text-center mb-4 text-white" style={{ fontFamily: 'Tennyson BC' }}>
        {t('contact.title')}
      </h2>
      <p className="text-center text-gray-400 mb-12">
        {t('contact.subtitle')}
      </p>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.nameLabel')}
            </label>
            <input
              type="text"
              placeholder={t('contact.namePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.emailLabel')}
            </label>
            <input
              type="email"
              placeholder={t('contact.emailPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.messageLabel')}
            </label>
            <textarea
              placeholder={t('contact.messagePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105"
            >
              {t('contact.submitButton')}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactFormSection;