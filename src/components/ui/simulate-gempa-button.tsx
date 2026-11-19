import { Activity } from "lucide-react";

interface SimulateGempaButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isRunning?: boolean;
}

export default function SimulateGempaButton({
  onClick,
  disabled = false,
  isRunning = false,
}: SimulateGempaButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-busy={isRunning}
      aria-label={
        isRunning
          ? "Simulasi gempa bumi sedang berjalan"
          : "Jalankan simulasi peringatan gempa bumi"
      }
      title={
        isRunning
          ? "Simulasi Gempa Sedang Berjalan"
          : disabled
            ? "Tunggu simulasi aktif selesai"
            : "Simulasi Gempa Bumi"
      }
      className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-xs sm:text-sm font-semibold transition-colors duration-150 active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed ${
        isRunning
          ? "border-[#B45309] bg-[#FEF3C7] text-[#92400E]"
          : "border-[#E5D5B5] bg-[#FFFBF2] text-[#5C3B00] hover:bg-[#F5EEE0]"
      }`}
    >
      <Activity className="h-4 w-4 shrink-0 text-[#B45309]" aria-hidden="true" />
      <span className="hidden md:inline whitespace-nowrap">
        {isRunning ? "Simulasi Gempa…" : "Simulasi Gempa"}
      </span>
    </button>
  );
}
