"use client";

import { T } from "@/styles/tokens";
import ConfCard    from "@/components/ui/cards/ConfCard";
import ProfileCard from "@/components/ui/cards/ProfileCard";
import MissingCard from "@/components/ui/cards/MissingCard";
import PriceCard   from "@/components/ui/cards/PriceCard";
import OppCard     from "@/components/ui/cards/OppCard";
import RiskCard    from "@/components/ui/cards/RiskCard";
import RecCard     from "@/components/ui/cards/RecCard";
import { Home } from "@/components/icons";
import type { IntelData } from "@/types/ai";

interface IntelContentProps {
  intelData: IntelData | null;
  onShare:   () => void;
}

export default function IntelContent({ intelData, onShare }: IntelContentProps) {
  if (!intelData?.stage) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: "48px 24px" }}>
        <div style={{ width: 64, height: 64, background: T.redSoft, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Home />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#C5CCDE", marginBottom: 6 }}>Chưa có dữ liệu</div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.65 }}>Dán tin rao hoặc đặt câu hỏi<br />về dự án chung cư bất kỳ.</div>
        </div>
      </div>
    );
  }

  const { profile, missing_fields, confidence, analysis, stage } = intelData;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {confidence != null && <ConfCard val={confidence} />}
      <ProfileCard profile={profile} />
      {stage !== "analysis" && <MissingCard missing={missing_fields} />}
      {stage === "analysis" && analysis && (
        <>
          <PriceCard   analysis={analysis} profile={profile} />
          <OppCard     analysis={analysis} />
          <RiskCard    analysis={analysis} />
          <RecCard     analysis={analysis} onShare={onShare} />
        </>
      )}
    </div>
  );
}
