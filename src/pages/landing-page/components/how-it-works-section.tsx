import { useReveal } from "../hooks/use-reveal";

interface WorkflowStage {
  step: string;
  title: string;
  description: string;
}

const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    step: "Tahap pertama",
    title: "Akuisisi Data Resmi BMKG InaTEWS",
    description:
      "Sistem menarik feed kejadian gempa terkini, laporan gempa dirasakan, serta terhubung ke aliran peringatan dini saat halaman peta aktif.",
  },
  {
    step: "Tahap kedua",
    title: "Pemetaan Episentrum & Kalkulasi Gelombang",
    description:
      "Koordinat episentrum dan kedalaman dipetakan bersama garis sesar Indonesia, sedangkan gelombang P dan S dihitung untuk mengidentifikasi kabupaten/kota terdampak.",
  },
  {
    step: "Tahap ketiga",
    title: "Peringatan Dini & Eksplorasi Interaktif",
    description:
      "Pengguna dapat meninjau log kejadian, melihat ShakeMap MMI, memantau sorotan pesisir tsunami, atau menjalankan simulasi peringatan untuk kesiapsiagaan.",
  },
];

export default function HowItWorksSection() {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id="cara-kerja"
      ref={ref}
      data-visible={visible}
      className="seismo-reveal scroll-mt-20 bg-seismo-ground py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-4 mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold leading-[1.14] tracking-[-0.025em] text-seismo-ink seismo-balance">
            Cara kerja pemantauan SeismoTrack.
          </h2>
          <p className="text-base sm:text-lg leading-[1.65] text-seismo-ink-secondary seismo-pretty">
            Alur ringkas dari pencatatan sensor seismik resmi hingga tampilan
            visual yang siap digunakan di layar Anda.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {WORKFLOW_STAGES.map((stage, index) => (
            <li
              key={stage.title}
              className="flex flex-col gap-3 border-t-2 border-seismo-brand pt-6"
            >
              <span className="font-mono text-xs font-semibold text-seismo-brand seismo-tabular">
                {index + 1} · {stage.step}
              </span>
              <h3 className="text-lg font-bold tracking-[-0.015em] text-seismo-ink">
                {stage.title}
              </h3>
              <p className="text-sm sm:text-base leading-[1.65] text-seismo-ink-secondary">
                {stage.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
