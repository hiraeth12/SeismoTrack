// src/components/alerts/tsunami-alert-card.tsx
import React, { useState } from "react";
import { Waves, X } from "lucide-react";
import TitikTsunami from "../marker/titik_tsunami";

interface Props {
  data: TitikTsunami;
  onDismiss?: () => void;
}

const TsunamiAlertCard: React.FC<Props> = ({ data, onDismiss }) => {
  const level = data.infoTsunami.level ?? "Peringatan Tsunami";
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside
      role="alert"
      className="map-panel-enter pointer-events-auto w-[290px] sm:w-[320px] rounded-xl border border-[#FECACA] bg-white shadow-[0_8px_24px_rgba(20,20,19,0.14)] overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 bg-[#B91C1C] px-3.5 py-2 text-white">
        <div className="flex items-center gap-2 min-w-0">
          <Waves className="h-4 w-4 shrink-0 text-[#FEF08A]" aria-hidden="true" />
          <span className="text-xs font-bold truncate">{level}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          aria-label="Tutup kartu informasi tsunami"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/20 text-white transition-colors hover:bg-black/35"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="p-3.5 space-y-2.5 text-xs">
        <p className="leading-relaxed text-[#4E4C46] whitespace-pre-wrap break-words max-h-36 overflow-y-auto map-scrollbar">
          {data.infoTsunami.message}
        </p>

        {data.infoTsunami.listKotaTerdampak.length > 0 && (
          <div className="pt-2 border-t border-[#E5E2DA]">
            <p className="text-[11px] font-semibold text-[#141413] mb-1">
              Garis Pantai Terpantau (
              {data.infoTsunami.listKotaTerdampak.length})
            </p>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto map-scrollbar">
              {data.infoTsunami.listKotaTerdampak.slice(0, 10).map((kota) => (
                <span
                  key={`${kota.name}-${kota.distance}`}
                  className="rounded bg-[#FEF2F2] border border-[#FECACA] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#991B1B]"
                >
                  {kota.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default TsunamiAlertCard;
