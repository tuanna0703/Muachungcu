"use client";

import { lblS, REC_CONFIG } from "@/styles/tokens";
import { Star, Share } from "@/components/icons";
import type { AnalysisData } from "@/types/ai";

interface RecCardProps {
  analysis: AnalysisData;
  onShare:  () => void;
}

export default function RecCard({ analysis, onShare }: RecCardProps) {
  const cfg = REC_CONFIG[analysis.recommendation] ?? REC_CONFIG.wait;

  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 14, padding: "14px 15px", animation: "mccFade .4s ease" }}>
      <div style={{ ...lblS, color: "#0E9960" }}>KHUYẾN NGHỊ</div>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "4px 14px", background: cfg.pill, color: "#fff",
        borderRadius: 99, fontSize: 12, fontWeight: 800, marginBottom: 10,
      }}>
        <Star />{analysis.verdict_pill || cfg.label}
      </div>

      <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.45, marginBottom: 6 }}>
        {analysis.verdict_main}
      </div>
      <div style={{ fontSize: 12.5, color: "#555", lineHeight: 1.65, marginBottom: 12 }}>
        {analysis.recommendation_reason}
      </div>

      <button
        onClick={onShare}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          padding: "11px",
          background: "linear-gradient(135deg,#B71C1C,#E53935)", color: "#fff",
          borderRadius: 11, fontSize: 13, fontWeight: 800,
          border: "none", cursor: "pointer", fontFamily: "'Open Sans',sans-serif",
          boxShadow: "0 4px 16px #E5393544", letterSpacing: -0.2,
        }}
      >
        <Share />Chia sẻ phân tích này
      </button>
    </div>
  );
}
