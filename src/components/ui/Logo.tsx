"use client";

import { T, BRAND } from "@/styles/tokens";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?:    LogoSize;
  showTag?: boolean;
}

const SIZES = {
  sm: { mark: 28, name: 13, tag: 9 },
  md: { mark: 32, name: 15, tag: 10 },
  lg: { mark: 42, name: 20, tag: 12 },
} as const;

export default function Logo({ size = "md", showTag = false }: LogoProps) {
  const s = SIZES[size];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size === "lg" ? 12 : 9 }}>
      {/* Mark */}
      <div style={{
        width: s.mark, height: s.mark,
        background: `linear-gradient(135deg,${T.red},${T.redDark})`,
        borderRadius: size === "lg" ? 12 : 8,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 2px 8px ${T.red}44`,
      }}>
        <span style={{ fontFamily: "'Open Sans',sans-serif", fontSize: s.mark * 0.34, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>
          mcc
        </span>
      </div>

      {/* Text */}
      <div>
        <div style={{ fontSize: s.name, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.1, color: T.text }}>
          <span>muachungcu</span>
          <span style={{ color: T.muted, fontWeight: 400 }}>.net</span>
          <span style={{
            display: "inline-flex", alignItems: "center",
            marginLeft: 6, padding: "1px 7px",
            background: T.red, color: "#fff",
            borderRadius: 99, fontSize: s.name * 0.68,
            fontWeight: 800, verticalAlign: "middle", letterSpacing: 0,
          }}>
            hỏi
          </span>
        </div>
        {showTag && (
          <div style={{ fontSize: s.tag, color: T.muted, marginTop: 2, fontWeight: 400 }}>
            {BRAND.shortTag}
          </div>
        )}
      </div>
    </div>
  );
}
