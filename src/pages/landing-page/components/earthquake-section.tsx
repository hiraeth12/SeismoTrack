import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import {
  formatCoordinates,
  getDepthCategory,
  NUMBER_FORMATTER,
  type BmkgEarthquakeSummary,
  type MagnitudeFilterKey,
} from "../hooks/use-bmkg-earthquakes";
import { useReveal } from "../hooks/use-reveal";

interface EarthquakeSectionProps {
  data: BmkgEarthquakeSummary;
}

const DEPTH_LEGEND = [
  { band: "≤ 50 km", label: "Dangkal", color: "#B91C1C" },
  { band: "51–100 km", label: "Menengah awal", color: "#C2410C" },
  { band: "101–250 km", label: "Menengah", color: "#B45309" },
  { band: "251–600 km", label: "Dalam", color: "#15803D" },
  { band: "> 600 km", label: "Sangat dalam", color: "#1D4ED8" },
];

export default function EarthquakeSection({ data }: EarthquakeSectionProps) {
  const [selectedBucket, setSelectedBucket] =
    useState<MagnitudeFilterKey>("all");
  const { ref, visible } = useReveal<HTMLElement>();

  const filteredEvents = useMemo(() => {
    const source =
      selectedBucket === "all"
        ? data.events
        : data.events.filter((ev) => ev.bucket === selectedBucket);
    return source.slice(0, 8);
  }, [data.events, selectedBucket]);

  const maxBucketCount = useMemo(() => {
    let max = 0;
    for (const bucket of data.magnitudeBuckets) {
      if (bucket.count > max) max = bucket.count;
    }
    return max;
  }, [data.magnitudeBuckets]);

  const maxRegionCount = useMemo(() => {
    let max = 0;
    for (const region of data.regionBreakdown) {
      if (region.count > max) max = region.count;
    }
    return max;
  }, [data.regionBreakdown]);

  return (
    <section
      id="data"
      ref={ref}
      data-visible={visible}
      className="seismo-reveal scroll-mt-20 bg-seismo-surface py-20 sm:py-24 lg:py-28 border-y border-seismo-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 lg:mb-12">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold leading-[1.14] tracking-[-0.025em] text-seismo-ink seismo-balance">
              Ringkasan data gempa BMKG terkini.
            </h2>
            <p className="text-base leading-[1.65] text-seismo-ink-secondary seismo-pretty">
              Dihitung langsung dari arsip kejadian terbaru BMKG InaTEWS tanpa
              memuat mesin peta 3D. Pilih kategori magnitudo untuk menyaring
              daftar kejadian.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {data.lastFetchedWib && data.status === "ready" && (
              <span className="font-mono text-xs text-seismo-ink-muted seismo-tabular">
                Diperbarui {data.lastFetchedWib}
              </span>
            )}
            <button
              type="button"
              onClick={data.retry}
              disabled={data.status === "loading"}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-seismo-border-strong bg-seismo-elevated px-3.5 py-2 text-sm font-semibold text-seismo-ink transition-colors hover:bg-seismo-ground disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  data.status === "loading"
                    ? "animate-spin motion-reduce:animate-none"
                    : ""
                }`}
                aria-hidden="true"
              />
              <span>Muat Ulang</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {data.status === "loading" && (
          <div
            aria-busy="true"
            aria-label="Memuat statistik gempa BMKG"
            className="space-y-6 animate-pulse motion-reduce:animate-none"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="h-28 rounded-xl border border-seismo-border bg-seismo-elevated p-5"
                >
                  <div className="h-3.5 w-24 rounded bg-seismo-surface" />
                  <div className="mt-4 h-8 w-20 rounded bg-seismo-surface" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 h-80 rounded-xl border border-seismo-border bg-seismo-elevated" />
              <div className="lg:col-span-6 h-80 rounded-xl border border-seismo-border bg-seismo-elevated" />
            </div>
          </div>
        )}

        {/* Error State with Static Depth Reference Fallback */}
        {data.status === "error" && (
          <div
            role="alert"
            className="rounded-xl border border-seismo-border bg-seismo-elevated p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-2 max-w-2xl">
              <h3 className="text-lg font-bold text-seismo-ink">
                Data statistik BMKG tidak dapat dimuat saat ini
              </h3>
              <p className="text-sm sm:text-base text-seismo-ink-secondary leading-relaxed">
                {data.errorMessage}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={data.retry}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-seismo-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-seismo-brand-hover"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                <span>Coba Muat Ulang Data</span>
              </button>
              <Link
                to="/map"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-seismo-border-strong bg-seismo-ground px-4 py-2.5 text-sm font-semibold text-seismo-ink transition-colors hover:bg-seismo-surface"
              >
                <span>Buka Peta Pemantauan</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="pt-5 border-t border-seismo-border">
              <p className="text-sm font-semibold text-seismo-ink mb-3">
                Panduan Klasifikasi Kedalaman pada Peta SeismoTrack
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2.5">
                {DEPTH_LEGEND.map((item) => (
                  <div
                    key={item.band}
                    className="flex items-center gap-2 text-sm text-seismo-ink-secondary"
                  >
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-mono text-xs font-semibold text-seismo-ink seismo-tabular">
                      {item.band}
                    </span>
                    <span className="text-xs text-seismo-ink-muted">
                      ({item.label})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ready State — Real BMKG Data */}
        {data.status === "ready" && (
          <div className="space-y-6">
            {/* Summary Metrics Strip */}
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-seismo-border bg-seismo-elevated p-5">
                <dt className="text-xs sm:text-sm font-medium text-seismo-ink-muted">
                  Total Kejadian Feed
                </dt>
                <dd className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-seismo-ink seismo-tabular">
                  {NUMBER_FORMATTER.format(data.totalEvents)}
                </dd>
                <p className="mt-1 text-xs text-seismo-ink-secondary">
                  Rekaman aktif BMKG gempaQL
                </p>
              </div>

              <div className="rounded-xl border border-seismo-border bg-seismo-elevated p-5">
                <dt className="text-xs sm:text-sm font-medium text-seismo-ink-muted">
                  Magnitudo Tertinggi
                </dt>
                <dd className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-seismo-brand seismo-tabular">
                  M {data.maxMagnitude.toFixed(1)}
                </dd>
                <p className="mt-1 text-xs text-seismo-ink-secondary">
                  Puncak terekam pada feed ini
                </p>
              </div>

              <div className="rounded-xl border border-seismo-border bg-seismo-elevated p-5">
                <dt className="text-xs sm:text-sm font-medium text-seismo-ink-muted">
                  Gempa Dangkal (≤ 50 km)
                </dt>
                <dd className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-seismo-alert seismo-tabular">
                  {NUMBER_FORMATTER.format(data.shallowCount)}
                </dd>
                <p className="mt-1 text-xs text-seismo-ink-secondary">
                  {data.totalEvents > 0
                    ? `${Math.round((data.shallowCount / data.totalEvents) * 100)}% dari total kejadian`
                    : "—"}
                </p>
              </div>

              <div className="rounded-xl border border-seismo-border bg-seismo-elevated p-5">
                <dt className="text-xs sm:text-sm font-medium text-seismo-ink-muted">
                  Wilayah Paling Aktif
                </dt>
                <dd
                  className="mt-2 text-lg sm:text-xl font-bold text-seismo-ink leading-snug truncate"
                  title={data.topRegion?.name ?? "—"}
                >
                  {data.topRegion?.name ?? "—"}
                </dd>
                <p className="mt-1 font-mono text-xs text-seismo-ink-secondary seismo-tabular">
                  {data.topRegion
                    ? `${data.topRegion.count} kejadian (${data.topRegion.percentage.toFixed(1)}%)`
                    : "—"}
                </p>
              </div>
            </dl>

            {/* Two-Column Custom Lightweight Data Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Magnitude Distribution + Interactive Filter */}
              <div className="lg:col-span-6 rounded-xl border border-seismo-border bg-seismo-elevated p-5 sm:p-6 flex flex-col justify-start gap-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-seismo-ink">
                      Distribusi Berdasarkan Magnitudo
                    </h3>
                    <p className="mt-1 text-sm text-seismo-ink-secondary">
                      Klik batang kategori untuk memfilter daftar kejadian di
                      bawah.
                    </p>
                  </div>
                  {selectedBucket !== "all" && (
                    <button
                      type="button"
                      onClick={() => setSelectedBucket("all")}
                      className="rounded-md border border-seismo-border-strong bg-seismo-ground px-3 py-1.5 text-xs font-semibold text-seismo-ink hover:bg-seismo-surface"
                    >
                      Tampilkan Semua
                    </button>
                  )}
                </div>

                <div
                  role="group"
                  aria-label="Filter kategori magnitudo gempa"
                  className="space-y-3"
                >
                  {data.magnitudeBuckets.map((bucket) => {
                    const widthPct =
                      maxBucketCount > 0
                        ? Math.max((bucket.count / maxBucketCount) * 100, bucket.count > 0 ? 4 : 0)
                        : 0;
                    const isSelected = selectedBucket === bucket.key;
                    const barColor =
                      bucket.key === "gte45"
                        ? "#B91C1C"
                        : bucket.key === "35to44"
                          ? "#B45309"
                          : "#5C3B00";

                    return (
                      <button
                        key={bucket.key}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() =>
                          setSelectedBucket((prev) =>
                            prev === bucket.key ? "all" : bucket.key
                          )
                        }
                        className={`w-full rounded-lg border p-3.5 text-left transition-colors duration-200 ${
                          isSelected
                            ? "border-seismo-brand bg-seismo-brand-tint/60"
                            : "border-seismo-border bg-seismo-ground/60 hover:bg-seismo-surface/70"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="flex items-baseline gap-2.5 min-w-0">
                            <span className="font-mono text-sm font-bold text-seismo-ink seismo-tabular shrink-0">
                              {bucket.label}
                            </span>
                            <span className="text-xs text-seismo-ink-muted truncate">
                              {bucket.description}
                            </span>
                          </div>
                          <span className="font-mono text-sm font-semibold text-seismo-ink seismo-tabular shrink-0">
                            {NUMBER_FORMATTER.format(bucket.count)}{" "}
                            <span className="text-xs font-normal text-seismo-ink-muted">
                              ({bucket.percentage.toFixed(0)}%)
                            </span>
                          </span>
                        </div>
                        <div className="mt-2.5 h-2.5 w-full rounded-sm bg-seismo-border/70 overflow-hidden">
                          <div
                            className="h-full w-full origin-left rounded-sm transition-transform duration-500 motion-reduce:transition-none"
                            style={{
                              transform: `scaleX(${Math.max(widthPct / 100, 0)})`,
                              backgroundColor: barColor,
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accurate Regional Activity Breakdown */}
              <div className="lg:col-span-6 rounded-xl border border-seismo-border bg-seismo-elevated p-5 sm:p-6 flex flex-col justify-start gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-seismo-ink">
                    Sebaran Wilayah Teraktif
                  </h3>
                  <p className="mt-1 text-sm text-seismo-ink-secondary">
                    Enam kawasan dengan frekuensi kejadian tertinggi beserta
                    akumulasi wilayah lainnya.
                  </p>
                </div>

                <ol className="space-y-3.5">
                  {data.regionBreakdown.map((region, index) => {
                    const isOthers =
                      index === data.regionBreakdown.length - 1 &&
                      region.name.startsWith("Wilayah lainnya");
                    const widthPct =
                      maxRegionCount > 0
                        ? Math.max((region.count / maxRegionCount) * 100, 4)
                        : 0;

                    return (
                      <li key={region.name} className="space-y-1.5">
                        <div className="flex items-baseline justify-between gap-3 text-sm">
                          <span
                            className={`truncate ${
                              isOthers
                                ? "text-seismo-ink-muted font-medium"
                                : "text-seismo-ink font-semibold"
                            }`}
                          >
                            {region.name}
                          </span>
                          <span className="font-mono text-xs sm:text-sm font-semibold text-seismo-ink seismo-tabular shrink-0">
                            {region.count}{" "}
                            <span className="font-normal text-seismo-ink-muted">
                              ({region.percentage.toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-sm bg-seismo-surface overflow-hidden">
                          <div
                            className="h-full rounded-sm"
                            style={{
                              width: `${widthPct}%`,
                              backgroundColor: isOthers ? "#A8A295" : "#5C3B00",
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {/* Depth Key Synchronized with /map */}
                <div className="pt-4 border-t border-seismo-border">
                  <p className="text-xs font-semibold text-seismo-ink-muted mb-2.5">
                    Kode Warna Kedalaman (Selaras dengan Peta)
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {DEPTH_LEGEND.map((item) => (
                      <div
                        key={item.band}
                        className="flex items-center gap-1.5 text-xs text-seismo-ink-secondary"
                      >
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-mono seismo-tabular text-seismo-ink">
                          {item.band}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Recent BMKG Events Table / List */}
            <div className="rounded-xl border border-seismo-border bg-seismo-elevated overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-seismo-border px-5 py-4 sm:px-6">
                <div>
                  <h3 className="text-base font-bold text-seismo-ink">
                    Log Kejadian Terbaru
                  </h3>
                  <p
                    aria-live="polite"
                    className="text-xs sm:text-sm text-seismo-ink-secondary"
                  >
                    Menampilkan {filteredEvents.length} kejadian terbaru
                    {selectedBucket !== "all"
                      ? ` pada kategori ${
                          data.magnitudeBuckets.find(
                            (b) => b.key === selectedBucket
                          )?.label ?? ""
                        }`
                      : " dari seluruh magnitudo"}
                    .
                  </p>
                </div>
                <Link
                  to="/map"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-seismo-brand underline underline-offset-4 hover:text-seismo-brand-hover"
                >
                  <span>Lihat semua di peta interaktif</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="px-6 py-10 text-center space-y-3">
                  <p className="text-sm text-seismo-ink-secondary">
                    Tidak ada kejadian pada rentang magnitudo yang dipilih dalam
                    feed terbaru.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedBucket("all")}
                    className="inline-flex min-h-[40px] items-center rounded-md border border-seismo-border-strong bg-seismo-ground px-4 py-2 text-sm font-semibold text-seismo-ink hover:bg-seismo-surface"
                  >
                    Reset Filter Magnitudo
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-seismo-border bg-seismo-ground/70 text-xs font-semibold text-seismo-ink-muted">
                        <th scope="col" className="py-3 pl-5 pr-3 sm:pl-6">
                          Magnitudo
                        </th>
                        <th scope="col" className="py-3 px-3">
                          Wilayah
                        </th>
                        <th scope="col" className="py-3 px-3">
                          Kedalaman
                        </th>
                        <th
                          scope="col"
                          className="hidden md:table-cell py-3 px-3"
                        >
                          Koordinat
                        </th>
                        <th
                          scope="col"
                          className="hidden sm:table-cell py-3 pl-3 pr-5 sm:pr-6 text-right"
                        >
                          Waktu (WIB)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-seismo-border text-sm">
                      {filteredEvents.map((ev) => {
                        const depth = getDepthCategory(ev.depthKm);
                        return (
                          <tr
                            key={ev.id}
                            className="transition-colors hover:bg-seismo-ground/80"
                          >
                            <td className="py-3.5 pl-5 pr-3 sm:pl-6 whitespace-nowrap align-top sm:align-middle">
                              <span
                                className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-xs font-bold seismo-tabular ${
                                  ev.magnitude >= 4.5
                                    ? "bg-[#FEE2E2] text-seismo-alert"
                                    : ev.magnitude >= 3.5
                                      ? "bg-[#FEF3C7] text-seismo-moderate"
                                      : "bg-seismo-brand-tint text-seismo-brand"
                                }`}
                              >
                                M {ev.magnitude.toFixed(1)}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-medium text-seismo-ink">
                              <div>{ev.place}</div>
                              <time
                                dateTime={ev.timeIso || undefined}
                                className="sm:hidden mt-0.5 block font-mono text-[11px] font-normal text-seismo-ink-muted seismo-tabular"
                              >
                                {ev.timeWib}
                              </time>
                            </td>
                            <td className="py-3.5 pl-3 pr-5 sm:px-3 whitespace-nowrap align-top sm:align-middle text-right sm:text-left">
                              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-seismo-ink-secondary seismo-tabular">
                                <span
                                  aria-hidden="true"
                                  className="h-2 w-2 rounded-full shrink-0"
                                  style={{ backgroundColor: depth.color }}
                                />
                                {ev.depthLabel}
                              </span>
                            </td>
                            <td className="hidden md:table-cell py-3.5 px-3 font-mono text-xs text-seismo-ink-muted seismo-tabular whitespace-nowrap">
                              {formatCoordinates(ev.lat, ev.lng)}
                            </td>
                            <td className="hidden sm:table-cell py-3.5 pl-3 pr-5 sm:pr-6 text-right font-mono text-xs text-seismo-ink-secondary seismo-tabular whitespace-nowrap">
                              <time dateTime={ev.timeIso || undefined}>
                                {ev.timeWib}
                              </time>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
