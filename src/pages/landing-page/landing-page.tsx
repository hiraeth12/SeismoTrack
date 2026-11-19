import Header from "./components/pages-header";
import HeroSection from "./components/hero-section";
import PlatformOverview from "./components/platform-overview";
import FeatureSection from "./components/feature-section";
import EarthquakeSection from "./components/earthquake-section";
import HowItWorksSection from "./components/how-it-works-section";
import CtaSection from "./components/cta-section";
import Footer from "./components/footer";
import { useBmkgEarthquakes } from "./hooks/use-bmkg-earthquakes";

export default function HomePage() {
  const earthquakeData = useBmkgEarthquakes();

  return (
    <div className="seismo-landing min-h-[100dvh] flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-seismo-brand focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Lewati ke konten utama
      </a>

      <Header />

      <main id="main-content" className="flex-1">
        <HeroSection
          status={earthquakeData.status}
          latestEvent={earthquakeData.latestEvent}
          totalEvents={earthquakeData.totalEvents}
        />

        <PlatformOverview />

        <FeatureSection />

        <EarthquakeSection data={earthquakeData} />

        <HowItWorksSection />

        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
