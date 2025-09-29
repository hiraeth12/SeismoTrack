import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landing-page/landing-page";

// Lazy load the map page to reduce initial bundle size
const MapPage = lazy(() => import("../pages/map-page/map-page"));

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-white text-xl">Loading Map...</div>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/map"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <MapPage />
          </Suspense>
        }
      />
    </Routes>
  );
}