// src/components/cards/shake-map-card.tsx
import React, { useState } from "react";
import { ExternalLink, X } from "lucide-react";

interface Props {
  fileName: string;
  onClose: () => void;
}

const ShakeMapCard: React.FC<Props> = ({ fileName, onClose }) => {
  const [imgError, setImgError] = useState(false);
  const url = `https://bmkg-content-inatews.storage.googleapis.com/${fileName}`;

  return (
    <aside
      aria-label="Peta guncangan ShakeMap MMI"
      className="map-panel-enter pointer-events-auto w-[280px] sm:w-[320px] rounded-xl border border-[#E5E2DA] bg-white shadow-[0_8px_24px_rgba(20,20,19,0.14)] overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 border-b border-[#E5E2DA] bg-[#FAFAF8] px-3.5 py-2.5">
        <div>
          <h2 className="text-xs font-bold text-[#141413]">
            ShakeMap MMI (BMKG)
          </h2>
          <p className="font-mono text-[11px] text-[#6B6860] truncate max-w-[190px]">
            {fileName}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup panel ShakeMap"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E2DA] bg-white text-[#4E4C46] transition-colors hover:bg-[#F2F0EB] hover:text-[#141413]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="p-3 bg-white">
        {imgError ? (
          <div className="rounded-lg border border-[#E5E2DA] bg-[#FAFAF8] p-4 text-center space-y-2">
            <p className="text-xs font-semibold text-[#141413]">
              ShakeMap belum tersedia untuk kejadian ini
            </p>
            <p className="text-[11px] text-[#6B6860]">
              BMKG umumnya menerbitkan ShakeMap untuk gempa dirasakan signifikan.
            </p>
          </div>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="overflow-hidden rounded-lg border border-[#E5E2DA] bg-[#FAFAF8]">
              <img
                src={url}
                alt={`Peta guncangan ShakeMap BMKG ${fileName}`}
                width={300}
                height={300}
                onError={() => setImgError(true)}
                className="w-full h-auto max-h-[280px] object-contain"
              />
            </div>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#5C3B00] group-hover:underline">
              <span>Buka gambar ukuran penuh</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </a>
        )}
      </div>
    </aside>
  );
};

export default ShakeMapCard;
