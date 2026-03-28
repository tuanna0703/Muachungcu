"use client";

import { BRAND } from "@/styles/tokens";
import type { ProjectProfile, AnalysisData } from "@/types/ai";

interface ShareCardProps {
  profile:  Partial<ProjectProfile> | null;
  analysis: AnalysisData | null;
}

export default function ShareCard({ profile, analysis }: ShareCardProps) {
  return (
    <div style={{
      background: "linear-gradient(135deg,#B71C1C 0%,#E53935 60%,#FF6B6B 100%)",
      borderRadius: 16, padding: "20px 20px 16px", color: "#fff",
      fontFamily: "'Open Sans',sans-serif",
      width: "100%", maxWidth: 340,
      boxShadow: "0 8px 32px #E5393555",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 30, height: 30, background: "rgba(255,255,255,.18)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>hỏi</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: -0.3 }}>
            hỏi.<span style={{ opacity: 0.7 }}>muachungcu.net</span>
          </div>
          <div style={{ fontSize: 9, opacity: 0.55 }}>AI tra cứu dự án chung cư</div>
        </div>
        {analysis && (
          <div style={{ marginLeft: "auto", background: "rgba(255,255,255,.2)", borderRadius: 99, padding: "3px 10px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
            {analysis.verdict_pill}
          </div>
        )}
      </div>

      <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3, marginBottom: 3, lineHeight: 1.25 }}>
        {profile?.project ?? "Phân tích dự án"}
      </div>
      <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 14 }}>
        {[profile?.type, profile?.area, profile?.province].filter(Boolean).join(" • ")}
      </div>

      {/* Key data grid */}
      {profile && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 14 }}>
          {([["Giá rao", profile.price], ["Giá/m²", profile.price_per_sqm], ["Giao dịch", profile.transaction_type], ["Tình trạng", profile.handover_status]] as [string, string | undefined][]).filter(([, v]) => v).map(([l, v]) => (
            <div key={l} style={{ background: "rgba(255,255,255,.12)", borderRadius: 9, padding: "7px 9px" }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>{v}</div>
              <div style={{ fontSize: 9, opacity: 0.5, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      )}

      {analysis?.verdict_main && (
        <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 10, padding: "8px 12px", marginBottom: 12, fontSize: 12, fontWeight: 700 }}>
          ✅ {analysis.verdict_main}
        </div>
      )}

      {analysis?.risks && analysis.risks.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
          {analysis.risks.slice(0, 3).map((r) => (
            <span key={r} style={{ background: "rgba(0,0,0,.18)", borderRadius: 99, padding: "3px 8px", fontSize: 10, fontWeight: 600 }}>⚠ {r}</span>
          ))}
        </div>
      )}

      <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 9, opacity: 0.45 }}>
        <span>{BRAND.subdomain} • {new Date().toLocaleDateString("vi-VN")}</span>
        <span>⚡ AI phân tích tức thì</span>
      </div>
    </div>
  );
}
