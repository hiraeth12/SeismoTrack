import { Waves } from "lucide-react";

interface SimulateTsunamiButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isRunning?: boolean;
}

export default function SimulateTsunamiButton({
  onClick,
  disabled = false,
  isRunning = false,
}: SimulateTsunamiButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-busy={isRunning}
      aria-label={
        isRunning
          ? "Simulasi tsunami sedang berjalan"
          : "Jalankan simulasi peringatan tsunami"
      }
      title={
        isRunning
          ? "Simulasi Tsunami Sedang Berjalan"
          : disabled
            ? "Tunggu simulasi aktif selesai"
            : "Simulasi Peringatan Tsunami"
      }
      className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-xs sm:text-sm font-semibold transition-colors duration-150 active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed ${
        isRunning
          ? "border-[#0369A1] bg-[#E0F2FE] text-[#0C4A6E]"
          : "border-[#CBDCE8] bg-[#F5FAFE] text-[#0C4A6E] hover:bg-[#E6F3FC]"
      }`}
    >
      <Waves className="h-4 w-4 shrink-0 text-[#0369A1]" aria-hidden="true" />
      <span className="hidden md:inline whitespace-nowrap">
        {isRunning ? "Simulasi Tsunami…" : "Simulasi Tsunami"}
      </span>
    </button>
  );
}
