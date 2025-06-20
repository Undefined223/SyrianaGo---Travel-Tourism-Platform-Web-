const MapSection = () => {
  return (
    <section id="location" className=" bg-gray-100">
      <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md">
        <iframe
          src="https://www.google.com/maps?q=Columbus+Circle,+New+York,+NY&z=15&output=embed"
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
          className="border-0 w-full h-full"
        ></iframe>
      </div>
    </section>
  );
};

export default MapSection;
