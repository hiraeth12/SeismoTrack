// components/cards/earthquake-popup-card.tsx
import React from "react";
import {
  formatDepthLabel,
  formatEventTimeWib,
  formatLatLng,
  getDepthColor,
  getMagnitudeBadgeClasses,
} from "../map/map-formatters";

interface Props {
  mag: number;
  depth: string;
  time: string | Date;
  // GeoJSON coordinate order: [lng, lat]
  coordinates: [number, number];
  place?: string;
}

const EarthquakePopupCard: React.FC<Props> = ({
  mag,
  depth,
  time,
  coordinates,
  place,
}) => {
  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);
  const depthColor = getDepthColor(depth);

  return (
    <div className="w-[264px] rounded-xl border border-[#E5E2DA] bg-white p-3.5 text-[#141413] shadow-[0_6px_20px_rgba(20,20,19,0.14)] font-sans">
      <div className="flex items-start justify-between gap-2 pr-7 pb-2.5 border-b border-[#E5E2DA]">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#6B6860]">
            Episentrum BMKG
          </p>
          <h3 className="text-sm font-bold text-[#141413] leading-snug break-words">
            {place || "Gempa Bumi Indonesia"}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-xs font-bold seismo-tabular ${getMagnitudeBadgeClasses(mag)}`}
        >
          M {mag.toFixed(1)}
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
            {formatDepthLabel(depth)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-[#6B6860]">Waktu</dt>
          <dd className="font-mono font-medium text-[#141413] seismo-tabular text-right">
            {formatEventTimeWib(time)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-[#6B6860]">Koordinat</dt>
          <dd className="font-mono font-medium text-[#141413] seismo-tabular text-right">
            {formatLatLng(lat, lng)}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default EarthquakePopupCard;
