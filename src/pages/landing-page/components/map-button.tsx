import { Link } from "react-router-dom"
import { MapPin } from "lucide-react"

export default function MapButton() {
  return (
    <Link to="/map" className="inline-block">
      <button
        className="
          relative
          bg-transparent
          border-2 border-red-500
          px-10 py-3
          font-black text-red-500 text-lg
          tracking-widest
          transition-all duration-200
          hover:bg-red-500 hover:text-black
          hover:shadow-lg hover:shadow-red-500/50
          active:scale-95 font-cascadia
          flex items-center gap-2
        "
      >
        {/* Inner border effect */}
        <div className="absolute inset-1 border border-red-500/50" />

        <span className="relative z-10 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Lihat Map
        </span>

        {/* Animated corner elements */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-yellow-400" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-yellow-400" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-yellow-400" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-yellow-400" />
      </button>
    </Link>
  )
}
