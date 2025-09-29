import { DateTime } from "luxon";
import { InfoGempa } from "../libs/interface";
import TitikGempa from "../marker/titik_gempa";

export function updateGempa(
  data: any,
  lastGempaKecilId: React.MutableRefObject<string>,
  smallEarthQuakeSound: string,
  map: mapboxgl.Map,
  gempaTerakhir: TitikGempa | null,
  tgs: React.MutableRefObject<TitikGempa[]>,
  geoJsonTitikGempa: React.MutableRefObject<any>,
  setEvents: (v: TitikGempa[]) => void,
  setGempaTerakhir: (v: TitikGempa) => void
) {
  const feature = data.features[0];
  const msg = `${feature.properties.place}
Magnitudo : ${Number(feature.properties.mag).toFixed(1)}
Kedalaman : ${feature.properties.depth}
Lokasi (Lat,Lng) : 
${feature.geometry.coordinates[0]} , ${feature.geometry.coordinates[1]}`;

  const dt = DateTime.fromSQL(feature.properties.time, { zone: "UTC" }).setZone(
    "Asia/Jakarta"
  );
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
    mmi: parseInt(
      readAbleTime.replaceAll("-", "").replaceAll(" ", "").replaceAll(":", "")
    ),
  };

  if (lastGempaKecilId.current !== feature.properties.id) {
    lastGempaKecilId.current = feature.properties.id;

    const notif = new Audio(smallEarthQuakeSound);
    notif.play();

    if (gempaTerakhir && gempaTerakhir.setting && gempaTerakhir.setting.map) {
      gempaTerakhir.removeAllRender();
      gempaTerakhir.removeMarker();

      if (tgs.current.length > 0) {
        const ig = tgs.current[0].infoGempa;
        geoJsonTitikGempa.current.features.push({
          geometry: {
            type: "Point",
            coordinates: [ig.lng, ig.lat, 1],
          },
          type: "Feature",
          properties: {
            id: ig.id,
            depth: ig.depth,
            mag: ig.mag,
            time: ig.time,
            place: ig.place,
          },
        });
        (map.getSource("earthquakes") as mapboxgl.GeoJSONSource).setData(
          geoJsonTitikGempa.current
        );
      }
    }

    const tg = new TitikGempa(nig.id, nig, {
      map: map,
      zoomToPosition: true,
      showMarker: true,
      showPopup: true,
      showPopUpInSecond: 1,
      description: msg,
    });

    tgs.current.push(tg);
    tgs.current.sort((a, b) => {
      const timeA = new Date(a.infoGempa?.time || 0).getTime();
      const timeB = new Date(b.infoGempa?.time || 0).getTime();
      return timeB - timeA;
    });
    setEvents(tgs.current);
    setGempaTerakhir(tg);
  } else {
    const cek = tgs.current.find((v) => v.id === feature.properties.id);
    if (cek) {
      const magChanged =
        cek.infoGempa.mag !== parseFloat(feature.properties.mag);
      const depthChanged = cek.infoGempa.depth !== feature.properties.depth;

      if (magChanged || depthChanged) {
        const updatedTG = new TitikGempa(nig.id, nig);
        setGempaTerakhir(updatedTG);

        const index = tgs.current.findIndex(
          (v) => v.id === feature.properties.id
        );
        if (index !== -1) {
          tgs.current[index].infoGempa = nig;
        }
      }
    }
  }
}
