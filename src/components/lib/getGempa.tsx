import { DateTime } from "luxon";
import TitikGempa from "../marker/titik_gempa";
import { InfoGempa } from "../libs/interface";

export async function getGempa(
  lastGempaId: React.MutableRefObject<string>,
  tgs: React.MutableRefObject<TitikGempa[]>,
  map: mapboxgl.Map,
  geoJsonTitikGempa: React.MutableRefObject<any>,
  setEvents: (v: TitikGempa[]) => void,
  warningHandler: (nig: InfoGempa) => void,
  setGempaDirasakan: (v: TitikGempa) => void,
  socketInitializer: () => void
) {
  if (lastGempaId.current) return;

  console.log("getGempa");

  const url = `${import.meta.env.VITE_BMKG_GEMPA_DIRASAKAN}?t=${new Date().getTime()}`;


  try {
    const response = await fetch(url);
    const data = await response.json();
    const coordinates = data.info.point.coordinates.split(",");

    lastGempaId.current = data.identifier;

    const sentTime = DateTime.fromISO(data.sent.replace("WIB", ""), {
      zone: "Asia/Jakarta",
    });
    const currentTime = DateTime.now().setZone("Asia/Jakarta");
    const readAbleTime =
      sentTime.toISODate() + " " + sentTime.toLocaleString(DateTime.TIME_24_WITH_SECONDS);

    const nig: InfoGempa = {
      id: data.identifier,
      lng: parseFloat(coordinates[0]),
      lat: parseFloat(coordinates[1]),
      place: data.info.felt,
      mag: data.info.magnitude,
      depth: data.info.depth,
      message: data.info.description,
      time: readAbleTime,
      mmi: parseInt(readAbleTime.replaceAll("-", "").replaceAll(" ", "").replaceAll(":", "")),
    };

    const cek = tgs.current.find((v) => v.id == data.identifier);

    if (currentTime.toMillis() - sentTime.toMillis() < 600000) {
      warningHandler({
        ...nig,
        message: data.info.description + "\n" + data.info.instruction,
      });

      const ntg = new TitikGempa(nig.id, nig, {
        map: map,
        showMarker: true,
      });

      setTimeout(() => {
        setGempaDirasakan(ntg);
      }, 6000);
    } else if (!cek) {
      tgs.current.push(new TitikGempa(nig.id, nig));
      tgs.current.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());

      geoJsonTitikGempa.current.features.push({
        geometry: {
          type: "Point",
          coordinates: [nig.lng, nig.lat, 1],
        },
        type: "Feature",
        properties: {
          id: nig.id,
          depth: parseFloat(nig.depth.replaceAll(" Km", "")).toFixed(2),
          mag: nig.mag,
          time: nig.time,
          place: nig.place,
        },
      });

      (map.getSource("earthquakes") as mapboxgl.GeoJSONSource).setData(geoJsonTitikGempa.current);
      setEvents(tgs.current);
    }

    const ntg = new TitikGempa(nig.id, nig, { map });
    setGempaDirasakan(ntg);
    socketInitializer();
  } catch (error) {
    console.error("Error initializing socket:", error);
  }
}
