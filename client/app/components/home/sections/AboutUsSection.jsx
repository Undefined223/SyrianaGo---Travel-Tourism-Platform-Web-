const AboutUsSection = () => {
  return (
    <section id="about" className="px-6 py-16 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-100/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 ">
          <div className="inline-block mb-4">
            <h2 className="text-4xl font-primary font-bold bg-gradient-to-r from-slate-800 via-gray-700 to-slate-800 bg-clip-text text-transparent mb-3" style={{ fontFamily: 'Tennyson BC' }}>
              About Us
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-green-600 via-white to-black mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Logo Side */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative group">
              {/* Logo Container with Enhanced Effects */}
              <div className="relative w-64 h-64 mx-auto">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-200/40 to-gray-200/40 rounded-full blur-xl group-hover:from-slate-300/60 group-hover:to-gray-300/60 transition-all duration-500"></div>
                
                {/* Main Logo Container */}
                <div className="relative w-full h-full bg-gradient-to-br from-white via-slate-50 to-gray-50 rounded-full shadow-2xl border border-slate-200/50 flex items-center justify-center group-hover:shadow-3xl transition-all duration-500">
                  {/* Inner Shadow Ring */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-50 to-white shadow-inner border border-slate-100"></div>
                  
                  {/* Logo Placeholder - Replace with your actual logo */}
                  <div className="relative z-10 w-40 h-40 bg-gradient-to-br from-slate-100 to-gray-100 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500">
                    {/* Replace this div with your logo image */}
                    {/* <div className="text-6xl font-bold text-slate-600">
                      PH
                    </div> */}
                    {/* Uncomment and use this for actual logo: */}
                    <img
                      src="/assets/images/aboutLogo.png"
                      alt="PlatformHub Logo"
                      className="w-32 h-32 object-contain"
                    />
                   
                  </div>
                </div>

                {/* Rotating Border Effect */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-green-400/30 via-transparent to-black/30 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-500" style={{animationDuration: '4s'}}></div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6" style={{ fontFamily: 'Times New Roman Custom' }}>
            {/* Company Name */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Tennyson BC' }}>
                Platform<span className="text-slate-600">Hub</span>
              </h3>
              <div className="w-14 h-0.5 bg-gradient-to-r from-green-600 to-black"></div>
            </div>

            {/* Main Description */}
            <div className="space-y-4">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                PlatformHub is dedicated to bridging innovation and connectivity by offering personalized solutions for individuals and businesses.
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed">
                Our mission is to empower growth, facilitate collaboration, and provide accessible platforms that cater to ever-evolving needs.
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed">
                With a commitment to excellence, we strive to be the trusted name in delivering tailored experiences and fostering meaningful connections.
              </p>
            </div>

            {/* Key Points */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <div className="group p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-5 h-5 bg-green-600 rounded-full"></div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1 text-sm" style={{ fontFamily: 'Tennyson BC' }}>Innovation</h4>
                <p className="text-xs text-gray-600">Bridging technology with creative solutions</p>
              </div>

              <div className="group p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1 text-sm" style={{ fontFamily: 'Tennyson BC' }}>Connectivity</h4>
                <p className="text-xs text-gray-600">Fostering meaningful connections</p>
              </div>

              <div className="group p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-5 h-5 bg-green-600 rounded-full"></div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1 text-sm" style={{ fontFamily: 'Tennyson BC' }}>Growth</h4>
                <p className="text-xs text-gray-600">Empowering personal and business development</p>
              </div>

              <div className="group p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1 text-sm" style={{ fontFamily: 'Tennyson BC' }}>Excellence</h4>
                <p className="text-xs text-gray-600">Commitment to quality and trust</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;