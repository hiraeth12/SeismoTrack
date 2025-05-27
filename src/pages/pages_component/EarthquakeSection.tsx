// src/components/EarthquakeSection.tsx
import React from "react";
import EarthquakeChart from "./EarthquakeChart";
import EarthquakeLocationChart from "./EarthquakeLocationChart";
import Eva from "./EvaBG";

const EarthquakeSection: React.FC = () => {
  return (
    <section id="grafik" className="py-16 bg-[#F5F5F5] relative">
      <Eva />
      <div className="container mx-auto px-4">
        <h2 className="text-[#5C3B00] text-xl font-bold tracking-wider uppercase mb-8 text-center">
          Statistik Gempa
        </h2>
        <div className="w-3/4 h-px bg-[#d9dbe1] relative mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#5C3B00] to-transparent"></div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          <div className="w-full lg:w-1/2">
            <EarthquakeChart />
          </div>
          <div className="w-full lg:w-1/2">
            <EarthquakeLocationChart />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarthquakeSection;
