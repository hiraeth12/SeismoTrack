import { DateTime } from "luxon";
import { InfoGempa } from "../libs/interface";
import TitikGempa from "../marker/titik_gempa";


export async function getGempaKecil(
  lastGempaKecilId: React.MutableRefObject<string>,
  map: mapboxgl.Map,
  smallEarthQuakeSound: string,
  setAlertGempaBumi: (tg: TitikGempa) => void,
  setGempaTerakhir: (tg: TitikGempa) => void,
  tgs: React.MutableRefObject<TitikGempa[]>,
  geoJsonTitikGempa: React.MutableRefObject<any>,
  setEvents: (tgList: TitikGempa[]) => void
) {
  if (lastGempaKecilId.current) return;

  console.log("getGempaKecil");

  const url = `${import.meta.env.VITE_BMKG_GEMPA_TERDETEKSI}?t=${new Date().getTime()}`;


  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features.length === 0) return;

    const feature = data.features[0];
    lastGempaKecilId.current = feature.properties.id;

    const sentTime = DateTime.fromSQL(feature.properties.time, { zone: "UTC" });
    const currentTime = DateTime.now().setZone("UTC");

    const msg = `${feature.properties.place}
Magnitudo : ${Number(feature.properties.mag).toFixed(1)}
Kedalaman : ${feature.properties.depth}
Lokasi (Lat,Lng) : 
${feature.geometry.coordinates[0]} , ${feature.geometry.coordinates[1]}`;

    const dt = DateTime.fromSQL(feature.properties.time, { zone: "UTC" }).setZone("Asia/Jakarta");
    const readAbleTime =
      dt.toISODate() + " " + dt.toLocaleString(DateTime.TIME_24_WITH_SECONDS);

    const nig: InfoGempa = {
      id: feature.properties.id,
      lng: parseFloat(feature.geometry.coordinates[0]),
      lat: parseFloat(feature.geometry.coordinates[1]),
      mag: parseFloat(feature.properties.mag),
      depth: feature.properties.depth,
      message: msg,
      place: feature.properties.place,
      time: readAbleTime,
      mmi: parseInt(readAbleTime.replaceAll("-", "").replaceAll(" ", "").replaceAll(":", "")),
    };

    // Jika gempa kecil baru (maks 10 menit), bunyikan notifikasi
    if (currentTime.toMillis() - sentTime.toMillis() < 600000) {
      const notif = new Audio(smallEarthQuakeSound);
      notif.play();
      setAlertGempaBumi(new TitikGempa(nig.id, nig));
    }

    const tg = new TitikGempa(nig.id, nig, {
      pWaveSpeed: 6000,
      sWaveSpeed: 3000,
      map: map,
      description: msg,
      zoomToPosition: true,
      showMarker: true,
      showPopup: false,
      showPopUpInSecond: 1,
    });

    setGempaTerakhir(tg);

    const exists = tgs.current.find((v) => v.id === nig.id);
    if (!exists) {
      tgs.current.unshift(new TitikGempa(nig.id, nig));
      geoJsonTitikGempa.current.features.push(feature);
      (map.getSource("earthquakes") as mapboxgl.GeoJSONSource).setData(geoJsonTitikGempa.current);
    }

    setEvents(tgs.current);
  } catch (error) {
    console.error("Error fetching getGempaKecil:", error);
  }
}
