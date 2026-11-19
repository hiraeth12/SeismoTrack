import { useCallback, useEffect, useState } from "react";

export type MagnitudeFilterKey = "all" | "lt25" | "25to34" | "35to44" | "gte45";

export interface NormalizedEarthquake {
  id: string;
  magnitude: number;
  depthKm: number;
  depthLabel: string;
  place: string;
  lat: number;
  lng: number;
  timeIso: string;
  timeWib: string;
  timestampMs: number;
  bucket: Exclude<MagnitudeFilterKey, "all">;
}

export interface MagnitudeBucketSummary {
  key: Exclude<MagnitudeFilterKey, "all">;
  label: string;
  description: string;
  count: number;
  percentage: number;
}

export interface RegionCountSummary {
  name: string;
  count: number;
  percentage: number;
}

export interface BmkgEarthquakeSummary {
  status: "loading" | "ready" | "error";
  errorMessage: string | null;
  events: NormalizedEarthquake[];
  latestEvent: NormalizedEarthquake | null;
  totalEvents: number;
  maxMagnitude: number;
  shallowCount: number;
  topRegion: RegionCountSummary | null;
  magnitudeBuckets: MagnitudeBucketSummary[];
  regionBreakdown: RegionCountSummary[];
  lastFetchedWib: string | null;
  retry: () => void;
}

interface RawGeoJsonFeature {
  geometry?: {
    coordinates?: [number, number, number?];
  };
  properties?: {
    id?: string;
    mag?: string | number;
    Magnitude?: string | number;
    magnitude?: string | number;
    depth?: string | number;
    place?: string;
    time?: string;
  };
}

interface RawGeoJsonResponse {
  features?: RawGeoJsonFeature[];
}

const WIB_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const WIB_TIME_ONLY_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export const NUMBER_FORMATTER = new Intl.NumberFormat("id-ID");

function formatDepthKm(depthKm: number): string {
  if (!Number.isFinite(depthKm) || depthKm <= 0) return "—";
  const rounded = Math.round(depthKm * 10) / 10;
  const formatted = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1);
  return `${formatted}\u00A0km`;
}

function parseNumericValue(raw: string | number | undefined): number {
  if (typeof raw === "number") return raw;
  if (typeof raw !== "string") return Number.NaN;
  const cleaned = raw.replace(/[^\d.-]/g, "");
  return Number.parseFloat(cleaned);
}

function parseUtcSqlTime(rawTime: string | undefined): {
  iso: string;
  wib: string;
  ms: number;
} {
  if (!rawTime) {
    return { iso: "", wib: "Waktu tidak tersedia", ms: 0 };
  }
  const normalized = rawTime.includes("T")
    ? rawTime.endsWith("Z")
      ? rawTime
      : `${rawTime}Z`
    : `${rawTime.replace(" ", "T")}Z`;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return { iso: rawTime, wib: rawTime, ms: 0 };
  }
  return {
    iso: parsed.toISOString(),
    wib: `${WIB_FORMATTER.format(parsed).replace(/\./g, ":")} WIB`,
    ms: parsed.getTime(),
  };
}

function classifyMagnitudeBucket(
  magnitude: number
): Exclude<MagnitudeFilterKey, "all"> {
  if (magnitude < 2.5) return "lt25";
  if (magnitude < 3.5) return "25to34";
  if (magnitude < 4.5) return "35to44";
  return "gte45";
}

export function getDepthCategory(depthKm: number): {
  label: string;
  color: string;
  band: string;
} {
  if (depthKm <= 50) {
    return { label: "Dangkal", color: "#B91C1C", band: "≤ 50 km" };
  }
  if (depthKm <= 100) {
    return { label: "Menengah Awal", color: "#C2410C", band: "51–100 km" };
  }
  if (depthKm <= 250) {
    return { label: "Menengah", color: "#B45309", band: "101–250 km" };
  }
  if (depthKm <= 600) {
    return { label: "Dalam", color: "#15803D", band: "251–600 km" };
  }
  return { label: "Sangat Dalam", color: "#1D4ED8", band: "> 600 km" };
}

export function formatCoordinates(lat: number, lng: number): string {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "—";
  const latDir = lat >= 0 ? "LU" : "LS";
  const lngDir = lng >= 0 ? "BT" : "BB";
  return `${Math.abs(lat).toFixed(2)}° ${latDir}, ${Math.abs(lng).toFixed(2)}° ${lngDir}`;
}

export function useBmkgEarthquakes(): BmkgEarthquakeSummary {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [events, setEvents] = useState<NormalizedEarthquake[]>([]);
  const [lastFetchedWib, setLastFetchedWib] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  const retry = useCallback(() => {
    setReloadNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_BMKG_GEMPA_ALL as string | undefined;
    if (!baseUrl) {
      setStatus("error");
      setErrorMessage("Konfigurasi sumber data BMKG belum tersedia.");
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    setStatus("loading");
    setErrorMessage(null);

    const separator = baseUrl.includes("?")
      ? baseUrl.endsWith("=") || baseUrl.endsWith("?") || baseUrl.endsWith("&")
        ? ""
        : "&t="
      : "?t=";
    const requestUrl = `${baseUrl}${separator}${Date.now()}`;

    fetch(requestUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json() as Promise<RawGeoJsonResponse>;
      })
      .then((payload) => {
        const rawFeatures = Array.isArray(payload.features)
          ? payload.features
          : [];

        const normalized: NormalizedEarthquake[] = [];

        for (let i = 0; i < rawFeatures.length; i += 1) {
          const feature = rawFeatures[i];
          const props = feature.properties;
          if (!props) continue;

          const magnitude = parseNumericValue(
            props.mag ?? props.Magnitude ?? props.magnitude
          );
          if (!Number.isFinite(magnitude)) continue;

          const depthKm = parseNumericValue(props.depth);
          const safeDepth = Number.isFinite(depthKm) ? depthKm : 0;
          const coords = feature.geometry?.coordinates;
          const lng = Number(coords?.[0]);
          const lat = Number(coords?.[1]);
          const parsedTime = parseUtcSqlTime(props.time);

          normalized.push({
            id: props.id ?? `bmkg-${i}-${parsedTime.ms}`,
            magnitude,
            depthKm: safeDepth,
            depthLabel: formatDepthKm(safeDepth),
            place: props.place?.trim() || "Wilayah Indonesia",
            lat: Number.isFinite(lat) ? lat : 0,
            lng: Number.isFinite(lng) ? lng : 0,
            timeIso: parsedTime.iso,
            timeWib: parsedTime.wib,
            timestampMs: parsedTime.ms,
            bucket: classifyMagnitudeBucket(magnitude),
          });
        }

        normalized.sort((a, b) => b.timestampMs - a.timestampMs);

        setEvents(normalized);
        setLastFetchedWib(
          `${WIB_TIME_ONLY_FORMATTER.format(new Date()).replace(/\./g, ":")} WIB`
        );
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setStatus("error");
        setErrorMessage(
          "Koneksi ke feed BMKG InaTEWS sedang terganggu. Anda tetap dapat membuka peta pemantauan atau mencoba memuat ulang data."
        );
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
      });

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [reloadNonce]);

  // Single-pass derived statistics (no redundant effects)
  const totalEvents = events.length;
  let maxMagnitude = 0;
  let shallowCount = 0;
  const bucketCounts: Record<Exclude<MagnitudeFilterKey, "all">, number> = {
    lt25: 0,
    "25to34": 0,
    "35to44": 0,
    gte45: 0,
  };
  const placeCounts = new Map<string, number>();

  for (let i = 0; i < totalEvents; i += 1) {
    const ev = events[i];
    if (ev.magnitude > maxMagnitude) maxMagnitude = ev.magnitude;
    if (ev.depthKm > 0 && ev.depthKm <= 50) shallowCount += 1;
    bucketCounts[ev.bucket] += 1;
    placeCounts.set(ev.place, (placeCounts.get(ev.place) ?? 0) + 1);
  }

  const magnitudeBuckets: MagnitudeBucketSummary[] = [
    {
      key: "lt25",
      label: "< M 2.5",
      description: "Mikro, umumnya tidak dirasakan",
      count: bucketCounts.lt25,
      percentage: totalEvents > 0 ? (bucketCounts.lt25 / totalEvents) * 100 : 0,
    },
    {
      key: "25to34",
      label: "M 2.5 – 3.4",
      description: "Ringan, terdeteksi sensor seismograf",
      count: bucketCounts["25to34"],
      percentage:
        totalEvents > 0 ? (bucketCounts["25to34"] / totalEvents) * 100 : 0,
    },
    {
      key: "35to44",
      label: "M 3.5 – 4.4",
      description: "Menengah, dapat terasa di sekitar pusat",
      count: bucketCounts["35to44"],
      percentage:
        totalEvents > 0 ? (bucketCounts["35to44"] / totalEvents) * 100 : 0,
    },
    {
      key: "gte45",
      label: "≥ M 4.5",
      description: "Signifikan, perlu pemantauan intensif",
      count: bucketCounts.gte45,
      percentage:
        totalEvents > 0 ? (bucketCounts.gte45 / totalEvents) * 100 : 0,
    },
  ];

  const sortedPlaces = Array.from(placeCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  const TOP_LIMIT = 6;
  const topRegions = sortedPlaces.slice(0, TOP_LIMIT);
  const remainingCount = sortedPlaces
    .slice(TOP_LIMIT)
    .reduce((sum, [, count]) => sum + count, 0);

  const regionBreakdown: RegionCountSummary[] = topRegions.map(
    ([name, count]) => ({
      name,
      count,
      percentage: totalEvents > 0 ? (count / totalEvents) * 100 : 0,
    })
  );

  if (remainingCount > 0) {
    regionBreakdown.push({
      name: `Wilayah lainnya (${sortedPlaces.length - TOP_LIMIT} area)`,
      count: remainingCount,
      percentage: totalEvents > 0 ? (remainingCount / totalEvents) * 100 : 0,
    });
  }

  return {
    status,
    errorMessage,
    events,
    latestEvent: events[0] ?? null,
    totalEvents,
    maxMagnitude,
    shallowCount,
    topRegion: regionBreakdown[0] ?? null,
    magnitudeBuckets,
    regionBreakdown,
    lastFetchedWib,
    retry,
  };
}
