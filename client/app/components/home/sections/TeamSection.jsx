'use client';

import { useLanguage } from "@/app/contexts/LanguageContext";

const teamMembers = [
  {
    en: {
      name: 'Jack Hendrix',
      title: 'President',
      description: 'This is one of the team member slots you can have for your company. You can replace their picture and add any text you want here for describing your employees.'
    },
    fr: {
      name: 'Jack Hendrix',
      title: 'Président',
      description: 'Ceci est un emplacement pour un membre de votre équipe. Vous pouvez remplacer sa photo et ajouter le texte que vous souhaitez pour décrire vos employés.'
    },
    ar: {
      name: 'جاك هندريكس',
      title: 'الرئيس',
      description: 'هذا أحد أعضاء الفريق في شركتك. يمكنك استبدال الصورة وإضافة أي نص تريده لوصف موظفيك.'
    },
    img: 'https://images.cdn-files-a.com/uploads/2031/800_5a15a9b2d0271.jpg'
  },
  {
    en: {
      name: 'Elizabeth Newman',
      title: 'Partner',
      description: 'This is one of the team member slots you can have for your company. You can replace their picture and add any text you want here for describing your employees.'
    },
    fr: {
      name: 'Elizabeth Newman',
      title: 'Partenaire',
      description: 'Ceci est un emplacement pour un membre de votre équipe. Vous pouvez remplacer sa photo et ajouter le texte que vous souhaitez pour décrire vos employés.'
    },
    ar: {
      name: 'إليزابيث نيومان',
      title: 'شريك',
      description: 'هذا أحد أعضاء الفريق في شركتك. يمكنك استبدال الصورة وإضافة أي نص تريده لوصف موظفيك.'
    },
    img: '//images.cdn-files-a.com/uploads/2031/800_5a2816abd9044.jpg'
  },
  {
    en: {
      name: 'Lucy Lennon',
      title: 'Office manager',
      description: 'This is one of the team member slots you can have for your company. You can replace their picture and add any text you want here for describing your employees.'
    },
    fr: {
      name: 'Lucy Lennon',
      title: 'Responsable de bureau',
      description: 'Ceci est un emplacement pour un membre de votre équipe. Vous pouvez remplacer sa photo et ajouter le texte que vous souhaitez pour décrire vos employés.'
    },
    ar: {
      name: 'لوسي لينون',
      title: 'مدير المكتب',
      description: 'هذا أحد أعضاء الفريق في شركتك. يمكنك استبدال الصورة وإضافة أي نص تريده لوصف موظفيك.'
    },
    img: '//images.cdn-files-a.com/uploads/2031/800_5a2817ee48957.jpg'
  },
  {
    en: {
      name: 'Jennifer Smith',
      title: 'C.E.O',
      description: 'This is one of the team member slots you can have for your company. You can replace their picture and add any text you want here for describing your employees.'
    },
    fr: {
      name: 'Jennifer Smith',
      title: 'P.D.G',
      description: 'Ceci est un emplacement pour un membre de votre équipe. Vous pouvez remplacer sa photo et ajouter le texte que vous souhaitez pour décrire vos employés.'
    },
    ar: {
      name: 'جينيفر سميث',
      title: 'المدير التنفيذي',
      description: 'هذا أحد أعضاء الفريق في شركتك. يمكنك استبدال الصورة وإضافة أي نص تريده لوصف موظفيك.'
    },
    img: '//images.cdn-files-a.com/uploads/2031/800_5a15a987cc8c1.jpg'
  }
];

const TeamSection = () => {
  const { t, language } = useLanguage();
  
  return (
    <section id="team" className="px-6 py-12 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Tennyson BC' }}>
        {t('team.title')}
      </h2>
      <div className="w-12 h-1 bg-black mx-auto mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {teamMembers.map((member, i) => {
          const translation = member[language] || member.en;
          return (
            <div key={i} className="flex flex-col items-center text-center px-4">
              <div className="w-36 h-36 rounded-full overflow-hidden mb-3 shadow-md">
                <img
                  src={member.img}
                  alt={translation.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg font-semibold">{translation.name}</h3>
              <p className="text-gray-600 border-b-2 border-black pb-1 mb-2 font-medium">
                {translation.title}
              </p>
              <p className="text-sm text-gray-700">{translation.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TeamSection;