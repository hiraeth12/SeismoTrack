// src/components/alerts/gempa-bumi-mobile-alert.tsx
import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import TitikGempa from "../marker/titik_gempa";
import {
  formatDepthLabel,
  formatEventTimeWib,
  getMagnitudeBadgeClasses,
} from "../map/map-formatters";

interface Props {
  data: TitikGempa;
}

const GempaBumiMobileAlert: React.FC<Props> = ({ data }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const magValue = Number(data.infoGempa.mag ?? 0);

  return (
    <aside
      role="status"
      aria-live="polite"
      className="map-panel-enter md:hidden fixed top-[68px] left-3 right-3 z-20 pointer-events-auto rounded-xl border border-[#FDE68A] bg-white shadow-[0_6px_20px_rgba(20,20,19,0.14)] overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 bg-[#FFFBEB] border-b border-[#FDE68A] px-3 py-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#B45309]" aria-hidden="true" />
          <span className="text-xs font-bold text-[#92400E] truncate">
            Gempa Terdeteksi
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Tutup peringatan seluler"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#92400E] hover:bg-[#FEF3C7]"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      <div className="px-3 py-2.5 flex items-center justify-between gap-2 text-xs">
        <div className="min-w-0">
          <p className="font-bold text-[#141413] truncate">
            {data.infoGempa.place || "Wilayah Indonesia"}
          </p>
          <p className="font-mono text-[11px] text-[#6B6860] seismo-tabular">
            {formatDepthLabel(data.infoGempa.depth)} ·{" "}
            {formatEventTimeWib(data.infoGempa.time)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded border px-2 py-0.5 font-mono text-xs font-bold seismo-tabular ${getMagnitudeBadgeClasses(magValue)}`}
        >
          M {magValue.toFixed(1)}
        </span>
      </div>
    </aside>
  );
};

export default GempaBumiMobileAlert;
