"use client";

import { T, cardS, lblS } from "@/styles/tokens";
import { Plus } from "@/components/icons";

interface MissingCardProps {
  missing: string[];
}

export default function MissingCard({ missing }: MissingCardProps) {
  if (!missing.length) return null;
  return (
    <div style={{ ...cardS, borderColor: "#FFCF80" }}>
      <div style={{ ...lblS, color: T.orange }}>⚠ THÔNG TIN CÒN THIẾU</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {missing.map((m) => (
          <div key={m} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "5px 11px",
            background: T.orangeSoft, border: "1px solid #FFCF80",
            borderRadius: 99, fontSize: 12, fontWeight: 600, color: T.orange,
          }}>
            <Plus />{m}
          </div>
        ))}
      </div>
    </div>
  );
}
