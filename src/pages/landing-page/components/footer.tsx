import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-seismo-ground border-t border-seismo-border py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-seismo-border">
          {/* Brand & Project Attribution */}
          <div className="md:col-span-5 space-y-4">
            <a
              href="#beranda"
              className="inline-block rounded-sm"
              aria-label="SeismoTrack — Kembali ke atas"
            >
              <img
                src="/images/images_home/test.png"
                alt="SeismoTrack"
                width={168}
                height={40}
                loading="lazy"
                className="h-9 w-auto object-contain"
              />
            </a>
            <p className="max-w-sm text-sm leading-relaxed text-seismo-ink-secondary">
              Platform pemantauan gempa bumi dan peringatan dini tsunami
              Indonesia berbasis data resmi BMKG InaTEWS.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="text-sm font-bold text-seismo-ink">Navigasi</h2>
            <ul className="space-y-2 text-sm text-seismo-ink-secondary">
              <li>
                <a
                  href="#beranda"
                  className="inline-block py-0.5 transition-colors hover:text-seismo-brand"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#ringkasan"
                  className="inline-block py-0.5 transition-colors hover:text-seismo-brand"
                >
                  Ringkasan Platform
                </a>
              </li>
              <li>
                <a
                  href="#fitur"
                  className="inline-block py-0.5 transition-colors hover:text-seismo-brand"
                >
                  Kemampuan
                </a>
              </li>
              <li>
                <a
                  href="#data"
                  className="inline-block py-0.5 transition-colors hover:text-seismo-brand"
                >
                  Data BMKG
                </a>
              </li>
              <li>
                <Link
                  to="/map"
                  className="inline-block py-0.5 font-semibold text-seismo-brand transition-colors hover:text-seismo-brand-hover"
                >
                  Peta Pemantauan
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Source & Disclaimer */}
          <div className="md:col-span-4 space-y-3">
            <h2 className="text-sm font-bold text-seismo-ink">
              Sumber Data &amp; Keterangan
            </h2>
            <p className="text-sm leading-relaxed text-seismo-ink-secondary">
              Data gempa bumi dan peringatan dini tsunami bersumber dari Badan
              Meteorologi, Klimatologi, dan Geofisika (BMKG — InaTEWS).
            </p>
            <p className="text-xs leading-relaxed text-seismo-ink-muted">
              Dalam kondisi darurat, selalu ikuti arahan resmi dari BMKG, BNPB,
              dan BPBD setempat.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-seismo-ink-muted">
          <p>© 2025 SeismoTrack — Dikembangkan untuk Proyek Akhir TPBW.</p>
          <p>Wilayah Pantau: Kepulauan Indonesia (WIB / UTC+7)</p>
        </div>
      </div>
    </footer>
  );
}
