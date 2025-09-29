// src/components/footer/Footer.tsx
import FooterInfo from "./footer-info";
import FooterNav from "./footer-nav";
import FooterContact from "./footer-contact";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#d9dbe1] py-12">
      <div className="max-w-full mx-auto px-8 sm:px-12 lg:px-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FooterInfo />
          <FooterNav />
          <FooterContact />
        </div>
      </div>
    </footer>
  );
}
