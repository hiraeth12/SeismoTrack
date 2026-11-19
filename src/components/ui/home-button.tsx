import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackToHomeButton() {
  return (
    <Link
      to="/"
      aria-label="Kembali ke beranda SeismoTrack"
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E5E2DA] bg-white px-3 text-sm font-semibold text-[#141413] transition-colors duration-150 hover:bg-[#F2F0EB] active:scale-[0.98]"
    >
      <ArrowLeft className="h-4 w-4 shrink-0 text-[#5C3B00]" aria-hidden="true" />
      <img
        src="/images/images_home/hero_seismo.png"
        alt=""
        width={22}
        height={22}
        aria-hidden="true"
        className="h-5 w-5 shrink-0 object-contain"
      />
      <span className="hidden sm:inline tracking-tight">SeismoTrack</span>
    </Link>
  );
}
