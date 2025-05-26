import FeatureCard from "./FeatureCard";

const FeatureSection = () => {
  const features = [
    {
      image: "/images/images_home/interaktif.png",
      title: "Peta Interaktif",
      description:
        "Pantau lokasi gempa secara visual dengan peta real-time yang responsif dan mudah digunakan.",
    },
    {
      image: "/images/images_home/lengkap.png",
      title: "Info Gempa Lengkap",
      description:
        "Dapatkan informasi lengkap setiap gempa, mulai dari magnitudo, kedalaman, lokasi, hingga koordinat",
    },
    {
      image: "/images/images_home/real_time.png",
      title: "Data Real-time BMKG",
      description:
        "Data akan diperbarui otomatis dari Badan Meteorologi, Klimatologi, dan Geofisika (BMKG).",
    },
    {
      image: "/images/images_home/peringatan.png",
      title: "Peringatan Dini",
      description:
        "Dapatkan notifikasi dan peringatan dini untuk gempa yang berpotensi merusak.",
    },
  ];

  return (
    <section className="py-20 px-8 sm:px-12 lg:px-16 bg-white" id="fitur">
      <div className="max-w-full mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[#717171] text-xl font-bold tracking-wider uppercase mb-4">
            FITUR SEISMOTRACK
          </h2>
          <div className="w-3/4 h-px bg-[#d9dbe1] relative mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6a7d5a] to-transparent"></div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl justify-items-center">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              image={feature.image}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
