import { Link } from "react-router-dom"
import { Map } from "lucide-react"

export default function MapButton() {
  return (
    <Link to="/map" className="inline-block">
      <button className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6A7D5A] via-[#73714D] to-[#6A7D5A] p-[2px] transition-all duration-300 hover:shadow-2xl hover:shadow-[#6A7D5A]/25">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#6A7D5A] via-[#73714D] to-[#6A7D5A] opacity-0 transition-opacity duration-300 group-hover:opacity-20 animate-pulse" />

        {/* Button content */}
        <div className="relative flex items-center gap-3 rounded-2xl bg-[#f5f7fa] px-8 py-4 transition-all duration-300 group-hover:bg-[#F5EEE2]/90">
          {/* Icon with shake animation */}
          <Map className="h-6 w-6 text-[#6A7D5A] transition-all duration-300 group-hover:text-[#73714D] group-hover:animate-bounce" />

          {/* Text with gradient effect */}
          <span className="text-lg font-semibold bg-gradient-to-r from-[#6A7D5A] to-[#73714D] bg-clip-text text-transparent transition-all duration-300 group-hover:from-[#73714D] group-hover:to-[#6A7D5A]">
            Lihat Peta
          </span>

          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </div>

        {/* Pulse ring effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-[#6A7D5A] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 group-hover:border-[#73714D]" />
      </button>
    </Link>
  )
}
