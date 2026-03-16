// src/App.tsx
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import KakaoMap, { ChildLocation } from "./KakaoMap";

const COLORS = ["#FF5733", "#33A1FF", "#28B463", "#F39C12"];

// 아이별 프로필 이미지 (나중에 실제 사진으로 교체)
const PROFILE_IMAGES = [
  "/profiles/1.png",
  "/profiles/2.png",
  "/profiles/3.png",
  "/profiles/4.png",
];

function App() {
  const [children, setChildren] = useState<ChildLocation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const locationRef = ref(db, "locations");
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Firebase 데이터:', data); // 추가
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

        {/* 아이 선택 카드 - 가로 스크롤 (모바일 대응) */}
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
          {children.map((child, index) => {
            const isSelected = selectedId === child.id;
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
                  border: `3px solid ${isSelected ? COLORS[index] : "transparent"}`,
                  boxShadow: isSelected ? `0 0 0 2px ${COLORS[index]}44` : "none",
                  transition: "all 0.2s",
                }}>
                  <img
                    src={PROFILE_IMAGES[index]}
                    alt={child.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: isSelected ? COLORS[index] : "#555",
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
          // 모바일은 높이 줄이기
          height: "calc(100vh - 220px)",
          minHeight: "300px",
        }}>
          {children.length > 0 ? (
            <KakaoMap
              children={visibleChildren}
              colorIndexMap={Object.fromEntries(
                children.map((c, i) => [c.id, i])
              )}
            />
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