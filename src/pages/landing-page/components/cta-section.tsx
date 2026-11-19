import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useReveal } from "../hooks/use-reveal";

export default function CtaSection() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="mulai"
      ref={ref}
      data-visible={visible}
      className="seismo-reveal scroll-mt-20 bg-[#1A1917] text-[#FAFAF8] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold leading-[1.12] tracking-[-0.025em] text-[#FAFAF8] seismo-balance">
              Siap memantau aktivitas seismik Indonesia secara langsung?
            </h2>
            <p className="text-base sm:text-lg leading-[1.65] text-[#C8C4BA] seismo-pretty">
              Buka halaman peta pemantauan untuk mengakses peta geografis
              interaktif, garis sesar aktif, log kejadian lengkap, serta fitur
              simulasi peringatan dini gempa dan tsunami.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2.5 shrink-0">
            <Link
              to="/map"
              className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-md bg-[#FAFAF8] px-7 py-3.5 text-base font-bold text-[#141413] transition-colors duration-200 hover:bg-[#EBE7DD] active:scale-[0.98]"
            >
              <span>Buka Peta Pemantauan</span>
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <p className="text-xs text-[#A8A49B]">
              Memuat peta interaktif Mapbox &amp; data live BMKG InaTEWS
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
