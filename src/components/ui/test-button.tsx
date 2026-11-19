import React from "react";
import { ListFilter, Volume2, VolumeX } from "lucide-react";
import SimulateGempaButton from "./simulate-gempa-button";
import SimulateTsunamiButton from "./simulate-tsunami-button";
import BackToHomeButton from "./home-button";
import { MAP_NUMBER_FORMATTER } from "../map/map-formatters";

interface Props {
  onTestGempa: () => void;
  onTestTsunami: () => void;
  eventCount: number;
  isGeoReady: boolean;
  activeSimulation: "gempa" | "tsunami" | null;
  isMuted: boolean;
  onToggleMute: () => void;
  isEventLogOpen: boolean;
  onToggleEventLog: () => void;
}

const TestButtons: React.FC<Props> = ({
  onTestGempa,
  onTestTsunami,
  eventCount,
  isGeoReady,
  activeSimulation,
  isMuted,
  onToggleMute,
  isEventLogOpen,
  onToggleEventLog,
}) => {
  return (
    <header className="fixed top-3 left-3 right-3 z-30 pointer-events-none flex items-center justify-between gap-2">
      {/* Left Observatory Brand & Status Island */}
      <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-[#E5E2DA] bg-[#FAFAF8]/95 p-1.5 shadow-[0_2px_10px_rgba(20,20,19,0.08)]">
        <BackToHomeButton />

        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 text-xs whitespace-nowrap">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#15803D]" />
          </span>
          <span className="font-semibold text-[#141413]">BMKG InaTEWS</span>
          {eventCount > 0 && (
            <span className="font-mono text-[#6B6860] seismo-tabular">
              · {MAP_NUMBER_FORMATTER.format(eventCount)} kejadian
            </span>
          )}
        </div>
      </div>

      {/* Right Control Bar Island */}
      <div className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-[#E5E2DA] bg-[#FAFAF8]/95 p-1.5 shadow-[0_2px_10px_rgba(20,20,19,0.08)]">
        <SimulateGempaButton
          onClick={onTestGempa}
          disabled={!isGeoReady || activeSimulation !== null}
          isRunning={activeSimulation === "gempa"}
        />
        <SimulateTsunamiButton
          onClick={onTestTsunami}
          disabled={!isGeoReady || activeSimulation !== null}
          isRunning={activeSimulation === "tsunami"}
        />

        <button
          type="button"
          onClick={onToggleMute}
          aria-pressed={isMuted}
          aria-label={isMuted ? "Aktifkan suara peringatan" : "Bisukan suara peringatan"}
          title={isMuted ? "Suara dibisukan" : "Suara aktif"}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors duration-150 active:scale-[0.98] ${
            isMuted
              ? "border-[#E5E2DA] bg-[#F2F0EB] text-[#6B6860] hover:bg-[#E5E2DA]"
              : "border-[#E5E2DA] bg-white text-[#141413] hover:bg-[#F2F0EB]"
          }`}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={onToggleEventLog}
          aria-expanded={isEventLogOpen}
          aria-controls="map-event-log"
          aria-label={isEventLogOpen ? "Sembunyikan log kejadian" : "Tampilkan log kejadian"}
          className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-xs sm:text-sm font-semibold transition-colors duration-150 active:scale-[0.98] ${
            isEventLogOpen
              ? "border-[#5C3B00] bg-[#5C3B00] text-white hover:bg-[#422A00]"
              : "border-[#E5E2DA] bg-white text-[#141413] hover:bg-[#F2F0EB]"
          }`}
        >
          <ListFilter className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Log</span>
          {eventCount > 0 && (
            <span
              className={`hidden sm:inline rounded px-1.5 py-0.5 font-mono text-[11px] seismo-tabular ${
                isEventLogOpen
                  ? "bg-white/20 text-white"
                  : "bg-[#F2F0EB] text-[#4E4C46]"
              }`}
            >
              {MAP_NUMBER_FORMATTER.format(eventCount)}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default TestButtons;
