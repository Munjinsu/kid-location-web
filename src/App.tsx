// src/App.tsx
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import KakaoMap, { ChildLocation } from "./KakaoMap";

const COLORS: { [key: string]: string } = {
  child1: "#FF5733",
  child2: "#33A1FF",
  child3: "#28B463",
  child4: "#F39C12",
};

const PROFILE_IMAGES: { [key: string]: string } = {
  child1: "/profiles/1.png",
  child2: "/profiles/2.png",
  child3: "/profiles/3.png",
  child4: "/profiles/4.png",
};

function App() {
  const [children, setChildren] = useState<ChildLocation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const locationRef = ref(db, "locations");
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<ChildLocation, "id">),
        }));
        setChildren(list);
      }
    });
  }, []);

  const visibleChildren = selectedId
    ? children.filter((c) => c.id === selectedId)
    : children;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f0f4f8",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* 헤더 */}
      <div style={{
        backgroundColor: "#ffffff",
        padding: "14px 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <span style={{ fontSize: "22px" }}>📍</span>
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1a1a2e" }}>
          우리 아이 위치
        </h1>
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "#28B463", fontWeight: "600" }}>
          ● 실시간
        </span>
      </div>

      <div style={{ padding: "16px", maxWidth: "960px", margin: "0 auto" }}>

        {/* 아이 선택 카드 */}
        <div style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
          overflowX: "auto",
          paddingBottom: "4px",
          WebkitOverflowScrolling: "touch" as any,
        }}>
          {/* 전체 버튼 */}
          <div
            onClick={() => setSelectedId(null)}
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: selectedId === null ? "#1a1a2e" : "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              border: `3px solid ${selectedId === null ? "#1a1a2e" : "transparent"}`,
              transition: "all 0.2s",
            }}>
              👨‍👩‍👧‍👦
            </div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#555" }}>전체</span>
          </div>

          {/* 아이별 카드 */}
          {children.map((child) => {
            const isSelected = selectedId === child.id;
            const color = COLORS[child.id] ?? "#999";
            const profileImg = PROFILE_IMAGES[child.id] ?? "/profiles/1.png";
            return (
              <div
                key={child.id}
                onClick={() => setSelectedId(isSelected ? null : child.id)}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                }}
              >
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `3px solid ${isSelected ? color : "transparent"}`,
                  boxShadow: isSelected ? `0 0 0 2px ${color}44` : "none",
                  transition: "all 0.2s",
                }}>
                  <img
                    src={profileImg}
                    alt={child.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: isSelected ? color : "#555",
                }}>
                  {child.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* 지도 */}
        <div style={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
          height: "calc(100vh - 220px)",
          minHeight: "300px",
        }}>
          {children.length > 0 ? (
            <KakaoMap children={visibleChildren} />
          ) : (
            <div style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              color: "#aaa",
            }}>
              위치 데이터를 불러오는 중...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;