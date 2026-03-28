"use client";

import { useState, useEffect } from "react";
import { T, cardS, lblS } from "@/styles/tokens";

interface ConfCardProps {
  val: number;
}

export default function ConfCard({ val }: ConfCardProps) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(val), 150);
    return () => clearTimeout(t);
  }, [val]);

  const col = val >= 70 ? T.green : val >= 40 ? T.orange : "#EF4444";

  return (
    <div style={cardS}>
      <div style={lblS}>ĐỘ XÁC ĐỊNH</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
        <div style={{ fontSize: 50, fontWeight: 800, color: col, letterSpacing: -2, lineHeight: 1 }}>{val}%</div>
        <div style={{ fontSize: 13, color: T.muted, paddingBottom: 5, fontWeight: 500 }}>tin cậy</div>
      </div>
      <div style={{ marginTop: 12, height: 8, borderRadius: 99, background: T.bg, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: `linear-gradient(90deg,${col},${col}88)`,
          width: `${w}%`,
          transition: "width 1.3s cubic-bezier(.4,0,.2,1)",
        }} />
      </div>
    </div>
  );
}
