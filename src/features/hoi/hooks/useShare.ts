"use client";

import { useState, useCallback } from "react";
import type { ProjectProfile, AnalysisData } from "@/types/ai";
import { BRAND, FIELD_LABELS } from "@/styles/tokens";

export interface ShareData {
  profile:  Partial<ProjectProfile>;
  analysis: AnalysisData | null;
}

function buildShareText(
  profile:  Partial<ProjectProfile> | null,
  analysis: AnalysisData | null,
  short = false,
): string {
  const sep   = "─".repeat(30);
  const lines = [
    `🏠 PHÂN TÍCH DỰ ÁN — ${BRAND.subdomain}`,
    sep,
    ...Object.entries(profile ?? {}).filter(([, v]) => v).map(([k, v]) => `• ${FIELD_LABELS[k] ?? k}: ${v}`),
  ];
  if (analysis) {
    lines.push(`\n💰 ~${profile?.price_per_sqm ?? "N/A"} | TT: ${analysis.market_low}–${analysis.market_high} ${analysis.market_unit}`);
    lines.push(`✅ ${analysis.verdict_pill} — ${analysis.verdict_main}`);
    if (!short && analysis.risks?.length) {
      lines.push(`\n⚠️ Rủi ro:\n${analysis.risks.map((r) => `  • ${r}`).join("\n")}`);
    }
  }
  lines.push(`\n${sep}\n🔗 ${BRAND.subdomain} | AI tra cứu chung cư VN`);
  return lines.join("\n");
}

export function useShare() {
  const [shareData, setShareData]   = useState<ShareData | null>(null);
  const [showShare, setShowShare]   = useState(false);

  const openShare = useCallback((data?: ShareData) => {
    if (data) setShareData(data);
    setShowShare(true);
  }, []);

  const closeShare = useCallback(() => setShowShare(false), []);

  const buildTexts = useCallback((data: ShareData | null) => ({
    short: buildShareText(data?.profile ?? null, data?.analysis ?? null, true),
    full:  buildShareText(data?.profile ?? null, data?.analysis ?? null, false),
  }), []);

  return { shareData, setShareData, showShare, openShare, closeShare, buildTexts };
}
