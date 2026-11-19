import mapboxgl from "mapbox-gl";
import AnimatedPopup from "mapbox-gl-animated-popup";
import { createRoot } from "react-dom/client";
import { InfoGempa } from "../libs/interface";
import {
  formatDepthLabel,
  formatEventTimeWib,
  formatLatLng,
  getMagnitudeBadgeClasses,
} from "../map/map-formatters";

type TitikGempaSetting = {
  map: mapboxgl.Map;
  showMarker?: boolean;
  showPopup?: boolean;
  zoomToPosition?: boolean;
  sWaveSpeed?: number;
  pWaveSpeed?: number;
  description?: string;
  showPopUpInSecond?: number;
  closePopUpInSecond?: number;
};

export default class TitikGempa {
  id: string;
  infoGempa: InfoGempa;
  setting?: TitikGempaSetting;

  pWaveRadius: number = 0;
  sWaveRadius: number = 0;
  curTime: number = 0;
  _play: boolean = true;
  gempaMarker: mapboxgl.Marker | null = null;
  finishWave: boolean = false;
  initalPWaveRadius: number = 0;
  initalSWaveRadius: number = 0;
  private rafId: number | null = null;

  constructor(id: string, infoGempa: InfoGempa, setting?: TitikGempaSetting) {
    this.id = id;
    this.infoGempa = infoGempa;
    this.setting = setting;

    this.init();
  }

  get description() {
    return this.setting?.description;
  }

  get finish() {
    return this.finishWave;
  }

  get center() {
    return [this.infoGempa.lng, this.infoGempa.lat];
  }

  get mag() {
    return this.infoGempa.mag;
  }

  get depth() {
    return this.infoGempa.depth;
  }

  get time() {
    return this.infoGempa.time;
  }

  get timeDiff() {
    if (this.infoGempa.time != null) {
      const d = new Date(this.infoGempa.time);
      const now = new Date();
      return new Date(now.getTime() - d.getTime()).toLocaleTimeString();
    }
    return "-";
  }

  get readableMag() {
    if (this.mag != null) {
      return Number(this.mag.toString()).toFixed(1);
    }
    return "0.0";
  }

  get readableDepth() {
    return formatDepthLabel(this.infoGempa.depth);
  }

  get readableTime() {
    return formatEventTimeWib(this.infoGempa.time);
  }

  init() {
    if (this.setting != null && this.setting.map != null) {
      if (
        this.infoGempa.time != null &&
        this.setting.pWaveSpeed != null &&
        this.setting.sWaveSpeed != null
      ) {
        const d = new Date(this.infoGempa.time);
        const now = new Date();
        const diff = Math.max(0, now.getTime() - d.getTime());
        const remainingMs = Math.abs(this.mag || 1) * 20000 - diff;

        if (remainingMs <= 0) {
          // Historical event whose seismic wave already dissipated; do not render P/S wave circles.
          this.finishWave = true;
        } else {
          this.initalPWaveRadius = (diff / 1000) * this.setting.pWaveSpeed;
          this.initalSWaveRadius = (diff / 1000) * this.setting.sWaveSpeed;

          setTimeout(() => {
            this.removeAllRender();
          }, remainingMs);

          setTimeout(() => {
            this.animateWave();
          }, 1000);
        }
      }

      if (this.setting.showMarker) {
        this.renderMarker();
      }

      if (this.setting.zoomToPosition) {
        this.flyTo();
      }

      if (this.setting.showPopup) {
        const delayMs = this.setting.showPopUpInSecond
          ? this.setting.showPopUpInSecond * 1000
          : 1000;
        setTimeout(() => {
          this.renderPopup();
        }, delayMs);
      }
    }
  }

  renderMarker() {
    if (!this.setting?.map) return;
    const titikGempa = document.createElement("div");
    titikGempa.classList.add("marker-gempa");
    const rootMarker = createRoot(titikGempa);
    rootMarker.render(
      <div className="circles" aria-hidden="true">
        <div className="circle-ring circle-ring-1" />
        <div className="circle-ring circle-ring-2" />
        <div className="circle-ring circle-ring-3" />
        <div className="epicenter-core" />
      </div>
    );

    this.gempaMarker = new mapboxgl.Marker(titikGempa)
      .setLngLat([this.center[0], this.center[1]])
      .addTo(this.setting.map);
  }

  renderPopup() {
    if (!this.setting?.map || !this.gempaMarker) return;
    const placeholder = document.createElement("div");
    const root = createRoot(placeholder);
    const magValue = Number(this.mag || 0);

    root.render(
      <div className="w-[264px] rounded-xl border border-[#E5E2DA] bg-white p-3.5 text-[#141413] shadow-lg font-sans">
        <div className="flex items-center justify-between gap-2 pr-7 pb-2.5 border-b border-[#E5E2DA]">
          <span className="text-xs font-bold tracking-tight text-[#141413]">
            Episentrum Gempa
          </span>
          <span
            className={`rounded border px-2 py-0.5 font-mono text-xs font-bold seismo-tabular ${getMagnitudeBadgeClasses(magValue)}`}
          >
            M {magValue.toFixed(1)}
          </span>
        </div>
        <dl className="mt-2.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-[#6B6860]">Kedalaman</dt>
            <dd className="font-mono font-semibold text-[#141413] seismo-tabular">
              {formatDepthLabel(this.depth)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-[#6B6860]">Waktu</dt>
            <dd className="font-mono font-medium text-[#141413] seismo-tabular">
              {formatEventTimeWib(this.infoGempa.time)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-[#6B6860]">Koordinat</dt>
            <dd className="font-mono font-medium text-[#141413] seismo-tabular">
              {formatLatLng(this.infoGempa.lat, this.infoGempa.lng)}
            </dd>
          </div>
        </dl>
        {this.setting?.description && (
          <p className="mt-2.5 pt-2.5 border-t border-[#E5E2DA] text-xs leading-relaxed text-[#4E4C46] whitespace-pre-wrap break-words">
            {this.setting.description}
          </p>
        )}
      </div>
    );

    const popup = new AnimatedPopup({
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
      .setLngLat(this.center as [number, number]);

    this.gempaMarker.setPopup(popup);
    popup.addTo(this.setting.map);

    const closeAfter = this.setting.closePopUpInSecond ?? 5;
    setTimeout(() => {
      popup.remove();
    }, closeAfter * 1000);
  }

  renderWave() {
    if (this.setting?.map == null || this.finishWave) return;

    const map = this.setting.map;
    try {
      if (!map.getStyle()) return;
    } catch {
      this.finishWave = true;
      return;
    }

    const circles: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: this.center,
          },
          properties: {
            id: "p-wave",
            radius: this.pWaveRadius,
            lat: parseFloat(this.center[1].toString()),
            color: "#d97706",
            titikGempa: this.center,
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: this.center,
          },
          properties: {
            id: "s-wave",
            radius: this.sWaveRadius,
            lat: parseFloat(this.center[1].toString()),
            color: "#dc2626",
            titikGempa: this.center,
          },
        },
      ],
    };

    const sourceId = `wave-source-${this.id}`;
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: circles,
      });
    } else {
      (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(circles);
    }

    if (!map.getLayer(this.id) && !this.finishWave) {
      map.addLayer({
        id: this.id,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-radius": [
            "interpolate",
            ["exponential", 2],
            ["zoom"],
            0,
            0,
            22,
            [
              "/",
              ["/", ["get", "radius"], 0.019],
              ["cos", ["*", ["get", "lat"], ["/", Math.PI, 180]]],
            ],
          ],
          "circle-color": "transparent",
          "circle-stroke-color": ["get", "color"],
          "circle-stroke-width": 2,
        },
      });
      map.moveLayer(this.id);
    }
  }

  animateWave() {
    if (this.finishWave) return;
    if (this.setting != null && this.infoGempa.time != null) {
      const d = new Date(this.infoGempa.time);
      const now = new Date();
      const diff = Math.max(0, now.getTime() - d.getTime());
      this.initalPWaveRadius = (diff / 1000) * this.setting.pWaveSpeed!;
      this.initalSWaveRadius = (diff / 1000) * this.setting.sWaveSpeed!;
    }

    const animate = (time: number) => {
      if (this.finishWave) {
        this.rafId = null;
        return;
      }
      if (!this.curTime) this.curTime = time;

      const deltaTime = time - this.curTime;
      if (this.setting != null && this._play) {
        this.pWaveRadius =
          this.initalPWaveRadius +
          (deltaTime / 1000) * this.setting.pWaveSpeed!;
        this.sWaveRadius =
          this.initalSWaveRadius +
          (deltaTime / 1000) * this.setting.sWaveSpeed!;
      }

      this.renderWave();
      if (!this.finishWave) {
        this.rafId = requestAnimationFrame(animate);
      }
    };

    this.rafId = requestAnimationFrame(animate);
  }

  flyTo() {
    if (this.setting?.map != null) {
      this.setting.map.flyTo({
        center: [this.infoGempa.lng, this.infoGempa.lat],
        zoom: 6,
      });
    }
  }

  play() {
    this._play = true;
  }

  pause() {
    this._play = false;
  }

  removeAllRender() {
    this.finishWave = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    const map = this.setting?.map;
    if (!map) return;

    try {
      if (map.getLayer(this.id)) {
        map.removeLayer(this.id);
      }
      if (map.getSource(`wave-source-${this.id}`)) {
        map.removeSource(`wave-source-${this.id}`);
      }
      if (map.getLayer("hightlight-wave-layer")) {
        map.removeLayer("hightlight-wave-layer");
        map.removeSource("hightlight-wave");
        const markers = document.querySelectorAll(".marker-daerah");
        markers.forEach((v) => {
          v.parentElement?.remove();
        });
      }
    } catch {
      // Map already destroyed on unmount
    }
  }

  removeMarker() {
    if (this.gempaMarker) {
      this.gempaMarker.remove();
    }
  }
}
