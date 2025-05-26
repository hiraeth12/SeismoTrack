import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import mapboxgl from "mapbox-gl";
import { useRef, useState } from "react";
import io from "socket.io-client";
import Worker from "web-worker";
import TitikGempa from "./components/marker/titik_gempa";
import TitikTsunami from "./components/marker/titik_tsunami";
import GempaBumiAlert from "./components/GempaBumiAlert";
import * as turf from "@turf/turf";
import { createRoot } from "react-dom/client";
import AnimatedPopup from "mapbox-gl-animated-popup";
import {
  KotaTerdampak,
  InfoGempa,
  InfoTsunami,
} from "./components/libs/interface";
import TsunamiAlert from "./components/TsunamiAlert";
import GempaAlertCard from "./components/alerts/GempaAlertCard";
import TsunamiAlertCard from "./components/alerts/TsunamiAlertCard";
import GempaDirasakanCard from "./components/cards/GempaDirasakanCard";
import GempaTerakhirCard from "./components/cards/GempaTerakhirCard";
import EventLogCard from "./components/cards/EventLogCard";
// import DetailEventCard from "./components/cards/DetailEventCard";
import TestButtons from "./components/ui/TestButton";
import ShakeMapCard from "./components/cards/ShakeMapCard";
import GempaBumiMobileAlert from "./components/alerts/GempaBumiMobileAlert";
import GempaAlertList from "./components/alerts/GempaAlertList";
import MapContainer from "./components/map/MapContainer";
import { testDemoTsunami } from "./components/lib/testTsunami";
import { testDemoGempa } from "./components/lib/testGempa";
import { getTitikGempaJson } from "./components/lib/getTitikGempa";
import { getGempa } from "./components/lib/getGempa";
import { getGempaKecil } from "./components/lib/getGempaKecil";
import { updateGempa } from "./components/lib/updateGempa";
import GempaInfoPopupCard from "./components/cards/GempaInfoPopupCard";
import { DateTime } from "luxon";

let socket;
export default function MapPages() {
  //const dangerSound = "/sounds/siren-alarm-96503.mp3";
  const smallEarthQuakeSound = "/sounds/wrong-answer-129254.mp3";
  const tsunamiAlertSound = "sounds/tsu_eva.wav";
  const map = useRef<mapboxgl.Map | null>(null);

  const handleMapReady = (mapInstance: mapboxgl.Map) => {
    map.current = mapInstance;
    loadGeoJsonCoastline();
  };

  const geoJsonData = useRef<any>(null);
  const geoJsonCoastline = useRef<any>(null);
  const geoJsonTitikGempa = useRef<any>(null);
  const worker = useRef<Worker | null>(null);
  const adaGempa = useRef<boolean>(false);
  const tgs = useRef<TitikGempa[]>([]);
  const titikGempaBaru = useRef<TitikGempa[]>([]);
  const tts = useRef<TitikTsunami[]>([]);
  const kts = useRef<KotaTerdampak[]>([]);
  const markerDaerahs = useRef<any[]>([]);
  const daerahTsunami = useRef<any[]>([]);
  const lastGempaId = useRef<string>("");
  const lastGempaKecilId = useRef<string>("");
  const [detailInfoGempa, setDetailInfoGempa] = useState<InfoGempa | null>(
    null
  );
  const [gempaDirasakan, setGempaDirasakan] = useState<TitikGempa | null>(null);
  const [gempaTerakhir, setGempaTerakhir] = useState<TitikGempa | null>(null);
  const [events, setEvents] = useState<TitikGempa[]>([]);
  const [alertGempaBumi, setAlertGempaBumi] = useState<TitikGempa | null>(null);
  const [alertGempaBumis, setAlertGempaBumis] = useState<TitikGempa[]>([]);
  const [alertTsunami, setAlertTsunami] = useState<TitikTsunami | null>(null);
  const [infoTsunami, setInfoTsunami] = useState<TitikTsunami | null>(null);
  const [shakeMap, setShakeMap] = useState<string | null>(null);
  const blinkInterval = useRef<any>(null);
  const warningHandler = async (data: any) => {
    const time = new Date().toLocaleTimeString();
    const id = data.id ?? `tg-${time}`;

    if (!map.current) return;
    const nig: InfoGempa = {
      id: id,
      lng: parseFloat(data.lng),
      lat: parseFloat(data.lat),
      mag: parseFloat(data.mag || 0),
      depth: data.depth,
      message: data.message,
      place: data.place,
      time: data.time || new Date().toLocaleString(),
      listKotaTerdampak: [],
      mmi: parseInt(
        (data.time || new Date().toLocaleString())
          ?.replaceAll("-", "")
          .replaceAll(" ", "")
          .replaceAll(":", "")
      ),
    };

    const tg = new TitikGempa(id, nig, {
      pWaveSpeed: 6000,
      sWaveSpeed: 3000,
      map: map.current!,
      showMarker: true,
      description: data.message,
      showPopup: true,
      showPopUpInSecond: 6,
      zoomToPosition: true,
    });
    tgs.current.push(tg);
    titikGempaBaru.current.push(tg);

    setAlertGempaBumis([...alertGempaBumis, tg]);
    var bgNotif = new Audio("/sounds/eq_eva.wav");
    bgNotif.volume = 0.3;
    bgNotif.loop = true;
    bgNotif.play();
    const audioDangerElement = document.getElementById("danger");
    setTimeout(() => {
      if (audioDangerElement) {
        (audioDangerElement as HTMLAudioElement).play();
      }
      setTimeout(() => {
        var voice = new Audio("/voice/gempabumi.wav");
        voice.play();
      }, 2000);

      setTimeout(() => {
        fadeOutAudio(bgNotif, 2000);
      }, 6000);
    }, 2000);

    await new Promise((r) => setTimeout(r, 6000));

    setEvents(tgs.current);
    if (worker.current != null) {
      adaGempa.current = true;
      console.log("Send Wave");
      sendWave();
    }
    if (audioDangerElement) {
      (audioDangerElement as HTMLAudioElement).volume = 0.5;
    }
  };

  function blinkCoastline() {
    if (blinkInterval.current) {
      clearInterval(blinkInterval.current);
    }
    blinkInterval.current = setInterval(() => {
      const visibility = map.current!.getLayoutProperty(
        "outline-coastline",
        "visibility"
      );
      map.current!.setLayoutProperty(
        "outline-coastline",
        "visibility",
        visibility == "visible" ? "none" : "visible"
      );
    }, 1000);
  }

  function fadeOutAudio(audioElement, duration) {
    let fadeInterval = 50;
    let step = audioElement.volume / (duration / fadeInterval);

    let fadeAudio = setInterval(() => {
      if (audioElement.volume > step) {
        audioElement.volume -= step;
      } else {
        audioElement.volume = 0;
        audioElement.pause();
        clearInterval(fadeAudio);
      }
    }, fadeInterval);
  }

  const warningTsunamiHandler = async (data: any) => {
    if (blinkInterval.current) {
      clearInterval(blinkInterval.current);
    }
    const results: any = [];
    daerahTsunami.current = [];

    const time = new Date().toLocaleTimeString();
    const id = data.id ?? `tg-${time}`;

    const coordinates = data.point.coordinates.split(",");
    const nit: InfoTsunami = {
      id: id,
      lng: parseFloat(coordinates[0]),
      lat: parseFloat(coordinates[1]),
      message: data.description + "\n" + data.instruction,
      level: data.subject,
      time: data.time || new Date().toLocaleString(),
      listKotaTerdampak: [],
    };

    let level = "WASPADA";

    for (let x = 0; x < data.wzarea.length; x++) {
      const wz = data.wzarea[x];
      const cek = geoJsonCoastline.current.features.find(
        (f) =>
          wz.district
            .replaceAll("-", " ")
            .replaceAll("PULAU ", "")
            .replaceAll("KEPULAUAN ", "")
            .replaceAll(" BAGIAN UTARA", "")
            .replaceAll(" BAGIAN BARAT", "")
            .replaceAll(" BAGIAN SELATAN", "")
            .replaceAll(" BAGIAN TIMUR", "") ===
          f.properties.alt_name
            .replaceAll("KABUPATEN ", "")
            .replaceAll("PULAU ", "")
            .replaceAll("KEPULAUAN ", "")
      );
      if (cek) {
        let color = "yellow";
        if (wz.level == "SIAGA") {
          color = "orange";
        } else if (wz.level == "AWAS") {
          color = "red";
        }
        if (level == "WASPADA" && wz.level == "SIAGA") {
          level = wz.level;
        }

        if (level == "SIAGA" && wz.level == "AWAS") {
          level = wz.level;
        }

        cek.properties.color = color;
        results.push(cek);

        const dist = turf.distance(
          turf.point([nit.lng, nit.lat]),
          turf.point([cek.properties.longitude, cek.properties.latitude])
        );
        const timeDist = Math.floor(dist / 3) * 1000;
        nit.listKotaTerdampak!.push({
          lng: cek.properties.longitude,
          lat: cek.properties.latitude,
          distance: dist,
          name: cek.properties.alt_name,
          hit: false,
          timeArrival: new Date(new Date().getTime() + timeDist),
        });
      } else {
        console.log(wz);
      }

      nit.listKotaTerdampak!.sort((a, b) => a.distance - b.distance);
    }

    for (let x = 0; x < results.length; x++) {
      const element = results[x];
      const p: number[] = turf.centroid(element).geometry.coordinates;
      if (
        markerDaerahs.current.findIndex(
          (el) => el[0] == p[0] && el[1] == p[1]
        ) == -1
      ) {
        markerDaerahs.current.push([p[0], p[1]]);
        const markerParent = document.createElement("div");
        const markerEl = document.createElement("div");
        markerEl.innerHTML =
          '<p class="uppercase">' + element.properties.alt_name + "</p>";
        markerEl.classList.add("marker-daerah");
        markerEl.classList.add("show-pop-up");
        markerParent.appendChild(markerEl);
        new mapboxgl.Marker(markerParent)
          .setLngLat([p[0], p[1]])
          .addTo(map.current!);
      }
    }

    const tt = new TitikTsunami(id, nit, {
      pWaveSpeed: 6000,
      sWaveSpeed: 3000,
      map: map.current!,
      showMarker: true,
      description: data.description + "\n" + data.instruction,
      showPopup: true,
      showPopUpInSecond: 6,
      zoomToPosition: true,
      closePopUpInSecond: 13,
    });
    tts.current.push(tt);

    setAlertTsunami(tt);

    daerahTsunami.current = results;
    if (results.length > 0) {
      if (map.current!.getSource("coastline")) {
        (map.current!.getSource("coastline") as mapboxgl.GeoJSONSource).setData(
          { type: "FeatureCollection", features: results }
        );
      } else {
        map.current!.addSource("coastline", {
          type: "geojson",
          data: { type: "FeatureCollection", features: results },
        });
      }
      map.current!.setLayoutProperty(
        "outline-coastline",
        "visibility",
        "visible"
      );
    } else {
      testDemoTsunami(warningTsunamiHandler);
      return;
    }

    if (!map.current) return;
    blinkCoastline();
    map.current!.moveLayer("outline-coastline");

    console.log("WARNING TSUNAMI!!!");
    var bgNotif = new Audio("/sounds/tsu_eva.wav");
    bgNotif.volume = 0.3;
    bgNotif.loop = true;
    bgNotif.play();
    var notif = new Audio(tsunamiAlertSound);
    notif.loop = true;
    notif.play();
    setTimeout(() => {
      var voice = new Audio("/voice/terdeteksi.wav");
      voice.play();

      setTimeout(() => {
        var voice = new Audio("/voice/" + level.toLowerCase() + ".wav");
        voice.play();
        setTimeout(() => {
          var voice = new Audio("/voice/potensi.wav");
          voice.play();

          if (level == "AWAS") {
            setTimeout(() => {
              var voice = new Audio("/voice/evakuasi.wav");
              voice.play();
              setTimeout(() => {
                fadeOutAudio(notif, 1000);
                fadeOutAudio(bgNotif, 1000);
              }, 4000);
            }, 6000);
          } else {
            setTimeout(() => {
              var voice = new Audio("/voice/informasi.wav");
              voice.play();
              setTimeout(() => {
                fadeOutAudio(notif, 1000);
                fadeOutAudio(bgNotif, 1000);
              }, 4000);
            }, 6000);
          }
        }, 5000);
      }, 5000);
    }, 2000);

    setTimeout(() => {
      const tsunamiWarning: HTMLDivElement = document.querySelector(
        "#tsunami-warning"
      ) as HTMLDivElement;
      if (tsunamiWarning) {
        const divs = tsunamiWarning.querySelectorAll(".show-pop-up");
        divs.forEach((v) => {
          v.classList.add("close-pop-up");
        });
      }

      setShakeMap(data.shakemap);
    }, 9000);
    setTimeout(() => {
      const bgTsunami: HTMLDivElement = document.querySelector(
        "#bg-tsunami .hex-bg"
      ) as HTMLDivElement;
      if (bgTsunami) {
        const divs = bgTsunami.querySelectorAll("div");
        divs.forEach((v) => {
          v.classList.add("close-pop-up");
        });
      }
      setTimeout(() => {
        setAlertTsunami(null);
      }, 1000);
      setInfoTsunami(tt);
    }, 10000);
  };

  const socketInitializer = () => {
    if (socket != null) return;
    socket = io("https://early-warning.potadev.com");

    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("warning", (v: any) => {
      warningHandler(v);
    });
    socket.on("message", (v: any) => {
      console.log(v);
    });

    socket.on("gempa", (data: any) => {
      updateGempa(
        data,
        lastGempaKecilId,
        smallEarthQuakeSound,
        map.current!,
        gempaTerakhir,
        tgs,
        geoJsonTitikGempa,
        setEvents,
        setGempaTerakhir
      );
    });

    socket.on("tsunami", (data: any) => {
      updateTsunami(data);
    });
  };

  const initWorker = () => {
    worker.current = new Worker(new URL("./worker.mjs", import.meta.url), {
      type: "module",
    });

    worker.current.postMessage({
      type: "geoJsonData",
      data: geoJsonData.current,
      coastline: geoJsonCoastline.current,
    });

    worker.current.addEventListener("message", (event: any) => {
      const data = event.data;
      if (data.type == "checkMultiHighlightArea" && data.id == "wave") {
        recieveWave(data);
      }
    });
  };

  const sendWave = () => {
    let t: any = [];
    for (let i = 0; i < titikGempaBaru.current.length; i++) {
      const v = titikGempaBaru.current[i];
      if (!v.finish) {
        t.push({
          id: v.id,
          center: v.center,
          mag: v.mag,
          depth: v.depth,
          pWaveRadius: v.pWaveRadius,
          sWaveRadius: v.sWaveRadius,
          areaTerdampak: [],
          message: v.description,
        });
      }
    }
    if (t.length > 0) {
      worker.current!.postMessage({
        type: "checkMultiHighlightArea",
        titikGempa: t,
        id: "wave",
      });
    } else {
      console.log("Not Send Wave");
    }
  };

  const recieveWave = async (data: any) => {
    let alerts: InfoGempa[] = [];
    let ntgs: TitikGempa[] = [];
    for (let x = 0; x < data.titikGempa.length; x++) {
      const tg = data.titikGempa[x];

      const nig: InfoGempa = {
        id: tg.id,
        lng: parseFloat(tg.center[1]),
        lat: parseFloat(tg.center[0]),
        mag: tg.mag,
        depth: tg.depth,
        message: tg.message,
        place: tg.place,
        time: new Date().toLocaleString(),
        mmi: parseInt(
          new Date()
            .toLocaleString()
            ?.replaceAll("-", "")
            .replaceAll(" ", "")
            .replaceAll(":", "")
        ),
        listKotaTerdampak: [],
      };

      for (let il = 0; il < tg.areaTerdampak.length; il++) {
        const at = tg.areaTerdampak[il];
        const dist =
          turf.distance(
            turf.point([tg.center[0], tg.center[1]]),
            turf.point([at.center[0], at.center[1]])
          ) -
          tg.sWaveRadius / 1000;
        const time = Math.floor(dist / 3) * 1000;
        nig.listKotaTerdampak!.push({
          lng: at.center[1],
          lat: at.center[0],
          distance: dist,
          name: at.alt_name,
          hit: at.hit,
          timeArrival: new Date(new Date().getTime() + time),
        });
      }

      nig.listKotaTerdampak!.sort((a, b) => a.distance - b.distance);
      tg.infoGempa = nig;
      alerts.push(nig);

      data.titikGempa[x] = tg;
      ntgs.push(new TitikGempa(tg.id, nig));
    }
    if (alerts.length > 0) {
      setAlertGempaBumis(ntgs);
    } else {
    }

    const areas = data.area;
    const uniqueData = areas;

    for (let x = 0; x < uniqueData.length; x++) {
      const element = uniqueData[x];
      const p: number[] = turf.centroid(element).geometry.coordinates;
      if (
        markerDaerahs.current.findIndex(
          (el) => el[0] == p[0] && el[1] == p[1]
        ) == -1
      ) {
        markerDaerahs.current.push([p[0], p[1]]);
        const markerParent = document.createElement("div");
        const markerEl = document.createElement("div");
        markerEl.innerHTML =
          '<p class="uppercase">' + element.properties.alt_name + "</p>";
        markerEl.classList.add("marker-daerah");
        markerEl.classList.add("show-pop-up");
        markerParent.appendChild(markerEl);
        new mapboxgl.Marker(markerParent)
          .setLngLat([p[0], p[1]])
          .addTo(map.current!);
      } else {
        const index = kts.current.findIndex(
          (el) => el.lng == p[0] && el.lat == p[1]
        );
        if (index != -1) {
        }
      }
    }

    if (map.current!.getSource("hightlight-wave")) {
      (
        map.current!.getSource("hightlight-wave") as mapboxgl.GeoJSONSource
      ).setData({ type: "FeatureCollection", features: uniqueData });
    } else {
      map.current!.addSource("hightlight-wave", {
        type: "geojson",
        data: { type: "FeatureCollection", features: uniqueData },
      });
    }

    if (!map.current!.getLayer("hightlight-wave-layer")) {
      map.current!.addLayer({
        id: "hightlight-wave-layer",
        type: "fill",
        source: "hightlight-wave",
        layout: {},
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.8,
        },
      });

      map.current!.moveLayer("outline");
      map.current!.moveLayer("outline-coastline");
      for (let tg of tgs.current) {
        if (map.current!.getLayer(tg.id)) {
          map.current!.moveLayer(tg.id);
        }
      }
    }
    sendWave();
  };

  function loadGeoJsonCoastline() {
    fetch("/geojson/garis_pantai.geojson")
      .then((response) => response.json())
      .then((data) => {
        geoJsonCoastline.current = data;
        if (!map.current!.getSource("coastline")) {
          map.current!.addSource("coastline", {
            type: "geojson",
            generateId: true,
            data: data,
          });
          map.current!.addLayer({
            id: "outline-coastline",
            type: "line",
            source: "coastline",
            layout: {
              visibility: "none",
            },
            paint: {
              "line-color": ["get", "color"],
              "line-width": 5,
              "line-opacity": 1,
            },
          });
        }
        loadGeoJsonData();
      })
      .catch((error) => {
        alert("Failed load geojson data : " + error);
        console.error("Error fetching data:", error);
      });
  }

  function loadGeoJsonData() {
    fetch("/geojson/all_kabkota_ind_reduce.geojson")
      .then((response) => response.json())
      .then((data) => {
        geoJsonData.current = data;
        if (!map.current!.getSource("wilayah")) {
          map.current!.addSource("wilayah", {
            type: "geojson",
            generateId: true,
            data: data,
          });
          map.current!.addLayer({
            id: "outline",
            type: "line",
            source: "wilayah",
            layout: {},
            paint: {
              "line-color": "#807a72",
              "line-width": 1,
              "line-opacity": 0.7,
            },
          });

          map.current!.addLayer({
            id: "wilayah-fill",
            type: "fill",
            source: "wilayah",
            layout: {},
            paint: {
              "fill-color": "red",
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.1,
                0,
              ],
            },
          });
        }
        getTitikGempaJson(
          map.current!,
          geoJsonTitikGempa,
          tgs,
          setEvents,
          () =>
            getGempa(
              lastGempaId,
              tgs,
              map.current!,
              geoJsonTitikGempa,
              setEvents,
              warningHandler,
              setGempaDirasakan,
              socketInitializer
            ),
          () =>
            getGempaKecil(
              lastGempaKecilId,
              map.current!,
              smallEarthQuakeSound,
              setAlertGempaBumi,
              setGempaTerakhir,
              tgs,
              geoJsonTitikGempa,
              setEvents
            )
        );

        getFaultLineGeojson();
        initWorker();
      })
      .catch((error) => {
        alert("Failed load geojson data : " + error);
        console.error("Error fetching data:", error);
      });
  }

  function getFaultLineGeojson() {
    const url = "/geojson/indo_faults_lines.geojson";
    map.current!.addSource("indo_faults_lines", {
      type: "geojson",
      generateId: true,
      data: url,
    });

    map.current!.addLayer({
      id: "indo_faults_line_layer",
      type: "line",
      source: "indo_faults_lines",
      layout: {},
      paint: {
        "line-color": "red",
        "line-width": 1,
        "line-opacity": 0.5,
      },
    });
  }

  function updateTsunami(data) {
    var tsunami = false;
    if (data.info.wzarea != undefined && data.info.wzarea.length > 0) {
      if (data.info.subject == "Warning Tsunami PD-4") {
        try {
          map.current!.removeLayer("outline-coastline");
          map.current!.removeLayer("outline");
        } catch (error) {}
      } else if (data.info.subject.includes("Warning Tsunami")) {
        tsunami = true;
      }
    }
    if (lastGempaId.current != data.identifier) {
      lastGempaId.current = data.identifier;
      const coordinates = data.info.point.coordinates.split(",");
      const sentTime = DateTime.fromISO(data.sent.replace("WIB", ""), {
        zone: "Asia/Jakarta",
      });
      const readAbleTime =
        sentTime.toISODate() +
        " " +
        sentTime.toLocaleString(DateTime.TIME_24_WITH_SECONDS);

      if (tsunami) {
        warningTsunamiHandler(data.info);
      } else {
        warningHandler({
          id: data.identifier,
          lng: parseFloat(coordinates[0]),
          lat: parseFloat(coordinates[1]),
          place: data.info.felt,
          mag: parseFloat(parseFloat(data.info.magnitude).toFixed(1)),
          depth: data.info.depth,
          message: data.info.description + "\n" + data.info.instruction,
          time: readAbleTime,
        });
      }
    } else {
      if (tsunami) {
        const cek = tts.current.find((v) => v.id == data.identifier);
        if (
          cek &&
          cek.infoTsunami.message != data.description + "\n" + data.instruction
        ) {
          cek.infoTsunami.message = data.description + "\n" + data.instruction;

          setAlertTsunami(cek);
        }
      } else {
        const cek = tgs.current.find((v) => v.id == data.identifier);
        if (cek) {
          if (cek.infoGempa.mag != parseFloat(data.info.magnitude)) {
            cek.infoGempa.mag = data.info.magnitud;
          }
          if (cek.infoGempa.depth != data.info.depth) {
            cek.infoGempa.depth = data.info.depth;
          }
        }
      }
    }
  }

  const selectedPopup = useRef<any>(null);

  function selectEvent(d: InfoGempa) {
    setDetailInfoGempa(d);
    if (selectedPopup.current) {
      selectedPopup.current.remove();
    }

    if (d.mmi != 0) {
      setShakeMap(d.mmi.toString() + ".mmi.jpg");
    }

    map.current!.flyTo({
      center: [d.lng, d.lat],
      zoom: 6,
      essential: true,
    });
    const placeholder = document.createElement("div");
    const root = createRoot(placeholder);
    root.render(<GempaInfoPopupCard data={d} />); //Ini Buat di Event log, karena ada fly-in

    selectedPopup.current = new AnimatedPopup({
      closeOnClick: false,
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
      .setLngLat([d.lng, d.lat])
      .addTo(map.current!);
  }

  function handleTestDemoGempa() {
    testDemoGempa(geoJsonData.current, warningHandler);
  }

  function handleTestDemoTsunami() {
    testDemoTsunami(warningTsunamiHandler);
  }

  function readTextFile(e: string) {
    var t = new XMLHttpRequest();
    t.open("GET", e, !1),
      (t.onreadystatechange = function () {
        if (4 === t.readyState && (200 === t.status || 0 == t.status)) {
          let u = t.responseText.split("\n");
          var table = document.getElementById(
            "histori_tabel"
          ) as HTMLTableElement;

          let T = u.length - 1;
          for (let t = 1; t < T; t++) {
            let T = u[t].split("|");
            var n = table.insertRow(t),
              a = n.insertCell(0),
              l = n.insertCell(1),
              s = n.insertCell(2),
              i = n.insertCell(3),
              o = n.insertCell(4),
              r = n.insertCell(5),
              d = n.insertCell(6),
              m = n.insertCell(7),
              g = n.insertCell(8),
              c = n.insertCell(9);
            (a.innerHTML = T[0]),
              (l.innerHTML = T[1]),
              (s.innerHTML = T[2]),
              (i.innerHTML = T[3]),
              (o.innerHTML = T[4]),
              (r.innerHTML = T[5]),
              (d.innerHTML = T[6]),
              (m.innerHTML = T[7]),
              (g.innerHTML = T[8]),
              (c.innerHTML = T[9]);
          }
        }
      }),
      t.send(null);
  }
  return (
    <div className="min-h-screen bg-black font-mono relative overflow-hidden flex">
      <div className="relative flex-1 overflow">
        {/* <audio id="danger" className="hidden">
          <source src={dangerSound} type="audio/mp3" />
        </audio> */}
        <MapContainer onMapReady={handleMapReady} />
        <div className="backgroundline absolute inset-0 pointer-events-none z-10" />
        <div className="scanline absolute inset-0 pointer-events-none z-10" />
        <div
          id="gempa-bumi-alert"
          className="fixed top-6 md:top-3 left-6 md:left-3 right-0 flex  gap-2 justify-start items-start  pointer-events-none"
        >
          {alertGempaBumi && <GempaAlertCard data={alertGempaBumi} />}
          {infoTsunami && <TsunamiAlertCard data={infoTsunami} />}
          {<GempaAlertList data={alertGempaBumis} />}
        </div>
        <div className="fixed top-12 w-28 md:bottom-auto md:top-2 left-0 right-0 m-auto flex flex-col justify-center items-center gap-2">
          <TestButtons
            onTestGempa={handleTestDemoGempa}
            onTestTsunami={handleTestDemoTsunami}
          />
        </div>
        {<EventLogCard events={events} onSelect={selectEvent} />}
        <div
          id="gempa-bumi-dirasakan"
          className="fixed bottom-8 left-24 md:right-0 md:left-3 flex flex-col-reverse lg:flex-row gap-2 justify-start lg:items-end items-start pointer-events-none"
        >
          {gempaDirasakan && (
            <GempaDirasakanCard data={gempaDirasakan} onSelect={selectEvent} />
          )}

          {gempaTerakhir && (
            <GempaTerakhirCard data={gempaTerakhir} onSelect={selectEvent} />
          )}
        </div>
        <div className="fixed right-2 bottom-8  pointer-events-none flex gap-2 justify-end items-end">
          {shakeMap && (
            <ShakeMapCard
              fileName={shakeMap}
              onClose={() => setShakeMap(null)}
            />
          )}
        </div>
        {alertGempaBumi && gempaDirasakan && (
          <GempaBumiMobileAlert data={gempaDirasakan} />
        )}
        {alertGempaBumis.map((v, i) => {
          return (
            <div className="z-50" key={i}>
              <GempaBumiAlert
                key={i}
                props={{
                  magnitudo: v.mag,
                  kedalaman: v.depth,
                  show: true,
                  closeInSecond: 6,
                }}
              />
            </div>
          );
        })}
        {alertTsunami && <TsunamiAlert alertTsunami={alertTsunami} />}
      </div>
    </div>
  );
}
