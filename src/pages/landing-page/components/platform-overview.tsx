import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "../hooks/use-reveal";

interface PreviewView {
  id: string;
  label: string;
  caption: string;
  detail: string;
  image: string;
  alt: string;
}

const PREVIEW_VIEWS: PreviewView[] = [
  {
    id: "peta",
    label: "Peta Episentrum",
    caption: "Visualisasi episentrum, kedalaman, dan garis sesar aktif",
    detail:
      "Titik gempa dikelompokkan berdasarkan warna kedalaman dan ukuran magnitudo di atas batas kabupaten/kota serta sesar Indonesia.",
    image: "/images/images_home/carousel_1.png",
    alt: "Tangkapan layar peta pemantauan gempa real-time SeismoTrack yang menampilkan garis sesar dan episentrum di kepulauan Indonesia",
  },
  {
    id: "gempa",
    label: "Peringatan Gempa",
    caption: "Notifikasi visual dan suara saat gempa signifikan terdeteksi",
    detail:
      "Menampilkan magnitudo, kedalaman, dan daftar kabupaten/kota yang berpotensi terdampak saat gelombang seismik menjalar.",
    image: "/images/images_home/carousel_2.png",
    alt: "Tampilan peringatan dini gempa bumi dengan informasi magnitudo dan kedalaman di SeismoTrack",
  },
  {
    id: "tsunami",
    label: "Peringatan Tsunami",
    caption: "Status siaga pesisir WASPADA, SIAGA, hingga AWAS",
    detail:
      "Menyorot garis pantai terdampak secara otomatis mengikuti arahan peringatan dini tsunami dari BMKG InaTEWS.",
    image: "/images/images_home/carousel_3.png",
    alt: "Tampilan peringatan dini potensi tsunami dengan pesan arahan evakuasi BMKG di SeismoTrack",
  },
  {
    id: "detail",
    label: "Detail Kejadian",
    caption: "Koordinat presisi, waktu WIB, dan ShakeMap MMI",
    detail:
      "Setiap titik di peta dan log kejadian dapat dipilih untuk meninjau koordinat lintang-bujur, kedalaman, serta peta guncangan.",
    image: "/images/images_home/carousel_5.png",
    alt: "Popup detail kejadian gempa bumi menampilkan magnitudo, kedalaman, waktu WIB, dan koordinat",
  },
];

export default function PlatformOverview() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { ref, visible } = useReveal<HTMLElement>();
  const activeView = PREVIEW_VIEWS[selectedIndex];

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const total = PREVIEW_VIEWS.length;
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % total;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + total) % total;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = total - 1;
    }
    if (nextIndex !== null) {
      event.preventDefault();
      setSelectedIndex(nextIndex);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <section
      id="ringkasan"
      ref={ref}
      data-visible={visible}
      className="seismo-reveal scroll-mt-20 bg-seismo-surface py-20 sm:py-24 lg:py-28 border-y border-seismo-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Narrative & View Switcher */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold leading-[1.14] tracking-[-0.025em] text-seismo-ink seismo-balance">
              Informasi seismik resmi yang cepat dibaca saat genting.
            </h2>

            <p className="text-base leading-[1.68] text-seismo-ink-secondary seismo-pretty">
              Berada di pertemuan lempeng tektonik aktif membuat Indonesia
              membutuhkan akses informasi gempa yang jelas dan segera dipahami.
              SeismoTrack menghubungkan data resmi BMKG InaTEWS ke antarmuka
              peta pemantauan yang terstruktur bagi masyarakat maupun peneliti.
            </p>

            {/* Accessible Tab Switcher (Zero External Carousel Dependency) */}
            <div
              role="tablist"
              aria-label="Pratinjau tampilan peta SeismoTrack"
              className="grid grid-cols-2 gap-2 pt-2"
            >
              {PREVIEW_VIEWS.map((view, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={view.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`overview-tab-${view.id}`}
                    tabIndex={isSelected ? 0 : -1}
                    aria-selected={isSelected}
                    aria-controls={`overview-panel-${view.id}`}
                    onClick={() => setSelectedIndex(index)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                    className={`min-h-[44px] rounded-md border px-3.5 py-2.5 text-left text-sm font-semibold transition-colors duration-200 ${
                      isSelected
                        ? "border-seismo-brand bg-seismo-brand text-white"
                        : "border-seismo-border-strong bg-seismo-elevated text-seismo-ink hover:bg-seismo-ground"
                    }`}
                  >
                    {view.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                to="/map"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-seismo-brand underline underline-offset-4 hover:text-seismo-brand-hover"
              >
                <span>Jelajahi antarmuka peta secara langsung</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Real Product Screenshot Panel */}
          <div className="lg:col-span-7">
            <div
              role="tabpanel"
              id={`overview-panel-${activeView.id}`}
              aria-labelledby={`overview-tab-${activeView.id}`}
              className="rounded-xl border border-seismo-border bg-seismo-elevated overflow-hidden"
            >
              <div className="aspect-[3/2] w-full bg-[#1C1B19] overflow-hidden">
                <img
                  src={activeView.image}
                  alt={activeView.alt}
                  width={900}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-t border-seismo-border">
                <div className="space-y-1.5 max-w-xl">
                  <h3 className="text-base sm:text-lg font-bold text-seismo-ink">
                    {activeView.caption}
                  </h3>
                  <p className="text-sm leading-relaxed text-seismo-ink-secondary">
                    {activeView.detail}
                  </p>
                </div>
                <span className="font-mono text-xs font-medium text-seismo-ink-muted seismo-tabular shrink-0">
                  {selectedIndex + 1} / {PREVIEW_VIEWS.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
