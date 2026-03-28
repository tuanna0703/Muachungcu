"use client";

import { T, cardS, lblS } from "@/styles/tokens";
import { Ok } from "@/components/icons";
import type { AnalysisData, ProjectProfile } from "@/types/ai";

interface PriceCardProps {
  analysis: AnalysisData;
  profile:  Partial<ProjectProfile>;
}

export default function PriceCard({ analysis, profile }: PriceCardProps) {
  const ppm  = parseFloat(profile.price_per_sqm ?? "") || 0;
  const low  = analysis.market_low  ?? 0;
  const high = analysis.market_high ?? 0;
  const pct  = high > low ? Math.min(Math.max((ppm - low) / (high - low) * 100, 0), 100) : 50;
  const col  = analysis.price_assessment === "fair"
    ? T.green
    : analysis.price_assessment === "overpriced"
      ? "#EF4444"
      : T.orange;

  return (
    <div style={cardS}>
      <div style={lblS}>PHÂN TÍCH GIÁ</div>

      {ppm > 0 && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, marginBottom: 10 }}>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1 }}>{ppm.toFixed(0)}</div>
          <div style={{ fontSize: 13, color: T.muted, paddingBottom: 4 }}>triệu/m²</div>
        </div>
      )}

      {low > 0 && high > 0 && (
        <div style={{ background: T.bg, borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, marginBottom: 8 }}>
            Khoảng TT: {low}–{high} {analysis.market_unit}
          </div>
          <div style={{ position: "relative", height: 6, background: T.border, borderRadius: 99, marginBottom: 6 }}>
            <div style={{ position: "absolute", left: "5%", width: "90%", height: "100%", background: `linear-gradient(90deg,#E8EAEF,${T.red}44)`, borderRadius: 99 }} />
            {ppm > 0 && (
              <div style={{
                position: "absolute", left: `${5 + pct * 0.9}%`,
                top: -3, width: 12, height: 12,
                background: col, border: "2.5px solid #fff", borderRadius: "50%",
                boxShadow: `0 2px 6px ${col}66`, transition: "left 1s ease",
              }} />
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: T.muted }}>
            <span>{low}</span><span>{high}</span>
          </div>
        </div>
      )}

      <div style={{ padding: "8px 10px", background: `${col}18`, borderRadius: 9, fontSize: 12.5, fontWeight: 700, color: col, display: "flex", alignItems: "center", gap: 6 }}>
        <Ok />{analysis.price_label}
      </div>
    </div>
  );
}
