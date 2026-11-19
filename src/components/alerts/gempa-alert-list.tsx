// src/components/alerts/gempa-alert-list.tsx
import React from "react";
import { AlertTriangle, X } from "lucide-react";
import TitikGempa from "../marker/titik_gempa";
import {
  formatDepthLabel,
  formatEventTimeWib,
  formatLatLng,
} from "../map/map-formatters";

interface Props {
  data: TitikGempa[];
  onDismissItem?: (id: string) => void;
}

const GempaAlertList: React.FC<Props> = ({ data, onDismissItem }) => {
  if (data.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 pointer-events-none">
      {data.map((agi) => {
        const affected = agi.infoGempa.listKotaTerdampak ?? [];
        return (
          <aside
            key={agi.id}
            role="alert"
            className="map-panel-enter pointer-events-auto w-[290px] sm:w-[320px] rounded-xl border border-[#FECACA] bg-white shadow-[0_8px_24px_rgba(20,20,19,0.14)] overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 bg-[#FEF2F2] border-b border-[#FECACA] px-3.5 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className="h-4 w-4 shrink-0 text-[#B91C1C]" aria-hidden="true" />
                <span className="text-xs font-bold text-[#991B1B] truncate">
                  Peringatan Aktif · M {Number(agi.mag).toFixed(1)}
                </span>
              </div>
              {onDismissItem && (
                <button
                  type="button"
                  onClick={() => onDismissItem(agi.id)}
                  aria-label="Tutup kartu peringatan aktif"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#991B1B] transition-colors hover:bg-[#FEE2E2]"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="p-3.5 space-y-2.5 text-xs">
              <dl className="grid grid-cols-5 gap-2 font-mono text-[11px] seismo-tabular">
                <div className="col-span-2 rounded bg-[#F2F0EB]/80 px-2 py-1.5">
                  <dt className="font-sans text-[10px] text-[#6B6860]">
                    Kedalaman
                  </dt>
                  <dd className="font-semibold text-[#141413]">
                    {formatDepthLabel(agi.depth)}
                  </dd>
                </div>
                <div className="col-span-3 rounded bg-[#F2F0EB]/80 px-2 py-1.5">
                  <dt className="font-sans text-[10px] text-[#6B6860]">
                    Koordinat
                  </dt>
                  <dd className="font-semibold text-[#141413] whitespace-nowrap">
                    {formatLatLng(agi.infoGempa.lat, agi.infoGempa.lng)}
                  </dd>
                </div>
              </dl>

              <p className="font-mono text-[11px] text-[#6B6860] seismo-tabular">
                {formatEventTimeWib(agi.infoGempa.time)}
              </p>

              {agi.infoGempa.message && (
                <p className="text-xs leading-relaxed text-[#4E4C46] break-words">
                  {agi.infoGempa.message}
                </p>
              )}

              {affected.length > 0 && (
                <div className="pt-2 border-t border-[#E5E2DA]">
                  <p className="text-[11px] font-semibold text-[#141413] mb-1.5">
                    Wilayah Terpantau Gelombang ({affected.length})
                  </p>
                  <ul className="max-h-24 overflow-y-auto map-scrollbar space-y-1">
                    {affected.slice(0, 6).map((kota) => (
                      <li
                        key={`${kota.name}-${kota.distance}`}
                        className="flex items-center justify-between gap-2 text-[11px]"
                      >
                        <span className="truncate font-medium text-[#141413]">
                          {kota.name}
                        </span>
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                            kota.hit
                              ? "bg-[#FEE2E2] text-[#991B1B]"
                              : "bg-[#F2F0EB] text-[#4E4C46]"
                          }`}
                        >
                          {kota.hit
                            ? "TERDAMPAK"
                            : `${Math.max(0, Math.round(kota.distance))} km`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        );
      })}
    </div>
  );
};

export default GempaAlertList;
