"use client";

import { T, cardS, lblS } from "@/styles/tokens";
import type { AnalysisData } from "@/types/ai";

interface OppCardProps {
  analysis: AnalysisData;
}

export default function OppCard({ analysis }: OppCardProps) {
  if (!analysis.opportunities?.length) return null;
  return (
    <div style={{ ...cardS, borderColor: "#A7EDD0" }}>
      <div style={{ ...lblS, color: "#0E9960" }}>💡 CƠ HỘI</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {analysis.opportunities.map((o) => (
          <div key={o} style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            padding: "8px 11px",
            background: T.greenSoft, border: "1px solid #A7EDD0",
            borderRadius: 9, fontSize: 12.5, color: "#0E9960", fontWeight: 500,
          }}>
            <div style={{ width: 6, height: 6, background: T.green, borderRadius: "50%", flexShrink: 0, marginTop: 4 }} />
            {o}
          </div>
        ))}
      </div>
    </div>
  );
}
