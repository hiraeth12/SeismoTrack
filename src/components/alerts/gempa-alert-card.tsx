import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import TitikGempa from "../marker/titik_gempa";
import {
  formatDepthLabel,
  formatEventTimeWib,
  formatLatLng,
  getMagnitudeBadgeClasses,
} from "../map/map-formatters";

interface GempaAlertCardProps {
  data: TitikGempa;
  onDismiss?: () => void;
}

const GempaAlertCard: React.FC<GempaAlertCardProps> = ({ data, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const magValue = Number(data.mag ?? 0);

  return (
    <aside
      role="status"
      aria-live="polite"
      className="map-panel-enter pointer-events-auto w-[280px] sm:w-[310px] rounded-xl border border-[#FDE68A] bg-white shadow-[0_6px_20px_rgba(20,20,19,0.12)] overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 bg-[#FFFBEB] border-b border-[#FDE68A] px-3.5 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#B45309]" aria-hidden="true" />
          <span className="text-xs font-bold text-[#92400E] truncate">
            Gempa Baru Terdeteksi
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          aria-label="Tutup notifikasi gempa baru"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#92400E] transition-colors hover:bg-[#FEF3C7]"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="p-3.5 space-y-2.5 text-xs">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-[#141413] leading-snug break-words">
            {data.infoGempa.place || "Wilayah Indonesia"}
          </p>
          <span
            className={`shrink-0 rounded border px-2 py-0.5 font-mono text-xs font-bold seismo-tabular ${getMagnitudeBadgeClasses(magValue)}`}
          >
            M {magValue.toFixed(1)}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-2 font-mono text-[11px] seismo-tabular">
          <div>
            <dt className="font-sans text-[10px] text-[#6B6860]">Kedalaman</dt>
            <dd className="font-semibold text-[#141413]">
              {formatDepthLabel(data.depth)}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-[10px] text-[#6B6860]">Koordinat</dt>
            <dd className="font-semibold text-[#141413] truncate">
              {formatLatLng(data.infoGempa.lat, data.infoGempa.lng)}
            </dd>
          </div>
        </dl>

        <p className="font-mono text-[11px] text-[#6B6860] seismo-tabular">
          {formatEventTimeWib(data.infoGempa.time)}
        </p>
      </div>
    </aside>
  );
};

export default GempaAlertCard;
