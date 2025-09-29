/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BMKG_GEMPA_TERDETEKSI: string
  readonly VITE_BMKG_GEMPA_DIRASAKAN: string
  readonly VITE_BMKG_TSUNAMI: string
  readonly VITE_WEBSOCKET_ENDPOINT: string
  readonly VITE_BMKG_GEMPA_ALL: string
  readonly VITE_MAPBOX_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
