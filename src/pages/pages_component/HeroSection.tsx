import React from "react";
import MapButton from "./MapButton";

const HeroSection: React.FC = () => {
  return (
    <section className="py-20 px-8 sm:px-12 lg:px-16" id="beranda">
      <div className="max-w-full mx-auto">
        <div className="text-center mb-8">
          <p className="text-[#717171] text-xl font-bold tracking-wider mb-4 text-center">
            Welcome to SeismoTrack
          </p>
        </div>

        <div className="grid lg:grid-cols-2 items-center">
          {/* Gambar di kiri */}
          <div className="order-1 flex justify-center">
            <img
              src="/images/images_home/hero_seismo.png"
              alt="SeismoTrack Hero"
              className="w-full max-w-md lg:max-w-lg h-auto"
            />
          </div>

          {/* Teks di kanan */}
          <div className="order-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#000000] mb-3 leading-tight">
              Real-time Earthquake Monitoring.
            </h1>
            <p className="text-[#717171] text-lg mb-8 leading-relaxed">
              Pantau aktivitas gempa secara langsung dan dapatkan insight dari
              data yang tervisualisasi dengan baik.
            </p>
            <MapButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
