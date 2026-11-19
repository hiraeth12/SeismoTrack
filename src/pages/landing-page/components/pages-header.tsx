import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "fitur", label: "Kemampuan" },
  { id: "data", label: "Data BMKG" },
  { id: "cara-kerja", label: "Cara Kerja" },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const elements = NAV_ITEMS.map((item) =>
      document.getElementById(item.id)
    ).filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMobileLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        toggleBtnRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-seismo-ground border-b border-seismo-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-[72px] items-center justify-between gap-4">
          <a
            href="#beranda"
            className="inline-flex shrink-0 items-center gap-2.5 rounded-sm py-1"
            aria-label="SeismoTrack — Kembali ke atas halaman"
          >
            <img
              src="/images/images_home/test.png"
              alt="SeismoTrack"
              width={168}
              height={40}
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </a>

          <nav
            aria-label="Navigasi utama"
            className="hidden lg:flex items-center gap-2"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`whitespace-nowrap px-3.5 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-seismo-brand bg-seismo-brand-tint"
                      : "text-seismo-ink-secondary hover:text-seismo-ink hover:bg-seismo-surface"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/map"
              className="hidden sm:inline-flex whitespace-nowrap items-center gap-2 rounded-md bg-seismo-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-seismo-brand-hover active:scale-[0.98]"
            >
              <span>Buka Peta Langsung</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <button
              ref={toggleBtnRef}
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={
                mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
              }
              className="inline-flex lg:hidden h-11 w-11 items-center justify-center rounded-md border border-seismo-border bg-seismo-elevated text-seismo-ink transition-colors hover:bg-seismo-surface"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      <div
        id="mobile-navigation-drawer"
        hidden={!mobileOpen}
        className="lg:hidden border-t border-seismo-border bg-seismo-ground overscroll-contain max-h-[calc(100dvh-4rem)] overflow-y-auto"
      >
        <nav
          aria-label="Navigasi seluler"
          className="mx-auto max-w-7xl px-4 py-5 space-y-1"
        >
          {NAV_ITEMS.map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                ref={idx === 0 ? firstMobileLinkRef : undefined}
                href={`#${item.id}`}
                onClick={closeMenu}
                aria-current={isActive ? "location" : undefined}
                className={`flex min-h-[44px] items-center rounded-md px-3.5 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-seismo-brand-tint text-seismo-brand"
                    : "text-seismo-ink hover:bg-seismo-surface"
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <div className="pt-4">
            <Link
              to="/map"
              onClick={closeMenu}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md bg-seismo-brand px-5 text-base font-semibold text-white transition-colors hover:bg-seismo-brand-hover"
            >
              <span>Buka Peta Pemantauan</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
