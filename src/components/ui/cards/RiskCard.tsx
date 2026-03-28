"use client";

import { T, cardS, lblS } from "@/styles/tokens";
import type { AnalysisData } from "@/types/ai";

interface RiskCardProps {
  analysis: AnalysisData;
}

export default function RiskCard({ analysis }: RiskCardProps) {
  if (!analysis.risks?.length) return null;
  return (
    <div style={{ ...cardS, borderColor: "#FFCF80" }}>
      <div style={{ ...lblS, color: T.orange }}>RỦI RO CẦN LƯU Ý</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {analysis.risks.map((r) => (
          <div key={r} style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            padding: "8px 11px",
            background: T.orangeSoft, border: "1px solid #FFCF80",
            borderRadius: 9, fontSize: 12.5, color: "#B86000", fontWeight: 500,
          }}>
            <div style={{ width: 6, height: 6, background: T.orange, borderRadius: "50%", flexShrink: 0, marginTop: 4 }} />
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}
