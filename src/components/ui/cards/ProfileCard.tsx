"use client";

import { T, cardS, lblS, FIELD_LABELS } from "@/styles/tokens";
import { Check } from "@/components/icons";
import type { ProjectProfile } from "@/types/ai";

interface ProfileCardProps {
  profile: Partial<ProjectProfile>;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const filled = Object.entries(profile ?? {}).filter(([, v]) => v) as [string, string][];
  if (!filled.length) return null;

  return (
    <div style={cardS}>
      <div style={lblS}>THÔNG TIN DỰ ÁN</div>
      {filled.map(([k, v], i, a) => (
        <div key={k} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "6.5px 0",
          borderBottom: i < a.length - 1 ? "1px solid #F2F3F8" : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: T.muted, fontWeight: 500 }}>
            <div style={{ width: 17, height: 17, background: T.greenSoft, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check />
            </div>
            {FIELD_LABELS[k] ?? k}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, textAlign: "right", maxWidth: "55%" }}>{v}</div>
        </div>
      ))}
    </div>
  );
}
