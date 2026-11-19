import { Activity, Layers, RadioTower, ShieldAlert } from "lucide-react";
import { useReveal } from "../hooks/use-reveal";

interface CapabilityItem {
  title: string;
  description: string;
  spec: string;
  icon: typeof Layers;
}

const CAPABILITIES: CapabilityItem[] = [
  {
    title: "Peta Episentrum & Garis Sesar Aktif",
    description:
      "Menampilkan titik gempa bumi di seluruh wilayah Indonesia bersama lapisan garis sesar tektonik dan batas administratif kabupaten/kota. Ukuran dan warna titik membedakan magnitudo serta lima kelas kedalaman secara langsung.",
    spec: "5 kelas kedalaman · GeoJSON sesar & wilayah",
    icon: Layers,
  },
  {
    title: "Propagasi Gelombang P & S Real-Time",
    description:
      "Ketika peringatan gempa masuk, sistem memodelkan perambatan gelombang primer (6 km/s) dan sekunder (3 km/s) serta menghitung kabupaten/kota yang berpotensi merasakan guncangan menggunakan Web Worker di latar belakang.",
    spec: "P-wave 6 km/s · S-wave 3 km/s · Deteksi wilayah",
    icon: Activity,
  },
  {
    title: "Integrasi Langsung Data BMKG InaTEWS",
    description:
      "Mengambil data gempa terbaru, gempa dirasakan, dan histori kejadian langsung dari layanan InaTEWS BMKG yang dipadukan dengan koneksi streaming peringatan dini real-time tanpa perlu memuat ulang halaman.",
    spec: "gempaQL · lastQL · datagempa · Stream peringatan",
    icon: RadioTower,
  },
  {
    title: "Peringatan Dini Tsunami, ShakeMap & Simulasi",
    description:
      "Mendukung tampilan peringatan gempa dan potensi tsunami (WASPADA, SIAGA, AWAS) dengan sorotan garis pantai terdampak, pratinjau ShakeMap MMI, serta tombol simulasi gempa dan tsunami untuk edukasi kesiapsiagaan.",
    spec: "ShakeMap MMI · Sorotan pesisir · Mode simulasi",
    icon: ShieldAlert,
  },
];

export default function FeatureSection() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="fitur"
      ref={ref}
      data-visible={visible}
      className="seismo-reveal scroll-mt-20 bg-seismo-ground py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4 mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold leading-[1.14] tracking-[-0.025em] text-seismo-ink seismo-balance">
            Kemampuan utama di dalam peta pemantauan.
          </h2>
          <p className="text-base sm:text-lg leading-[1.65] text-seismo-ink-secondary seismo-pretty">
            Seluruh modul pemrosesan peta 3D dan peringatan aktif berjalan
            terpisah di halaman peta agar beranda tetap ringan saat dibuka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-seismo-border bg-seismo-elevated rounded-xl overflow-hidden">
          {CAPABILITIES.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="flex flex-col justify-between gap-6 border-r border-b border-seismo-border p-6 sm:p-8 transition-colors duration-200 hover:bg-seismo-ground/70"
              >
                <div className="space-y-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-seismo-brand-tint text-seismo-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold tracking-[-0.015em] text-seismo-ink">
                    {item.title}
                  </h3>

                  <p className="text-sm sm:text-base leading-[1.65] text-seismo-ink-secondary">
                    {item.description}
                  </p>
                </div>

                <p className="font-mono text-xs font-medium text-seismo-ink-muted pt-4 border-t border-seismo-border/80">
                  {item.spec}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
