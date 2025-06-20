const teamMembers = [
  {
    name: 'Jack Hendrix',
    title: 'President',
    img: 'https://images.cdn-files-a.com/uploads/2031/800_5a15a9b2d0271.jpg',
    description:
      'This is one of the team member slots you can have for your company. You can replace their picture and add any text you want here for describing your employees.',
  },
  {
    name: 'Elizabeth Newman',
    title: 'Partner',
    img: '//images.cdn-files-a.com/uploads/2031/800_5a2816abd9044.jpg',
    description:
      'This is one of the team member slots you can have for your company. You can replace their picture and add any text you want here for describing your employees.',
  },
  {
    name: 'Lucy Lennon',
    title: 'Office manager',
    img: '//images.cdn-files-a.com/uploads/2031/800_5a2817ee48957.jpg',
    description:
      'This is one of the team member slots you can have for your company. You can replace their picture and add any text you want here for describing your employees.',
  },
  {
    name: 'Jennifer Smith',
    title: 'C.E.O',
    img: '//images.cdn-files-a.com/uploads/2031/800_5a15a987cc8c1.jpg',
    description:
      'This is one of the team member slots you can have for your company. You can replace their picture and add any text you want here for describing your employees.',
  },
];

const TeamSection = () => {
  return (
    <section id="team" className="px-6 py-12 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Tennyson BC' }}>TEAM</h2>
      <div className="w-12 h-1 bg-black mx-auto mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {teamMembers.map((member, i) => (
          <div key={i} className="flex flex-col items-center text-center px-4">
            <div className="w-36 h-36 rounded-full overflow-hidden mb-3 shadow-md">
              <img
                src={member.img}
                alt={member.name}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-gray-600 border-b-2 border-black pb-1 mb-2 font-medium">{member.title}</p>
            <p className="text-sm text-gray-700">{member.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
