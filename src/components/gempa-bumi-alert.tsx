import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { formatDepthLabel } from "./map/map-formatters";

interface GempaBumiAlertProps {
  magnitudo?: number;
  kedalaman?: string;
  show?: boolean;
  closeInSecond?: number;
  isMuted?: boolean;
  onDismiss?: () => void;
}

export default function GempaBumiAlert({
  props,
}: {
  props: GempaBumiAlertProps;
}) {
  const { show, closeInSecond, isMuted, magnitudo, kedalaman, onDismiss } =
    props;
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!show) {
      setClosed(true);
      return;
    }

    setClosed(false);

    if (isMuted) return;

    const notif = new Audio("/sounds/system-notification-199277.mp3");
    notif.volume = 0.45;
    notif.play().catch(() => {});

    const warnTimer = window.setTimeout(() => {
      const warning = new Audio("/sounds/error-call-to-attention-129258.mp3");
      warning.volume = 0.45;
      warning.play().catch(() => {});
    }, 900);

    return () => {
      window.clearTimeout(warnTimer);
      notif.pause();
    };
  }, [show, isMuted]);

  useEffect(() => {
    if (!closeInSecond || closed) return;
    const timer = window.setTimeout(() => {
      setClosed(true);
      onDismiss?.();
    }, closeInSecond * 1000);
    return () => window.clearTimeout(timer);
  }, [closeInSecond, closed, onDismiss]);

  if (closed) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="false"
      aria-label="Peringatan dini gempa bumi terdeteksi"
      className="fixed inset-x-4 top-[72px] z-50 mx-auto max-w-lg pointer-events-auto map-panel-enter"
    >
      <div className="rounded-xl border border-[#DC2626] bg-[#1C1212] text-[#FAFAF8] shadow-[0_14px_40px_rgba(20,10,10,0.45)] overflow-hidden">
        <div className="flex items-center justify-between gap-3 bg-[#991B1B] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#FEF08A]" aria-hidden="true" />
            <span className="text-xs font-bold tracking-wide uppercase">
              Peringatan Dini Gempa Bumi
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setClosed(true);
              onDismiss?.();
            }}
            aria-label="Tutup peringatan gempa bumi"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/25 text-white transition-colors hover:bg-black/45"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#FAFAF8]">
              Gelombang seismik P &amp; S sedang menjalar
            </p>
            <p className="text-xs text-[#D6CFCB]">
              Pantau peta untuk melihat radius gelombang dan estimasi wilayah
              terdampak.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-lg bg-white/10 px-3 py-2 text-center">
              <div className="font-mono text-xl font-bold text-[#FEF08A] seismo-tabular">
                {magnitudo !== undefined
                  ? Number(magnitudo).toFixed(1)
                  : "—"}
              </div>
              <div className="text-[10px] font-medium text-[#D6CFCB]">
                MAGNITUDO
              </div>
            </div>

            <div className="rounded-lg bg-white/10 px-3 py-2 text-center">
              <div className="font-mono text-base font-bold text-white seismo-tabular">
                {formatDepthLabel(kedalaman)}
              </div>
              <div className="text-[10px] font-medium text-[#D6CFCB]">
                KEDALAMAN
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
