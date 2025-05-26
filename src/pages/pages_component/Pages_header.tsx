import React, { useEffect, useState } from "react";
import clsx from "clsx";

const sections = ["beranda", "fitur", "grafik", "about"];

const Header: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("beranda");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#d9dbe1]">
      <div className="max-w-full mx-auto px-8 sm:px-12 lg:px-16">
        <div className="flex justify-between items-center h-20">
          <div>
            <img
              src="/images/images_home/test.png"
              alt="SeismoTrack Logo"
              className="h-12"
            />
          </div>
          <nav className="hidden md:flex space-x-8 font-bold">
            {sections.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className={clsx(
                  "relative py-2 text-md font-cascadia transition-colors duration-300 ease-in-out font-bold capitalize",
                  activeSection === item
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-[#6A7D5A] to-[#73714D]"
                    : "text-slate-400"
                )}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
