import * as turf from "@turf/turf";
import { DateTime } from "luxon";
import { InfoGempa } from "../libs/interface";

export function testDemoGempa(
  geoJsonData: any,
  warningHandler: (nig: InfoGempa) => void
) {
  if (!geoJsonData) {
    alert("Wait loading geojson");
    return;
  }

  const bbox = turf.bbox(geoJsonData);
  const randomPosition = turf.randomPosition(bbox);
  const mag = (Math.random() * (10 - 5) + 5).toFixed(1);
  const depth = (Math.random() * 20).toFixed(1) + " Km";
  const message =
    "Simulasi Pada Lokasi : Lat : " +
    randomPosition[1].toFixed(4) +
    " Lng : " +
    randomPosition[0].toFixed(4) +
    " Magnitudo : " +
    mag +
    " Kedalaman : " +
    depth;
  const id = `tg-${new Date().getTime()}`;

  const dt = DateTime.now();
  const readAbleTime =
    dt.toISODate() + " " + dt.toLocaleString(DateTime.TIME_24_WITH_SECONDS);
  const nig: InfoGempa = {
    id: id,
    lng: parseFloat(randomPosition[0].toFixed(4)),
    lat: parseFloat(randomPosition[1].toFixed(4)),
    mag: parseFloat(mag),
    depth: depth || "10 Km",
    message: message,
    time: readAbleTime,
    mmi: parseInt(
      readAbleTime.replaceAll("-", "").replaceAll(" ", "").replaceAll(":", "")
    ),
  };

  warningHandler(nig);
}
