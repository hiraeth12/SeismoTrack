// src/components/cards/gempa-dirasakan-card.tsx
import React from "react";
import { Crosshair, Image as ImageIcon } from "lucide-react";
import TitikGempa from "../marker/titik_gempa";
import { InfoGempa } from "../libs/interface";
import {
  formatDepthLabel,
  formatEventTimeWib,
  formatLatLng,
  getDepthColor,
  getMagnitudeBadgeClasses,
} from "../map/map-formatters";

interface Props {
  data: TitikGempa;
  onSelect: (info: InfoGempa) => void;
  onOpenShakeMap?: (mmi: number) => void;
}

const GempaDirasakanCard: React.FC<Props> = ({
  data,
  onSelect,
  onOpenShakeMap,
}) => {
  const magValue = Number(data.infoGempa.mag ?? 0);
  const depthColor = getDepthColor(data.infoGempa.depth);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#6B6860]">
            Dirasakan Terakhir (BMKG)
          </p>
          <p className="mt-0.5 text-sm font-bold text-[#141413] leading-snug break-words">
            {data.infoGempa.place || "Wilayah Indonesia"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-md border px-2.5 py-1 font-mono text-sm font-bold seismo-tabular ${getMagnitudeBadgeClasses(magValue)}`}
        >
          M {magValue.toFixed(1)}
        </span>
      </div>

      <dl className="grid grid-cols-5 gap-2 text-xs">
        <div className="col-span-2 rounded-lg bg-[#F2F0EB]/80 px-2.5 py-2">
          <dt className="text-[11px] text-[#6B6860]">Kedalaman</dt>
          <dd className="mt-0.5 inline-flex items-center gap-1.5 font-mono font-semibold text-[#141413] seismo-tabular">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: depthColor }}
            />
            {formatDepthLabel(data.infoGempa.depth)}
          </dd>
        </div>

        <div className="col-span-3 rounded-lg bg-[#F2F0EB]/80 px-2.5 py-2">
          <dt className="text-[11px] text-[#6B6860]">Koordinat</dt>
          <dd className="mt-0.5 font-mono text-[11px] font-semibold text-[#141413] seismo-tabular whitespace-nowrap">
            {formatLatLng(data.infoGempa.lat, data.infoGempa.lng)}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-[11px] text-[#6B6860] seismo-tabular">
        {formatEventTimeWib(data.infoGempa.time)}
      </p>

      {data.infoGempa.message && (
        <p className="text-xs leading-relaxed text-[#4E4C46] line-clamp-3 break-words">
          {data.infoGempa.message}
        </p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onSelect(data.infoGempa)}
          className="inline-flex flex-1 h-9 items-center justify-center gap-1.5 rounded-lg bg-[#5C3B00] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#422A00] active:scale-[0.98]"
        >
          <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Fokus di Peta</span>
        </button>

        {data.infoGempa.mmi !== 0 && onOpenShakeMap && (
          <button
            type="button"
            onClick={() => onOpenShakeMap(data.infoGempa.mmi)}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D4CFC4] bg-white px-3 text-xs font-semibold text-[#141413] transition-colors hover:bg-[#F2F0EB]"
          >
            <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>ShakeMap</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GempaDirasakanCard;
