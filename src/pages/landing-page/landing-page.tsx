import Header from "./components/pages-header";
import HeroSection from "./components/hero-section";
import FeatureSection from "./components/feature-section";
import AboutSection from "./components/about-section";
import Footer from "./components/footer";
import EarthquakeSection from "./components/earthquake-section";

export default function HomePage() {
  return (
    <div className="min-h-screen font-cascadia scroll-smooth">  

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Feature Section */}
      <FeatureSection />

      {/* Earthquake Chart Section */}
      <EarthquakeSection />

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
