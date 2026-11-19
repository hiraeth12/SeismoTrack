// components/cards/gempa-info-popup-card.tsx
import { InfoGempa } from "../libs/interface";
import {
  formatDepthLabel,
  formatEventTimeWib,
  formatLatLng,
  getDepthColor,
  getMagnitudeBadgeClasses,
} from "../map/map-formatters";

interface Props {
  data: InfoGempa;
}

export default function GempaInfoPopupCard({ data }: Props) {
  const magValue = Number(data.mag || 0);
  const depthColor = getDepthColor(data.depth);

  return (
    <div className="w-[272px] rounded-xl border border-[#E5E2DA] bg-white p-3.5 text-[#141413] shadow-[0_6px_20px_rgba(20,20,19,0.14)] font-sans">
      <div className="flex items-start justify-between gap-2 pr-7 pb-2.5 border-b border-[#E5E2DA]">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#6B6860]">
            Detail Kejadian
          </p>
          <h3 className="text-sm font-bold text-[#141413] leading-snug break-words">
            {data.place || "Wilayah Indonesia"}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-xs font-bold seismo-tabular ${getMagnitudeBadgeClasses(magValue)}`}
        >
          M {magValue.toFixed(1)}
        </span>
      </div>

      <dl className="mt-2.5 space-y-1.5 text-xs">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[#6B6860]">Kedalaman</dt>
          <dd className="inline-flex items-center gap-1.5 font-mono font-semibold text-[#141413] seismo-tabular">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: depthColor }}
            />
            {formatDepthLabel(data.depth)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-[#6B6860]">Waktu</dt>
          <dd className="font-mono font-medium text-[#141413] seismo-tabular text-right">
            {formatEventTimeWib(data.time)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-[#6B6860]">Koordinat</dt>
          <dd className="font-mono font-medium text-[#141413] seismo-tabular text-right">
            {formatLatLng(data.lat, data.lng)}
          </dd>
        </div>
      </dl>

      {data.message && (
        <p className="mt-2.5 pt-2.5 border-t border-[#E5E2DA] text-xs leading-relaxed text-[#4E4C46] break-words">
          {data.message}
        </p>
      )}
    </div>
  );
}
