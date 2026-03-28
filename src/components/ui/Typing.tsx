"use client";

import { T } from "@/styles/tokens";
import { AiAvatar } from "./Avatar";

export default function Typing() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <AiAvatar />
      <div style={{
        display: "flex", gap: 4,
        padding: "12px 14px",
        background: T.redSoft,
        borderRadius: 14, borderTopLeftRadius: 3,
      }}>
        {[0, 200, 400].map((_, i) => (
          <div
            key={i}
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: T.red,
              animation: `mccBounce 1.3s ${i * 200}ms infinite`,
              opacity: 0.45,
            }}
          />
        ))}
      </div>
    </div>
  );
}
