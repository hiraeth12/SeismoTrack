import { Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "../pages/landing-page/landing-page";

// Strictly lazy-load the MapPage so Mapbox GL, Turf, Web Workers, and Socket.IO
// never enter the landing page JavaScript bundle.
const MapPage = lazy(() => import("../pages/map-page/map-page"));

function MapLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[100dvh] bg-[#111110] text-[#FAFAF8] flex flex-col items-center justify-center gap-4 px-6 font-sans"
    >
      <div
        aria-hidden="true"
        className="h-9 w-9 rounded-full border-2 border-[#FAFAF8]/20 border-t-[#FAFAF8] animate-spin motion-reduce:animate-none"
      />
      <div className="text-center space-y-1">
        <p className="text-base font-semibold tracking-tight">
          Memuat Peta Pemantauan SeismoTrack
        </p>
        <p className="text-sm text-[#A8A49B]">
          Menyiapkan visualisasi peta geografis dan aliran data BMKG InaTEWS…
        </p>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="seismo-landing min-h-[100dvh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-md space-y-6">
        <p className="font-mono text-sm font-medium text-seismo-ink-muted seismo-tabular">
          404
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-seismo-ink seismo-balance">
          Halaman tidak ditemukan
        </h1>
        <p className="text-base text-seismo-ink-secondary leading-relaxed">
          Tautan yang Anda buka tidak tersedia di SeismoTrack. Kembali ke
          beranda atau buka langsung peta pemantauan gempa real-time.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-seismo-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-seismo-brand-hover"
          >
            Kembali ke Beranda
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center justify-center rounded-md border border-seismo-border-strong bg-seismo-elevated px-5 py-2.5 text-sm font-semibold text-seismo-ink transition-colors hover:bg-seismo-surface"
          >
            Buka Peta Pemantauan
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/map"
        element={
          <Suspense fallback={<MapLoadingFallback />}>
            <MapPage />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
