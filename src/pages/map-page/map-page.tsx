import "mapbox-gl/dist/mapbox-gl.css";
import "../../styles/app.css";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import io, { type Socket } from "socket.io-client";
import Worker from "web-worker";
import * as turf from "@turf/turf";
import { createRoot } from "react-dom/client";
import AnimatedPopup from "mapbox-gl-animated-popup";
import { DateTime } from "luxon";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import TitikGempa from "../../components/marker/titik_gempa";
import TitikTsunami from "../../components/marker/titik_tsunami";
import GempaBumiAlert from "../../components/gempa-bumi-alert";
import TsunamiAlert from "../../components/tsunami-alert";
import {
  KotaTerdampak,
  InfoGempa,
  InfoTsunami,
} from "../../components/libs/interface";
import GempaAlertCard from "../../components/alerts/gempa-alert-card";
import TsunamiAlertCard from "../../components/alerts/tsunami-alert-card";
import GempaDirasakanCard from "../../components/cards/gempa-dirasakan-card";
import GempaTerakhirCard from "../../components/cards/gempa-terakhir-card";
import EventLogCard from "../../components/cards/event-log-card";
import TestButtons from "../../components/ui/test-button";
import ShakeMapCard from "../../components/cards/shake-map-card";
import GempaBumiMobileAlert from "../../components/alerts/gempa-bumi-mobile-alert";
import GempaAlertList from "../../components/alerts/gempa-alert-list";
import MapContainer from "../../components/map/map-container";
import { testDemoTsunami } from "../../components/lib/testTsunami";
import { testDemoGempa } from "../../components/lib/testGempa";
import { getTitikGempaJson } from "../../components/lib/get-titik-gempa";
import { getGempa } from "../../components/lib/get-gempa";
import { getGempaKecil } from "../../components/lib/get-gempa-kecil";
import { updateGempa } from "../../components/lib/update-gempa";
import GempaInfoPopupCard from "../../components/cards/gempa-info-popup-card";
import {
  formatDepthLabel,
  getMagnitudeBadgeClasses,
  MAP_DEPTH_LEGEND,
} from "../../components/map/map-formatters";

export default function MapPages() {
  const smallEarthQuakeSound = "/sounds/wrong-answer-129254.mp3";
  const tsunamiAlertSound = "/sounds/tsu_eva.wav";

  const map = useRef<mapboxgl.Map | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const geoJsonData = useRef<any>(null);
  const geoJsonCoastline = useRef<any>(null);
  const geoJsonTitikGempa = useRef<any>(null);
  const worker = useRef<Worker | null>(null);
  const adaGempa = useRef<boolean>(false);
  const tgs = useRef<TitikGempa[]>([]);
  const titikGempaBaru = useRef<TitikGempa[]>([]);
  const tts = useRef<TitikTsunami[]>([]);
  const kts = useRef<KotaTerdampak[]>([]);
  const markerDaerahs = useRef<number[][]>([]);
  const daerahTsunami = useRef<any[]>([]);
  const lastGempaId = useRef<string>("");
  const lastGempaKecilId = useRef<string>("");
  const blinkInterval = useRef<number | null>(null);
  const selectedPopup = useRef<any>(null);
  const isMutedRef = useRef<boolean>(false);

  const [isGeoReady, setIsGeoReady] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<
    "gempa" | "tsunami" | null
  >(null);
  const simulationTimerRef = useRef<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isEventLogOpen, setIsEventLogOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [telemetryTab, setTelemetryTab] = useState<"dirasakan" | "terdeteksi">(
    "dirasakan"
  );
  const [telemetryExpanded, setTelemetryExpanded] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [legendExpanded, setLegendExpanded] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [gempaDirasakan, setGempaDirasakan] = useState<TitikGempa | null>(null);
  const [gempaTerakhir, setGempaTerakhir] = useState<TitikGempa | null>(null);
  const [events, setEvents] = useState<TitikGempa[]>([]);
  const [alertGempaBumi, setAlertGempaBumi] = useState<TitikGempa | null>(null);
  const [alertGempaBumis, setAlertGempaBumis] = useState<TitikGempa[]>([]);
  const [dismissedBannerIds, setDismissedBannerIds] = useState<string[]>([]);
  const [alertTsunami, setAlertTsunami] = useState<TitikTsunami | null>(null);
  const [infoTsunami, setInfoTsunami] = useState<TitikTsunami | null>(null);
  const [shakeMap, setShakeMap] = useState<string | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Clean up all background resources when leaving /map
  useEffect(() => {
    return () => {
      if (simulationTimerRef.current !== null) {
        window.clearTimeout(simulationTimerRef.current);
        simulationTimerRef.current = null;
      }
      if (blinkInterval.current !== null) {
        window.clearInterval(blinkInterval.current);
        blinkInterval.current = null;
      }
      if (worker.current) {
        worker.current.terminate();
        worker.current = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      tgs.current.forEach((tg) => tg.removeAllRender());
      titikGempaBaru.current.forEach((tg) => tg.removeAllRender());
      if (selectedPopup.current) {
        selectedPopup.current.remove();
        selectedPopup.current = null;
      }
    };
  }, []);

  const playAudioSafely = (audio: HTMLAudioElement) => {
    if (isMutedRef.current) return;
    if (audio.play) {
      audio.play().catch(() => {});
    }
  };

  function fadeOutAudio(audioElement: HTMLAudioElement, duration: number) {
    const fadeInterval = 50;
    const step = audioElement.volume / (duration / fadeInterval);

    const fadeAudio = window.setInterval(() => {
      if (audioElement.volume > step) {
        audioElement.volume = Math.max(0, audioElement.volume - step);
      } else {
        audioElement.volume = 0;
        audioElement.pause();
        window.clearInterval(fadeAudio);
      }
    }, fadeInterval);
  }

  const handleMapReady = (mapInstance: mapboxgl.Map) => {
    map.current = mapInstance;
    loadGeoJsonCoastline();
  };

  const warningHandler = async (data: any) => {
    const time = new Date().toLocaleTimeString();
    const id = data.id ?? `tg-${time}`;

    if (!map.current) return;
    const nig: InfoGempa = {
      id,
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
      map: map.current,
      showMarker: true,
      description: data.message,
      showPopup: true,
      showPopUpInSecond: 6,
      zoomToPosition: true,
    });
    tgs.current.push(tg);
    titikGempaBaru.current.push(tg);

    setAlertGempaBumis((prev) => [...prev, tg]);

    const bgNotif = new Audio("/sounds/eq_eva.wav");
    bgNotif.volume = 0.25;
    bgNotif.loop = true;
    playAudioSafely(bgNotif);

    window.setTimeout(() => {
      window.setTimeout(() => {
        const voice = new Audio("/voice/gempabumi.wav");
        playAudioSafely(voice);
      }, 2000);

      window.setTimeout(() => {
        fadeOutAudio(bgNotif, 2000);
      }, 6000);
    }, 2000);

    await new Promise((r) => window.setTimeout(r, 6000));

    setEvents([...tgs.current]);
    if (worker.current != null) {
      adaGempa.current = true;
      sendWave();
    }
  };

  function blinkCoastline() {
    if (blinkInterval.current !== null) {
      window.clearInterval(blinkInterval.current);
    }
    blinkInterval.current = window.setInterval(() => {
      if (!map.current || !map.current.getLayer("outline-coastline")) return;
      const visibility = map.current.getLayoutProperty(
        "outline-coastline",
        "visibility"
      );
      map.current.setLayoutProperty(
        "outline-coastline",
        "visibility",
        visibility === "visible" ? "none" : "visible"
      );
    }, 1000);
  }

  const warningTsunamiHandler = async (data: any) => {
    if (blinkInterval.current !== null) {
      window.clearInterval(blinkInterval.current);
    }
    const results: any[] = [];
    daerahTsunami.current = [];

    const time = new Date().toLocaleTimeString();
    const id = data.id ?? `tg-${time}`;

    const coordinates = data.point.coordinates.split(",");
    const nit: InfoTsunami = {
      id,
      lng: parseFloat(coordinates[0]),
      lat: parseFloat(coordinates[1]),
      message: `${data.description}\n${data.instruction}`,
      level: data.subject,
      time: data.time || new Date().toLocaleString(),
      listKotaTerdampak: [],
    };

    let level = "WASPADA";
    const wzList = Array.isArray(data.wzarea) ? data.wzarea : [data.wzarea];

    for (let x = 0; x < wzList.length; x += 1) {
      const wz = wzList[x];
      if (!wz || !wz.district || !geoJsonCoastline.current) continue;
      const cek = geoJsonCoastline.current.features.find(
        (f: any) =>
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
        let color = "#eab308";
        if (wz.level === "SIAGA") {
          color = "#ea580c";
        } else if (wz.level === "AWAS") {
          color = "#dc2626";
        }
        if (level === "WASPADA" && wz.level === "SIAGA") {
          level = wz.level;
        }
        if (level === "SIAGA" && wz.level === "AWAS") {
          level = wz.level;
        }

        cek.properties.color = color;
        results.push(cek);

        const dist = turf.distance(
          turf.point([nit.lng, nit.lat]),
          turf.point([cek.properties.longitude, cek.properties.latitude])
        );
        const timeDist = Math.floor(dist / 3) * 1000;
        nit.listKotaTerdampak.push({
          lng: cek.properties.longitude,
          lat: cek.properties.latitude,
          distance: dist,
          name: cek.properties.alt_name,
          hit: false,
          timeArrival: new Date(Date.now() + timeDist),
        });
      }

      nit.listKotaTerdampak.sort((a, b) => a.distance - b.distance);
    }

    if (!map.current) return;

    for (let x = 0; x < results.length; x += 1) {
      const element = results[x];
      const p: number[] = turf.centroid(element).geometry.coordinates;
      if (
        markerDaerahs.current.findIndex(
          (el) => el[0] === p[0] && el[1] === p[1]
        ) === -1
      ) {
        markerDaerahs.current.push([p[0], p[1]]);
        const markerParent = document.createElement("div");
        const markerEl = document.createElement("div");
        markerEl.innerHTML = `<p>${element.properties.alt_name}</p>`;
        markerEl.classList.add("marker-daerah");
        markerParent.appendChild(markerEl);
        new mapboxgl.Marker(markerParent)
          .setLngLat([p[0], p[1]])
          .addTo(map.current);
      }
    }

    const tt = new TitikTsunami(id, nit, {
      pWaveSpeed: 6000,
      sWaveSpeed: 3000,
      map: map.current,
      showMarker: true,
      description: `${data.description}\n${data.instruction}`,
      showPopup: true,
      showPopUpInSecond: 6,
      zoomToPosition: true,
      closePopUpInSecond: 13,
    });
    tts.current.push(tt);

    setAlertTsunami(tt);

    daerahTsunami.current = results;
    if (results.length > 0) {
      if (map.current.getSource("coastline")) {
        (map.current.getSource("coastline") as mapboxgl.GeoJSONSource).setData({
          type: "FeatureCollection",
          features: results,
        });
      } else {
        map.current.addSource("coastline", {
          type: "geojson",
          data: { type: "FeatureCollection", features: results },
        });
      }
      map.current.setLayoutProperty(
        "outline-coastline",
        "visibility",
        "visible"
      );
    } else {
      testDemoTsunami(warningTsunamiHandler);
      return;
    }

    blinkCoastline();
    map.current.moveLayer("outline-coastline");

    const bgNotif = new Audio("/sounds/tsu_eva.wav");
    bgNotif.volume = 0.25;
    bgNotif.loop = true;
    playAudioSafely(bgNotif);

    const notif = new Audio(tsunamiAlertSound);
    notif.volume = 0.25;
    notif.loop = true;
    playAudioSafely(notif);

    window.setTimeout(() => {
      playAudioSafely(new Audio("/voice/terdeteksi.wav"));

      window.setTimeout(() => {
        playAudioSafely(new Audio(`/voice/${level.toLowerCase()}.wav`));
        window.setTimeout(() => {
          playAudioSafely(new Audio("/voice/potensi.wav"));

          window.setTimeout(() => {
            playAudioSafely(
              new Audio(
                level === "AWAS" ? "/voice/evakuasi.wav" : "/voice/informasi.wav"
              )
            );
            window.setTimeout(() => {
              fadeOutAudio(notif, 1000);
              fadeOutAudio(bgNotif, 1000);
            }, 4000);
          }, 6000);
        }, 5000);
      }, 5000);
    }, 2000);

    window.setTimeout(() => {
      if (data.shakemap) {
        setShakeMap(data.shakemap);
      }
    }, 9000);

    window.setTimeout(() => {
      setAlertTsunami(null);
      setInfoTsunami(tt);
      setActiveSimulation((prev) => (prev === "tsunami" ? null : prev));
    }, 10000);
  };

  const socketInitializer = () => {
    if (socketRef.current != null) return;
    // Bounded reconnection prevents infinite console CORS error storms if the
    // external early-warning host blocks localhost origins while keeping live
    // streaming active where permitted.
    const sock = io("https://early-warning.potadev.com", {
      transports: ["websocket"],
      reconnectionAttempts: 1,
      timeout: 5000,
    });
    socketRef.current = sock;

    sock.on("connect_error", () => {
      sock.disconnect();
    });

    sock.on("warning", (v: any) => {
      warningHandler(v);
    });

    sock.on("gempa", (data: any) => {
      if (!map.current) return;
      updateGempa(
        data,
        lastGempaKecilId,
        smallEarthQuakeSound,
        map.current,
        gempaTerakhir,
        tgs,
        geoJsonTitikGempa,
        setEvents,
        setGempaTerakhir
      );
    });

    sock.on("tsunami", (data: any) => {
      updateTsunami(data);
    });
  };

  const initWorker = () => {
    worker.current = new Worker(new URL("../../worker.mjs", import.meta.url), {
      type: "module",
    });

    worker.current.postMessage({
      type: "geoJsonData",
      data: geoJsonData.current,
      coastline: geoJsonCoastline.current,
    });

    worker.current.addEventListener("message", (event: any) => {
      const data = event.data;
      if (data.type === "checkMultiHighlightArea" && data.id === "wave") {
        recieveWave(data);
      }
    });
  };

  const sendWave = () => {
    const t: any[] = [];
    for (let i = 0; i < titikGempaBaru.current.length; i += 1) {
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
    if (t.length > 0 && worker.current) {
      worker.current.postMessage({
        type: "checkMultiHighlightArea",
        titikGempa: t,
        id: "wave",
      });
    }
  };

  const recieveWave = async (data: any) => {
    if (!map.current) return;
    const alerts: InfoGempa[] = [];
    const ntgs: TitikGempa[] = [];

    for (let x = 0; x < data.titikGempa.length; x += 1) {
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

      for (let il = 0; il < tg.areaTerdampak.length; il += 1) {
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
          timeArrival: new Date(Date.now() + time),
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
    }

    const uniqueData = data.area;

    for (let x = 0; x < uniqueData.length; x += 1) {
      const element = uniqueData[x];
      const p: number[] = turf.centroid(element).geometry.coordinates;
      const isHit = element.properties.hit || false;
      const cityName = element.properties.alt_name;

      if (
        markerDaerahs.current.findIndex(
          (el) => el[0] === p[0] && el[1] === p[1]
        ) === -1
      ) {
        markerDaerahs.current.push([p[0], p[1]]);
        const markerParent = document.createElement("div");
        const markerEl = document.createElement("div");
        markerEl.innerHTML = `<p>${cityName}${isHit ? " · TERDAMPAK" : ""}</p>`;
        markerEl.classList.add("marker-daerah");
        if (isHit) {
          markerEl.classList.add("city-hit");
          markerEl.style.zIndex = "1000";
        }
        markerParent.appendChild(markerEl);
        new mapboxgl.Marker(markerParent)
          .setLngLat([p[0], p[1]])
          .addTo(map.current);
      } else {
        const index = kts.current.findIndex(
          (el) => el.lng === p[0] && el.lat === p[1]
        );
        if (index !== -1) {
          kts.current[index].hit = isHit;
        }
      }
    }

    if (map.current.getSource("hightlight-wave")) {
      (
        map.current.getSource("hightlight-wave") as mapboxgl.GeoJSONSource
      ).setData({ type: "FeatureCollection", features: uniqueData });
    } else {
      map.current.addSource("hightlight-wave", {
        type: "geojson",
        data: { type: "FeatureCollection", features: uniqueData },
      });
    }

    if (!map.current.getLayer("hightlight-wave-layer")) {
      map.current.addLayer({
        id: "hightlight-wave-layer",
        type: "fill",
        source: "hightlight-wave",
        layout: {},
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.65,
        },
      });

      if (map.current.getLayer("outline")) {
        map.current.moveLayer("outline");
      }
      if (map.current.getLayer("outline-coastline")) {
        map.current.moveLayer("outline-coastline");
      }
      for (const tg of tgs.current) {
        if (map.current.getLayer(tg.id)) {
          map.current.moveLayer(tg.id);
        }
      }
    }
    sendWave();
  };

  function loadGeoJsonCoastline() {
    fetch("/geojson/garis_pantai.geojson")
      .then((response) => response.json())
      .then((data) => {
        if (!map.current) return;
        geoJsonCoastline.current = data;
        if (!map.current.getSource("coastline")) {
          map.current.addSource("coastline", {
            type: "geojson",
            generateId: true,
            data,
          });
          map.current.addLayer({
            id: "outline-coastline",
            type: "line",
            source: "coastline",
            layout: {
              visibility: "none",
            },
            paint: {
              "line-color": ["get", "color"],
              "line-width": 4,
              "line-opacity": 1,
            },
          });
        }
        loadGeoJsonData();
      })
      .catch((error) => {
        console.error("Error fetching coastline geojson:", error);
      });
  }

  function loadGeoJsonData() {
    fetch("/geojson/all_kabkota_ind_reduce.geojson")
      .then((response) => response.json())
      .then((data) => {
        if (!map.current) return;
        geoJsonData.current = data;
        setIsGeoReady(true);

        if (!map.current.getSource("wilayah")) {
          map.current.addSource("wilayah", {
            type: "geojson",
            generateId: true,
            data,
          });
          map.current.addLayer({
            id: "outline",
            type: "line",
            source: "wilayah",
            layout: {},
            paint: {
              "line-color": "#8c867c",
              "line-width": 0.9,
              "line-opacity": 0.55,
            },
          });

          map.current.addLayer({
            id: "wilayah-fill",
            type: "fill",
            source: "wilayah",
            layout: {},
            paint: {
              "fill-color": "#b91c1c",
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
          map.current,
          geoJsonTitikGempa,
          tgs,
          setEvents,
          () => {
            if (!map.current) return;
            getGempa(
              lastGempaId,
              tgs,
              map.current,
              geoJsonTitikGempa,
              setEvents,
              warningHandler,
              setGempaDirasakan,
              socketInitializer
            );
          },
          () => {
            if (!map.current) return;
            getGempaKecil(
              lastGempaKecilId,
              map.current,
              smallEarthQuakeSound,
              setAlertGempaBumi,
              setGempaTerakhir,
              tgs,
              geoJsonTitikGempa,
              setEvents
            );
          }
        );

        getFaultLineGeojson();
        initWorker();
      })
      .catch((error) => {
        console.error("Error fetching regency geojson:", error);
      });
  }

  function getFaultLineGeojson() {
    if (!map.current) return;
    const url = "/geojson/indo_faults_lines.geojson";
    if (!map.current.getSource("indo_faults_lines")) {
      map.current.addSource("indo_faults_lines", {
        type: "geojson",
        generateId: true,
        data: url,
      });

      map.current.addLayer({
        id: "indo_faults_line_layer",
        type: "line",
        source: "indo_faults_lines",
        layout: {},
        paint: {
          "line-color": "#b00505",
          "line-width": 1.3,
          "line-opacity": 0.9,
        },
      });
    }
  }

  function updateTsunami(data: any) {
    let tsunami = false;
    if (data.info.wzarea !== undefined && data.info.wzarea.length > 0) {
      if (data.info.subject === "Warning Tsunami PD-4") {
        try {
          map.current?.removeLayer("outline-coastline");
          map.current?.removeLayer("outline");
        } catch {
          // ignore if already removed
        }
      } else if (data.info.subject.includes("Warning Tsunami")) {
        tsunami = true;
      }
    }

    if (lastGempaId.current !== data.identifier) {
      lastGempaId.current = data.identifier;
      const coordinates = data.info.point.coordinates.split(",");
      const sentTime = DateTime.fromISO(data.sent.replace("WIB", ""), {
        zone: "Asia/Jakarta",
      });
      const readAbleTime = `${sentTime.toISODate()} ${sentTime.toLocaleString(
        DateTime.TIME_24_WITH_SECONDS
      )}`;

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
          message: `${data.info.description}\n${data.info.instruction}`,
          time: readAbleTime,
        });
      }
    } else if (tsunami) {
      const cek = tts.current.find((v) => v.id === data.identifier);
      if (
        cek &&
        cek.infoTsunami.message !== `${data.description}\n${data.instruction}`
      ) {
        cek.infoTsunami.message = `${data.description}\n${data.instruction}`;
        setAlertTsunami(cek);
      }
    } else {
      const cek = tgs.current.find((v) => v.id === data.identifier);
      if (cek) {
        if (cek.infoGempa.mag !== parseFloat(data.info.magnitude)) {
          cek.infoGempa.mag = parseFloat(data.info.magnitude);
        }
        if (cek.infoGempa.depth !== data.info.depth) {
          cek.infoGempa.depth = data.info.depth;
        }
      }
    }
  }

  function selectEvent(d: InfoGempa) {
    if (!map.current) return;
    setSelectedEventId(d.id);

    if (selectedPopup.current) {
      selectedPopup.current.remove();
    }

    if (d.mmi !== 0) {
      setShakeMap(`${d.mmi}.mmi.jpg`);
    }

    map.current.flyTo({
      center: [d.lng, d.lat],
      zoom: 6,
      essential: true,
    });

    const placeholder = document.createElement("div");
    const root = createRoot(placeholder);
    root.render(<GempaInfoPopupCard data={d} />);

    selectedPopup.current = new AnimatedPopup({
      closeOnClick: false,
      openingAnimation: {
        duration: 140,
        easing: "easeOutSine",
        transform: "scale",
      },
      closingAnimation: {
        duration: 120,
        easing: "easeInOutSine",
        transform: "scale",
      },
    })
      .setDOMContent(placeholder)
      .setLngLat([d.lng, d.lat])
      .addTo(map.current);
  }

  const clearActiveSimulation = (type?: "gempa" | "tsunami") => {
    if (simulationTimerRef.current !== null) {
      window.clearTimeout(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
    setActiveSimulation((prev) => (!type || prev === type ? null : prev));
  };

  function handleTestDemoGempa() {
    if (activeSimulation !== null || !geoJsonData.current) return;
    setActiveSimulation("gempa");
    if (simulationTimerRef.current !== null) {
      window.clearTimeout(simulationTimerRef.current);
    }
    // Auto-unlock after the simulation alert & wave dispatch cycle completes
    simulationTimerRef.current = window.setTimeout(() => {
      setActiveSimulation((prev) => (prev === "gempa" ? null : prev));
      simulationTimerRef.current = null;
    }, 10000);
    testDemoGempa(geoJsonData.current, warningHandler);
  }

  async function handleTestDemoTsunami() {
    if (activeSimulation !== null) return;
    setActiveSimulation("tsunami");
    if (simulationTimerRef.current !== null) {
      window.clearTimeout(simulationTimerRef.current);
    }
    // Safety fallback unlock in case the remote XML feed fails or times out
    simulationTimerRef.current = window.setTimeout(() => {
      setActiveSimulation((prev) => (prev === "tsunami" ? null : prev));
      simulationTimerRef.current = null;
    }, 12000);
    try {
      await testDemoTsunami(warningTsunamiHandler);
    } catch {
      clearActiveSimulation("tsunami");
    }
  }

  const activeTelemetryEvent =
    telemetryTab === "dirasakan"
      ? gempaDirasakan ?? gempaTerakhir
      : gempaTerakhir ?? gempaDirasakan;

  return (
    <div className="seismo-map-workspace relative h-[100dvh] w-full overflow-hidden bg-[#ECEAE4]">
      {/* Primary Interactive Mapbox GL Canvas (100% preserved) */}
      <MapContainer onMapReady={handleMapReady} />

      {/* Top Observatory Command Bar */}
      <TestButtons
        onTestGempa={handleTestDemoGempa}
        onTestTsunami={handleTestDemoTsunami}
        eventCount={events.length}
        isGeoReady={isGeoReady}
        activeSimulation={activeSimulation}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        isEventLogOpen={isEventLogOpen}
        onToggleEventLog={() => setIsEventLogOpen((prev) => !prev)}
      />

      {/* Active Alert Cards Stack (Top-Left below Command Bar) */}
      <div
        id="gempa-bumi-alert"
        className="fixed top-[68px] left-3 z-20 flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-24px)]"
      >
        {alertGempaBumi && (
          <GempaAlertCard
            data={alertGempaBumi}
            onDismiss={() => setAlertGempaBumi(null)}
          />
        )}
        {infoTsunami && (
          <TsunamiAlertCard
            data={infoTsunami}
            onDismiss={() => setInfoTsunami(null)}
          />
        )}
        <GempaAlertList
          data={alertGempaBumis}
          onDismissItem={(id) => {
            setAlertGempaBumis((prev) => prev.filter((item) => item.id !== id));
            clearActiveSimulation("gempa");
          }}
        />
      </div>

      {/* Collapsible Right Event Log Drawer */}
      <EventLogCard
        events={events}
        selectedEventId={selectedEventId}
        isOpen={isEventLogOpen}
        onClose={() => setIsEventLogOpen(false)}
        onSelect={selectEvent}
      />

      {/* Bottom-Left Unified Observatory Telemetry Dock + Depth Legend */}
      {(gempaDirasakan || gempaTerakhir) && (
        <section
          id="gempa-bumi-dirasakan"
          aria-label="Ringkasan gempa terbaru dan legenda kedalaman"
          className="fixed bottom-8 left-3 right-3 sm:right-auto z-20 sm:w-[344px] pointer-events-auto"
        >
          <div className="rounded-xl border border-[#E5E2DA] bg-[#FAFAF8]/95 shadow-[0_8px_28px_rgba(20,20,19,0.12)] overflow-hidden">
            {/* Compact Header Bar (Tap to Collapse/Expand on any viewport) */}
            <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-2.5 border-b border-[#E5E2DA]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-[#141413] truncate">
                  {telemetryExpanded
                    ? "Ringkasan BMKG"
                    : activeTelemetryEvent?.infoGempa.place || "Ringkasan BMKG"}
                </span>
                {!telemetryExpanded && activeTelemetryEvent && (
                  <span
                    className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[11px] font-bold seismo-tabular ${getMagnitudeBadgeClasses(
                      Number(activeTelemetryEvent.infoGempa.mag ?? 0)
                    )}`}
                  >
                    M {Number(activeTelemetryEvent.infoGempa.mag ?? 0).toFixed(1)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!telemetryExpanded && activeTelemetryEvent && (
                  <span className="font-mono text-[11px] text-[#6B6860] seismo-tabular mr-1">
                    {formatDepthLabel(activeTelemetryEvent.infoGempa.depth)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setLegendExpanded((prev) => !prev)}
                  aria-expanded={legendExpanded}
                  aria-label="Tampilkan atau sembunyikan legenda kedalaman"
                  title="Legenda Kedalaman & Sesar"
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                    legendExpanded
                      ? "border-[#5C3B00] bg-[#F5EEE0] text-[#5C3B00]"
                      : "border-[#E5E2DA] bg-[#FAFAF8] text-[#4E4C46] hover:bg-[#F2F0EB]"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setTelemetryExpanded((prev) => !prev)}
                  aria-expanded={telemetryExpanded}
                  aria-label={
                    telemetryExpanded
                      ? "Ciutkan ringkasan gempa"
                      : "Buka ringkasan gempa"
                  }
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E2DA] bg-[#FAFAF8] text-[#4E4C46] transition-colors hover:bg-[#F2F0EB]"
                >
                  {telemetryExpanded ? (
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Expandable Depth & Fault Line Legend */}
            {legendExpanded && (
              <div className="border-b border-[#E5E2DA] bg-[#F2F0EB]/70 px-3.5 py-2.5 space-y-2">
                <p className="text-[11px] font-semibold text-[#4E4C46]">
                  Legenda Kedalaman Episentrum &amp; Sesar
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {MAP_DEPTH_LEGEND.map((item) => (
                    <span
                      key={item.band}
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#141413] seismo-tabular"
                    >
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.band}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#141413]">
                    <span
                      aria-hidden="true"
                      className="h-0.5 w-3.5 bg-[#B91C1C] shrink-0"
                    />
                    Garis Sesar
                  </span>
                </div>
              </div>
            )}

            {/* Tabbed Felt / Latest Detected Summary */}
            {telemetryExpanded && (
              <div className="p-3.5 space-y-3 bg-white">
                {gempaDirasakan && gempaTerakhir && (
                  <div
                    role="tablist"
                    aria-label="Pilih ringkasan gempa BMKG"
                    className="grid grid-cols-2 gap-1 rounded-lg bg-[#F2F0EB] p-1"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={telemetryTab === "dirasakan"}
                      onClick={() => setTelemetryTab("dirasakan")}
                      className={`h-8 rounded-md text-xs font-semibold transition-colors ${
                        telemetryTab === "dirasakan"
                          ? "bg-white text-[#141413] shadow-sm"
                          : "text-[#4E4C46] hover:text-[#141413]"
                      }`}
                    >
                      Dirasakan
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={telemetryTab === "terdeteksi"}
                      onClick={() => setTelemetryTab("terdeteksi")}
                      className={`h-8 rounded-md text-xs font-semibold transition-colors ${
                        telemetryTab === "terdeteksi"
                          ? "bg-white text-[#141413] shadow-sm"
                          : "text-[#4E4C46] hover:text-[#141413]"
                      }`}
                    >
                      Terdeteksi
                    </button>
                  </div>
                )}

                {telemetryTab === "dirasakan" && gempaDirasakan ? (
                  <GempaDirasakanCard
                    data={gempaDirasakan}
                    onSelect={selectEvent}
                    onOpenShakeMap={(mmi) => setShakeMap(`${mmi}.mmi.jpg`)}
                  />
                ) : gempaTerakhir ? (
                  <GempaTerakhirCard
                    data={gempaTerakhir}
                    onSelect={selectEvent}
                  />
                ) : gempaDirasakan ? (
                  <GempaDirasakanCard
                    data={gempaDirasakan}
                    onSelect={selectEvent}
                    onOpenShakeMap={(mmi) => setShakeMap(`${mmi}.mmi.jpg`)}
                  />
                ) : null}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ShakeMap Viewer Panel */}
      {shakeMap && (
        <div
          className={`fixed bottom-8 z-30 pointer-events-none flex justify-end ${
            isEventLogOpen
              ? "right-3 lg:right-[368px]"
              : "right-14"
          }`}
        >
          <ShakeMapCard fileName={shakeMap} onClose={() => setShakeMap(null)} />
        </div>
      )}

      {/* Mobile Fresh Detection Banner */}
      {alertGempaBumi && gempaDirasakan && (
        <GempaBumiMobileAlert data={gempaDirasakan} />
      )}

      {/* Urgent Active Earthquake Warning Overlays */}
      {alertGempaBumis
        .filter((v) => !dismissedBannerIds.includes(v.id))
        .map((v) => (
          <GempaBumiAlert
            key={v.id}
            props={{
              magnitudo: v.mag,
              kedalaman: v.depth,
              show: true,
              closeInSecond: 6,
              isMuted,
              onDismiss: () => {
                setDismissedBannerIds((prev) =>
                  prev.includes(v.id) ? prev : [...prev, v.id]
                );
                clearActiveSimulation("gempa");
              },
            }}
          />
        ))}

      {/* Urgent Active Tsunami Warning Modal */}
      {alertTsunami && (
        <TsunamiAlert
          alertTsunami={alertTsunami}
          onDismiss={() => {
            setInfoTsunami(alertTsunami);
            setAlertTsunami(null);
            clearActiveSimulation("tsunami");
          }}
        />
      )}
    </div>
  );
}
