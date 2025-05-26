import Header from "./pages_component/Pages_header";
import HeroSection from "./pages_component/HeroSection";
import FeatureSection from "./pages_component/FeatureSection";
import AboutSection from "./pages_component/AboutSection";
import Footer from "./pages_component/Footer";
import EarthquakeSection from "./pages_component/EarthquakeSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] font-cascadia scroll-smooth">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />
      {/* Feature Section */}
      <FeatureSection />

      <EarthquakeSection />

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
