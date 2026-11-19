import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Radio } from "lucide-react";
import {
  formatCoordinates,
  getDepthCategory,
  NUMBER_FORMATTER,
  type NormalizedEarthquake,
} from "../hooks/use-bmkg-earthquakes";

interface HeroSectionProps {
  status: "loading" | "ready" | "error";
  latestEvent: NormalizedEarthquake | null;
  totalEvents: number;
}

export default function HeroSection({
  status,
  latestEvent,
  totalEvents,
}: HeroSectionProps) {
  const depthInfo = latestEvent
    ? getDepthCategory(latestEvent.depthKm)
    : null;

  return (
    <section
      id="beranda"
      className="relative scroll-mt-20 bg-seismo-ground pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-[2.25rem] sm:text-[3.125rem] lg:text-[3.75rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-seismo-ink seismo-balance">
              Pemantauan Gempa Indonesia Real-Time.
            </h1>

            <p className="max-w-[58ch] text-base sm:text-lg leading-[1.65] text-seismo-ink-secondary seismo-pretty">
              SeismoTrack menyajikan data resmi BMKG InaTEWS dalam satu peta
              geografis interaktif lengkap dengan propagasi gelombang P dan S,
              estimasi wilayah terdampak, serta peringatan dini tsunami.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
              <Link
                to="/map"
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-md bg-seismo-brand px-6 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-seismo-brand-hover active:scale-[0.98]"
              >
                <span>Buka Peta Pemantauan</span>
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </Link>

              <a
                href="#data"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-seismo-border-strong bg-seismo-elevated px-5 py-3 text-base font-semibold text-seismo-ink transition-colors duration-200 hover:bg-seismo-surface"
              >
                <span>Lihat Data BMKG Terbaru</span>
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <dl className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-seismo-border max-w-xl">
              <div>
                <dt className="text-xs sm:text-sm text-seismo-ink-muted">
                  Sumber Resmi
                </dt>
                <dd className="mt-1 text-sm sm:text-base font-semibold text-seismo-ink">
                  BMKG InaTEWS
                </dd>
              </div>
              <div>
                <dt className="text-xs sm:text-sm text-seismo-ink-muted">
                  Model Gelombang
                </dt>
                <dd className="mt-1 font-mono text-sm sm:text-base font-semibold text-seismo-ink seismo-tabular">
                  P 6 · S 3 km/s
                </dd>
              </div>
              <div>
                <dt className="text-xs sm:text-sm text-seismo-ink-muted">
                  Cakupan Pantau
                </dt>
                <dd className="mt-1 text-sm sm:text-base font-semibold text-seismo-ink">
                  Nusantara &amp; Sesar
                </dd>
              </div>
            </dl>
          </div>

          {/* Lightweight Seismic Observatory Dossier (Zero 3D / Zero WebGL) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-seismo-border bg-seismo-elevated overflow-hidden">
              {/* Top Telemetry Header */}
              <div className="flex items-center justify-between gap-3 border-b border-seismo-border bg-seismo-surface/70 px-5 py-3.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span
                      aria-hidden="true"
                      className="seismo-live-ring absolute inline-flex h-full w-full rounded-full bg-seismo-live"
                    />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-seismo-live" />
                  </span>
                  <span className="text-sm font-semibold text-seismo-ink truncate">
                    Catatan Seismograf BMKG
                  </span>
                </div>
                <span className="font-mono text-xs font-medium text-seismo-ink-muted seismo-tabular shrink-0">
                  {status === "ready" && totalEvents > 0
                    ? `${NUMBER_FORMATTER.format(totalEvents)} kejadian`
                    : "InaTEWS"}
                </span>
              </div>

              {/* Static Lightweight SVG Seismograph + Indonesia Brand Emblem */}
              <div className="relative px-5 pt-6 pb-5 border-b border-seismo-border bg-seismo-ground/50">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/images_home/hero_seismo.png"
                      alt="Emblem jaringan seismograf Nusantara SeismoTrack"
                      width={52}
                      height={52}
                      className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 object-contain"
                    />
                    <div>
                      <p className="text-sm font-semibold text-seismo-ink">
                        Cincin Api Indonesia
                      </p>
                      <p className="font-mono text-xs text-seismo-ink-muted seismo-tabular">
                        6° LU – 11° LS · 95° – 141° BT
                      </p>
                    </div>
                  </div>
                  <Radio
                    className="h-5 w-5 text-seismo-brand shrink-0"
                    aria-hidden="true"
                  />
                </div>

                {/* Clean Vector Seismogram Trace */}
                <svg
                  viewBox="0 0 460 120"
                  role="img"
                  aria-label="Ilustrasi trace gelombang seismograf P-wave dan S-wave"
                  className="w-full h-auto block"
                >
                  {/* Reference Baseline & Calibration Grid */}
                  <line
                    x1="0"
                    y1="66"
                    x2="460"
                    y2="66"
                    stroke="#E5E2DA"
                    strokeWidth="1"
                  />
                  <line
                    x1="126"
                    y1="20"
                    x2="126"
                    y2="108"
                    stroke="#D4CFC4"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="214"
                    y1="20"
                    x2="214"
                    y2="108"
                    stroke="#D4CFC4"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Wave Labels cleanly positioned above peak range */}
                  <text
                    x="130"
                    y="14"
                    fill="#6B6860"
                    fontSize="10"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    P-WAVE
                  </text>
                  <text
                    x="218"
                    y="14"
                    fill="#5C3B00"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    S-WAVE
                  </text>

                  {/* Seismogram Waveform Path */}
                  <path
                    d="M 4 66 L 42 66 L 50 63 L 58 69 L 66 66 L 116 66 L 126 66 L 134 54 L 142 78 L 150 58 L 158 73 L 166 62 L 174 69 L 182 65 L 204 66 L 214 66 L 224 28 L 236 106 L 248 34 L 260 98 L 272 44 L 284 88 L 296 52 L 308 80 L 320 58 L 332 74 L 344 62 L 358 70 L 372 64 L 390 67 L 456 66"
                    fill="none"
                    stroke="#5C3B00"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="seismo-trace-path"
                  />

                  {/* Peak Accent Points */}
                  <circle cx="224" cy="28" r="3.5" fill="#B91C1C" />
                  <circle cx="126" cy="66" r="3" fill="#5C3B00" />
                </svg>
              </div>

              {/* Latest Real BMKG Event Readout */}
              <div className="p-5">
                {status === "loading" ? (
                  <div
                    aria-busy="true"
                    aria-label="Memuat gempa terbaru dari BMKG"
                    className="space-y-3 animate-pulse motion-reduce:animate-none"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-32 rounded bg-seismo-surface" />
                      <div className="h-6 w-16 rounded bg-seismo-surface" />
                    </div>
                    <div className="h-5 w-4/5 rounded bg-seismo-surface" />
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="h-9 rounded bg-seismo-surface" />
                      <div className="h-9 rounded bg-seismo-surface" />
                    </div>
                  </div>
                ) : status === "ready" && latestEvent ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-seismo-ink-muted">
                          Kejadian Terbaru Tercatat
                        </p>
                        <p className="mt-1 text-base font-bold text-seismo-ink leading-snug">
                          {latestEvent.place}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-md px-2.5 py-1 font-mono text-sm font-bold seismo-tabular ${
                          latestEvent.magnitude >= 4.5
                            ? "bg-[#FEE2E2] text-seismo-alert"
                            : latestEvent.magnitude >= 3.5
                              ? "bg-[#FEF3C7] text-seismo-moderate"
                              : "bg-seismo-brand-tint text-seismo-brand"
                        }`}
                      >
                        M {latestEvent.magnitude.toFixed(1)}
                      </span>
                    </div>

                    <dl className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-md bg-seismo-surface/70 px-3 py-2">
                        <dt className="text-xs text-seismo-ink-muted">
                          Kedalaman
                        </dt>
                        <dd className="mt-0.5 font-mono text-xs sm:text-sm font-semibold text-seismo-ink seismo-tabular flex items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className="inline-block h-2 w-2 rounded-full shrink-0"
                            style={{
                              backgroundColor: depthInfo?.color ?? "#5C3B00",
                            }}
                          />
                          <span>{latestEvent.depthLabel}</span>
                        </dd>
                      </div>

                      <div className="rounded-md bg-seismo-surface/70 px-3 py-2">
                        <dt className="text-xs text-seismo-ink-muted">
                          Koordinat
                        </dt>
                        <dd className="mt-0.5 font-mono text-xs sm:text-sm font-semibold text-seismo-ink seismo-tabular truncate">
                          {formatCoordinates(latestEvent.lat, latestEvent.lng)}
                        </dd>
                      </div>
                    </dl>

                    <div className="flex items-center justify-between gap-2 pt-1 text-xs text-seismo-ink-muted">
                      <time
                        dateTime={latestEvent.timeIso || undefined}
                        className="font-mono seismo-tabular"
                      >
                        {latestEvent.timeWib}
                      </time>
                      <Link
                        to="/map"
                        className="font-semibold text-seismo-brand underline underline-offset-4 hover:text-seismo-brand-hover"
                      >
                        Periksa di peta →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-seismo-ink">
                      Pratinjau Data Seismik BMKG
                    </p>
                    <p className="text-sm text-seismo-ink-secondary leading-relaxed">
                      Feed kejadian terbaru sedang tidak dapat dijangkau dari
                      peramban ini. Buka peta pemantauan untuk mengakses aliran
                      peringatan langsung.
                    </p>
                    <Link
                      to="/map"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-seismo-brand underline underline-offset-4 hover:text-seismo-brand-hover"
                    >
                      <span>Buka peta pemantauan</span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
