// src/kakao.d.ts
declare namespace kakao.maps {
  function load(callback: () => void): void;

  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    setLevel(level: number): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    setVisible(visible: boolean): void;
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, marker: Marker): void;
    close(): void;
  }

  class CustomOverlay {
    constructor(options: CustomOverlayOptions);
    setMap(map: Map | null): void;
 }

  class Polyline {
    constructor(options: PolylineOptions);
    setMap(map: Map | null): void;
  }

  interface MapOptions {
    center: LatLng;
    level: number;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
  }

  interface InfoWindowOptions {
    content: string;
  }

  interface CustomOverlayOptions {
    position: LatLng;
    content: string;
    yAnchor?: number;
  }

  interface PolylineOptions {
    path: LatLng[];
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    map?: Map;
  }
}

interface Window {
  kakao: typeof kakao;
}