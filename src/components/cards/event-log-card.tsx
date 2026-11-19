// src/components/cards/event-log-card.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import TitikGempa from "../marker/titik_gempa";
import { InfoGempa } from "../libs/interface";
import {
  formatDepthLabel,
  formatEventTimeWib,
  getDepthColor,
  getMagnitudeBadgeClasses,
  MAP_NUMBER_FORMATTER,
} from "../map/map-formatters";

type MagFilter = "all" | "3.5" | "4.5";

interface Props {
  events: TitikGempa[];
  selectedEventId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (info: InfoGempa) => void;
}

const PAGE_SIZE = 40;

const EventLogCard: React.FC<Props> = ({
  events,
  selectedEventId,
  isOpen,
  onClose,
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [magFilter, setMagFilter] = useState<MagFilter>("all");
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleLimit(PAGE_SIZE);
  }, [query, magFilter]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && window.innerWidth < 1024) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const minMag =
      magFilter === "4.5" ? 4.5 : magFilter === "3.5" ? 3.5 : 0;

    return events.filter((item) => {
      if (magFilter !== "all") {
        const mag = Number(item.infoGempa.mag ?? 0);
        if (!Number.isFinite(mag) || mag < minMag) return false;
      }
      if (normalizedQuery) {
        const place = (item.infoGempa.place ?? "").toLowerCase();
        return place.includes(normalizedQuery);
      }
      return true;
    });
  }, [events, query, magFilter]);

  const displayedEvents = useMemo(
    () => filteredEvents.slice(0, visibleLimit),
    [filteredEvents, visibleLimit]
  );

  if (!isOpen) return null;

  return (
    <aside
      id="map-event-log"
      aria-label="Log kejadian gempa bumi BMKG"
      className="map-panel-enter fixed z-30 lg:z-20 right-3 left-3 sm:left-auto top-[68px] bottom-3 sm:w-[344px] flex flex-col rounded-xl border border-[#E5E2DA] bg-[#FAFAF8]/95 shadow-[0_8px_28px_rgba(20,20,19,0.12)] overflow-hidden pointer-events-auto overscroll-contain"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#E5E2DA] bg-white px-4 py-3">
        <div>
          <h2 className="text-sm font-bold text-[#141413]">Log Kejadian</h2>
          <p
            aria-live="polite"
            className="font-mono text-[11px] text-[#6B6860] seismo-tabular"
          >
            {MAP_NUMBER_FORMATTER.format(filteredEvents.length)} dari{" "}
            {MAP_NUMBER_FORMATTER.format(events.length)} rekaman
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup panel log kejadian"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E2DA] bg-[#FAFAF8] text-[#4E4C46] transition-colors hover:bg-[#F2F0EB] hover:text-[#141413]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Search & Magnitude Filter Controls */}
      <div className="space-y-2.5 border-b border-[#E5E2DA] bg-[#FAFAF8] px-3.5 py-3">
        <div className="relative">
          <label htmlFor="event-log-search" className="sr-only">
            Cari wilayah gempa
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6860]"
            aria-hidden="true"
          />
          <input
            id="event-log-search"
            name="event-log-search"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari wilayah (mis. Flores, Jawa)…"
            className="h-9 w-full rounded-lg border border-[#D4CFC4] bg-white pl-9 pr-8 text-xs text-[#141413] placeholder:text-[#6B6860]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Hapus pencarian wilayah"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#6B6860] hover:text-[#141413]"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label="Filter magnitudo log kejadian"
          className="grid grid-cols-3 gap-1.5"
        >
          {(
            [
              { key: "all", label: "Semua" },
              { key: "3.5", label: "≥ M 3.5" },
              { key: "4.5", label: "≥ M 4.5" },
            ] as const
          ).map((chip) => {
            const active = magFilter === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                aria-pressed={active}
                onClick={() => setMagFilter(chip.key)}
                className={`h-8 rounded-md border text-xs font-semibold transition-colors ${
                  active
                    ? "border-[#5C3B00] bg-[#5C3B00] text-white"
                    : "border-[#E5E2DA] bg-white text-[#4E4C46] hover:bg-[#F2F0EB] hover:text-[#141413]"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Windowed Event List */}
      <div className="flex-1 overflow-y-auto map-scrollbar overscroll-contain p-2">
        {events.length === 0 ? (
          <div className="p-6 text-center space-y-2">
            <p className="text-xs font-semibold text-[#141413]">
              Memuat log gempa BMKG…
            </p>
            <p className="text-[11px] text-[#6B6860]">
              Menyiapkan data episentrum dan garis sesar Indonesia.
            </p>
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="p-6 text-center space-y-2.5">
            <p className="text-xs font-medium text-[#4E4C46]">
              Tidak ada kejadian yang cocok dengan filter saat ini.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setMagFilter("all");
              }}
              className="inline-flex h-8 items-center rounded-md border border-[#D4CFC4] bg-white px-3 text-xs font-semibold text-[#141413] hover:bg-[#F2F0EB]"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {displayedEvents.map((item) => {
              const magValue = Number(item.infoGempa.mag ?? 0);
              const depthColor = getDepthColor(item.infoGempa.depth);
              const isSelected = selectedEventId === item.infoGempa.id;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(item.infoGempa);
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    aria-current={isSelected ? "true" : undefined}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "border-[#5C3B00] bg-[#F5EEE0]/80"
                        : "border-[#E5E2DA] bg-white hover:bg-[#F2F0EB]/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-[#141413] leading-snug break-words">
                        {item.infoGempa.place || "Wilayah Indonesia"}
                      </span>
                      <span
                        className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[11px] font-bold seismo-tabular ${getMagnitudeBadgeClasses(magValue)}`}
                      >
                        M {magValue.toFixed(1)}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between gap-2 font-mono text-[11px] text-[#6B6860] seismo-tabular">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: depthColor }}
                        />
                        {formatDepthLabel(item.infoGempa.depth)}
                      </span>
                      <span className="truncate">
                        {formatEventTimeWib(item.infoGempa.time)}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {filteredEvents.length > visibleLimit && (
          <div className="pt-2.5 pb-1 px-1">
            <button
              type="button"
              onClick={() => setVisibleLimit((prev) => prev + PAGE_SIZE)}
              className="w-full h-9 rounded-lg border border-[#D4CFC4] bg-white text-xs font-semibold text-[#141413] transition-colors hover:bg-[#F2F0EB]"
            >
              Tampilkan lebih banyak (
              {MAP_NUMBER_FORMATTER.format(
                filteredEvents.length - visibleLimit
              )}{" "}
              tersisa)
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default EventLogCard;
