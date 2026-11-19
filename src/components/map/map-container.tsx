
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = mapboxToken;

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  onMapReady?: (map: mapboxgl.Map) => void;
}

export default function MapContainer({
  center = [113.9213, -0.7893],
  zoom = 2.5,
  onMapReady,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const onMapReadyRef = useRef(onMapReady);

  onMapReadyRef.current = onMapReady;

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    const instance = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/standard-satellite",
      projection: "globe",
      center,
      zoom,
      maxZoom: 22,
      minZoom: 1,
      attributionControl: true,
    });

    instance.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "bottom-right"
    );

    mapInstance.current = instance;

    instance.on("style.load", () => {
      instance.setFog({
        color: "rgba(216, 231, 245, 0.8)",
        "high-color": "#2455a4",
        "horizon-blend": 0.08,
        "space-color": "#030712",
        "star-intensity": 0.6,
      });
    });

    instance.on("load", () => {
      if (mapInstance.current) {
        onMapReadyRef.current?.(mapInstance.current);
      }
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mapRef}
      role="region"
      aria-label="Peta interaktif pemantauan gempa bumi Indonesia"
      className="w-full h-[100dvh] z-0"
    />
  );
}
