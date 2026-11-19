import { AlertOctagon, X } from "lucide-react";
import TitikTsunami from "./marker/titik_tsunami";

interface TsunamiAlertProps {
  alertTsunami: TitikTsunami;
  onDismiss?: () => void;
}

export default function TsunamiAlert({
  alertTsunami,
  onDismiss,
}: TsunamiAlertProps) {
  const level = alertTsunami.infoTsunami.level || "Peringatan Dini Tsunami";
  const message = alertTsunami.infoTsunami.message || "";
  const affectedAreas = alertTsunami.infoTsunami.listKotaTerdampak ?? [];

  return (
    <div
      id="tsunami-warning"
      role="alertdialog"
      aria-modal="true"
      aria-label="Peringatan dini potensi tsunami"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141413]/65 p-4 pointer-events-auto"
    >
      <div className="map-panel-enter w-full max-w-xl rounded-2xl border-2 border-[#DC2626] bg-[#1A1111] text-[#FAFAF8] shadow-[0_20px_56px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="flex items-center justify-between gap-3 bg-[#B91C1C] px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="h-5 w-5 shrink-0 text-[#FEF08A]" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#FEF08A]">
                Potensi Tsunami Terdeteksi
              </p>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {level}
              </h2>
            </div>
          </div>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Tutup peringatan tsunami"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-black/25 text-white transition-colors hover:bg-black/45"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-sm leading-relaxed text-[#F5F2EE] whitespace-pre-wrap break-words">
            {message}
          </p>

          {affectedAreas.length > 0 && (
            <div className="rounded-xl border border-white/15 bg-white/5 p-3.5">
              <p className="text-xs font-semibold text-[#FEF08A] mb-2">
                Wilayah Pesisir Terpantau ({affectedAreas.length})
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto map-scrollbar">
                {affectedAreas.slice(0, 14).map((area) => (
                  <span
                    key={`${area.name}-${area.distance}`}
                    className="rounded bg-white/10 px-2 py-0.5 font-mono text-[11px] text-[#FAFAF8]"
                  >
                    {area.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
            <p className="text-xs text-[#C8C2BC]">
              Ikuti arahan evakuasi resmi dari BMKG, BNPB, dan BPBD setempat.
            </p>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#FAFAF8] px-4 text-xs font-bold text-[#141413] transition-colors hover:bg-[#EBE7DD]"
              >
                Lihat Garis Pantai di Peta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
