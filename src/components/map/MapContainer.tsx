// components/map/MapContainer.tsx
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
  zoom = 5,
  onMapReady,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current!,
      style: "mapbox://styles/mapbox/light-v11",
      center : [113.9213, -0.7893],
      zoom,
      maxZoom: 22,
      
    });

    mapInstance.current.on("load", () => {
      if (onMapReady && mapInstance.current) {
        mapInstance.current.setFog({
          color: "rgba(240, 240, 245, 0.3)", // warna kabut
          "high-color": "rgba(240, 240, 245, 0.1)",
          "horizon-blend": 0.1,
          "space-color": "#000000",
          "star-intensity": 0.5,
        });

        onMapReady(mapInstance.current);
      }
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-full z-0"
      style={{ height: "100vh"}}
    />
  );
  
}
