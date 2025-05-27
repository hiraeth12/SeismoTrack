// src/components/about/AboutSection.tsx
import AboutCarousel from "./AboutCarousel";
import AboutText from "./AboutText";

export default function AboutSection() {
  return (
    <section className="py-20 px-6 sm:px-12 lg:px-16 scroll-smooth" id="about">
      <div className="max-w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <img src="/images/images_home/test.png" alt="SeismoTrack Logo" className="h-12 mb-4" />
            <AboutCarousel />
          </div>
          <AboutText />
        </div>
      </div>
    </section>
  );
}
