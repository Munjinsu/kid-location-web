// src/KakaoMap.tsx
import { useEffect, useRef } from "react";

export interface ChildLocation {
  id: string;
  name: string;
  current: {
    lat: number;
    lng: number;
    timestamp: number;
  };
  history?: {
    [key: string]: {
      lat: number;
      lng: number;
      timestamp: number;
    };
  };
}

interface Props {
  children: ChildLocation[];
  colorIndexMap: { [id: string]: number };
}

const COLORS = ["#FF5733", "#33A1FF", "#28B463", "#F39C12"];
const PROFILE_IMAGES = [
  "/profiles/1.png",
  "/profiles/2.png",
  "/profiles/3.png",
  "/profiles/4.png",
];

export default function KakaoMap({ children, colorIndexMap }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const infoWindowsRef = useRef<kakao.maps.InfoWindow[]>([]);
  const polylinesRef = useRef<kakao.maps.Polyline[]>([]);
  const customOverlaysRef = useRef<kakao.maps.CustomOverlay[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const waitForKakao = (callback: () => void) => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(callback);
      } else {
        setTimeout(() => waitForKakao(callback), 100);
      }
    };

    waitForKakao(() => {
      if (!mapRef.current) return;
      const center = new kakao.maps.LatLng(37.5665, 126.978);
      const map = new kakao.maps.Map(mapRef.current, { center, level: 5 });
      mapInstanceRef.current = map;
      updateMarkers(map);
    });
  }, []);

  useEffect(() => {
    // ...카카오 초기화 코드
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    updateMarkers(mapInstanceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const updateMarkers = (map: kakao.maps.Map) => {
    // 기존 마커, 말풍선, 경로 제거
    markersRef.current.forEach((m) => m.setMap(null));
    infoWindowsRef.current.forEach((iw) => iw.close());
    polylinesRef.current.forEach((p) => p.setMap(null));
    customOverlaysRef.current.forEach((co) => co.setMap(null));
    markersRef.current = [];
    infoWindowsRef.current = [];
    polylinesRef.current = [];
    customOverlaysRef.current = [];

    children.forEach((child) => {
      const index = colorIndexMap[child.id];
      const color = COLORS[index];
      const profileImg = PROFILE_IMAGES[index];

      const position = new kakao.maps.LatLng(
        child.current.lat,
        child.current.lng,
      );

      // 둥근 프로필 이미지 마커
      const markerContent = `
        <div style="
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 3px solid ${color};
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          background: white;
        ">
          <img 
            src="${profileImg}" 
            style="width:100%;height:100%;object-fit:cover;"
            onerror="this.src='/profiles/1.png'"
          />
        </div>
      `;

      const customOverlay = new kakao.maps.CustomOverlay({
        position,
        content: markerContent,
        yAnchor: 1.1,
      });
      customOverlay.setMap(map);
      customOverlaysRef.current.push(customOverlay);

      // 경로선
      if (child.history) {
        const historyList = Object.values(child.history).sort(
          (a, b) => a.timestamp - b.timestamp,
        );
        const path = [
          ...historyList.map((h) => new kakao.maps.LatLng(h.lat, h.lng)),
          position,
        ];
        const polyline = new kakao.maps.Polyline({
          path,
          strokeWeight: 4,
          strokeColor: color,
          strokeOpacity: 0.7,
          map,
        });
        polylinesRef.current.push(polyline);
      }
    });

    // 아이가 1명이면 해당 위치로 지도 이동
    if (children.length === 1) {
      map.setCenter(
        new kakao.maps.LatLng(children[0].current.lat, children[0].current.lng),
      );
      map.setLevel(4);
    }
  };

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
