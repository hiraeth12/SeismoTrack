import mapboxgl from "mapbox-gl";
import AnimatedPopup from "mapbox-gl-animated-popup";
import { createRoot } from "react-dom/client";
import { InfoTsunami } from "../libs/interface";
import { formatLatLng } from "../map/map-formatters";

type TitikTsunamiSetting = {
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

export default class TitikTsunami {
  id: string;
  infoTsunami: InfoTsunami;
  setting?: TitikTsunamiSetting;
  tsunamiMarker: mapboxgl.Marker | null = null;

  constructor(
    id: string,
    infoTsunami: InfoTsunami,
    setting?: TitikTsunamiSetting
  ) {
    this.id = id;
    this.infoTsunami = infoTsunami;
    this.setting = setting;

    this.init();
  }

  init() {
    if (this.setting != null && this.setting.map != null) {
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

  get center() {
    return [this.infoTsunami.lng, this.infoTsunami.lat];
  }

  renderMarker() {
    if (!this.setting?.map) return;
    const titikTsunami = document.createElement("div");
    titikTsunami.classList.add("marker-tsunami");
    const rootMarker = createRoot(titikTsunami);
    rootMarker.render(
      <div className="circles" aria-hidden="true">
        <div className="circle-ring circle-ring-1" />
        <div className="circle-ring circle-ring-2" />
        <div className="circle-ring circle-ring-3" />
        <div className="epicenter-core" />
      </div>
    );

    this.tsunamiMarker = new mapboxgl.Marker(titikTsunami)
      .setLngLat([this.center[0], this.center[1]])
      .addTo(this.setting.map);
  }

  renderPopup() {
    if (!this.setting?.map || !this.tsunamiMarker) return;
    const placeholder = document.createElement("div");
    const root = createRoot(placeholder);
    root.render(
      <div className="w-[272px] rounded-xl border border-[#FECACA] bg-white p-3.5 text-[#141413] shadow-lg font-sans">
        <div className="flex items-center justify-between gap-2 pr-7 pb-2 border-b border-[#E5E2DA]">
          <span className="text-xs font-bold text-[#991B1B]">
            Peringatan Dini Tsunami
          </span>
          {this.infoTsunami.level && (
            <span className="rounded bg-[#FEE2E2] px-2 py-0.5 font-mono text-[10px] font-bold text-[#991B1B]">
              {this.infoTsunami.level}
            </span>
          )}
        </div>
        <p className="mt-2 font-mono text-[11px] text-[#6B6860] seismo-tabular">
          {formatLatLng(this.infoTsunami.lat, this.infoTsunami.lng)}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[#4E4C46] whitespace-pre-wrap break-words">
          {this.setting?.description}
        </p>
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
      .setLngLat(this.center as [number, number])
      .setMaxWidth("288px");

    this.tsunamiMarker.setPopup(popup);
    popup.addTo(this.setting.map);

    if (this.setting.closePopUpInSecond) {
      setTimeout(() => {
        popup.remove();
      }, this.setting.closePopUpInSecond * 1000);
    }
  }

  flyTo() {
    if (this.setting?.map != null) {
      this.setting.map.flyTo({
        center: [this.infoTsunami.lng, this.infoTsunami.lat],
        zoom: 6,
      });
    }
  }
}
