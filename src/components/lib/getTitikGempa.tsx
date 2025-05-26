import { createRoot } from "react-dom/client";
import { DateTime } from "luxon";
import AnimatedPopup from "mapbox-gl-animated-popup";
import EarthquakePopupCard from "../cards/EarthquakePopupCard";
import TitikGempa from "../marker/titik_gempa";

export async function getTitikGempaJson(
  map: mapboxgl.Map,
  geoJsonTitikGempa: React.MutableRefObject<any>,
  tgs: React.MutableRefObject<TitikGempa[]>,
  setEvents: (v: TitikGempa[]) => void,
  getGempa: () => void,
  getGempaKecil: () => void
) {
    
  const url = `${import.meta.env.VITE_BMKG_GEMPA_ALL}?t=${new Date().getTime()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    geoJsonTitikGempa.current = data;

    const ntg: TitikGempa[] = data.features.map((feature: any) => {
      const dt = DateTime.fromSQL(feature.properties.time, { zone: "UTC" }).setZone("Asia/Jakarta");
      const readAbleTime =
        dt.toISODate() + " " + dt.toLocaleString(DateTime.TIME_24_WITH_SECONDS);
      return new TitikGempa(feature.properties.id, {
        id: feature.properties.id,
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
        mag: feature.properties.mag,
        depth: feature.properties.depth,
        place: feature.properties.place,
        time: readAbleTime,
        mmi: 0,
      });
    });

    tgs.current = ntg;
    setEvents(tgs.current);

    if (map.getLayer("earthquakes-layer")) {
      (map.getSource("earthquakes") as mapboxgl.GeoJSONSource).setData(data);
    } else {
      map.addSource("earthquakes", {
        type: "geojson",
        data: data,
      });

      map.addLayer({
        id: "earthquakes-layer",
        type: "circle",
        source: "earthquakes",
        paint: {
          "circle-radius": ["*", ["to-number", ["get", "mag"]], 1.5],
          "circle-stroke-width": 1,
          "circle-color": [
            "case",
            ["<=", ["to-number", ["get", "depth"]], 50], "red",
            ["<=", ["to-number", ["get", "depth"]], 100], "orange",
            ["<=", ["to-number", ["get", "depth"]], 250], "yellow",
            ["<=", ["to-number", ["get", "depth"]], 600], "green",
            "blue"
          ],
          "circle-stroke-color": "white",
        },
      });
    }

    map.on("click", "earthquakes-layer", (e: any) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const d = e.features[0].properties;

      const placeholder = document.createElement("div");
      const root = createRoot(placeholder);
      root.render(
        <EarthquakePopupCard
          mag={Number(d.mag)}
          depth={d.depth}
          time={d.time}
          coordinates={[coordinates[0], coordinates[1]]}
        />
      );

      new AnimatedPopup({
        openingAnimation: {
          duration: 100,
          easing: "easeOutSine",
          transform: "scale",
        },
        closingAnimation: {
          duration: 100,
          easing: "easeInOutSine",
          transform: "scale",
        },
      })
        .setDOMContent(placeholder)
        .setLngLat(coordinates)
        .addTo(map);
    });

    map.on("mouseenter", "earthquakes-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "earthquakes-layer", () => {
      map.getCanvas().style.cursor = "";
    });

    getGempa();
    getGempaKecil();
  } catch (error) {
    console.error("Error fetching gempaQL.json:", error);
  }
}
