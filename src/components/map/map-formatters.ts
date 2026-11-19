export const MAP_NUMBER_FORMATTER = new Intl.NumberFormat("id-ID");

const DATE_TIME_WIB_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export const MAP_DEPTH_LEGEND = [
  { band: "≤ 50 km", label: "Dangkal", color: "#dc2626" },
  { band: "51–100 km", label: "Menengah awal", color: "#ea580c" },
  { band: "101–250 km", label: "Menengah", color: "#ca8a04" },
  { band: "251–600 km", label: "Dalam", color: "#16a34a" },
  { band: "> 600 km", label: "Sangat dalam", color: "#2563eb" },
] as const;

export function parseDepthNumber(raw: string | number | undefined): number {
  if (typeof raw === "number") return raw;
  if (typeof raw !== "string") return Number.NaN;
  const cleaned = raw.replace(/[^\d.-]/g, "");
  return Number.parseFloat(cleaned);
}

export function formatDepthLabel(raw: string | number | undefined): string {
  const num = parseDepthNumber(raw);
  if (!Number.isFinite(num) || num <= 0) return "—";
  const rounded = Math.round(num * 10) / 10;
  const formatted = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1);
  return `${formatted}\u00A0km`;
}

export function getDepthColor(raw: string | number | undefined): string {
  const num = parseDepthNumber(raw);
  if (!Number.isFinite(num)) return "#5c3b00";
  if (num <= 50) return "#dc2626";
  if (num <= 100) return "#ea580c";
  if (num <= 250) return "#ca8a04";
  if (num <= 600) return "#16a34a";
  return "#2563eb";
}

export function getMagnitudeBadgeClasses(mag: number): string {
  if (mag >= 5.0) return "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]";
  if (mag >= 3.5) return "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]";
  return "bg-[#F5EEE0] text-[#5C3B00] border-[#E5D5B5]";
}

export function formatLatLng(
  lat: number | string | undefined,
  lng: number | string | undefined
): string {
  const numLat = typeof lat === "string" ? Number.parseFloat(lat) : lat;
  const numLng = typeof lng === "string" ? Number.parseFloat(lng) : lng;
  if (
    typeof numLat !== "number" ||
    typeof numLng !== "number" ||
    !Number.isFinite(numLat) ||
    !Number.isFinite(numLng)
  ) {
    return "—";
  }
  const latDir = numLat >= 0 ? "LU" : "LS";
  const lngDir = numLng >= 0 ? "BT" : "BB";
  return `${Math.abs(numLat).toFixed(2)}° ${latDir}, ${Math.abs(numLng).toFixed(2)}° ${lngDir}`;
}

export function formatEventTimeWib(raw: string | Date | undefined): string {
  if (!raw) return "—";
  if (raw instanceof Date) {
    if (Number.isNaN(raw.getTime())) return "—";
    return `${DATE_TIME_WIB_FORMATTER.format(raw).replace(/\./g, ":")} WIB`;
  }
  const trimmed = raw.trim();
  if (!trimmed) return "—";
  // Strings from getTitikGempaJson / getGempa are already converted to Asia/Jakarta "YYYY-MM-DD HH:mm:ss"
  const isoCandidate = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const parsed = new Date(isoCandidate);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed.endsWith("WIB") ? trimmed : `${trimmed} WIB`;
  }
  return `${DATE_TIME_WIB_FORMATTER.format(parsed).replace(/\./g, ":")} WIB`;
}
