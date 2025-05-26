// src/App.tsx
import { Routes, Route } from "react-router-dom";
import MapPages from "./MapPages";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/map" element={<MapPages />} />
    </Routes>
  );
}
