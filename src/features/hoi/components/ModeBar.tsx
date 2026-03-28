"use client";

import type { JSX } from "react";
import { T } from "@/styles/tokens";
import { Doc, Img } from "@/components/icons";

type InputMode = "text" | "image";

interface ModeBarProps {
  mode:    InputMode;
  onMode:  (m: InputMode) => void;
}

const MODES: [InputMode, string, () => JSX.Element][] = [
  ["text",  "Văn bản / Câu hỏi", Doc],
  ["image", "Ảnh chụp",          Img],
];

export default function ModeBar({ mode, onMode }: ModeBarProps) {
  return (
    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
      {MODES.map(([m, lbl, Icon]) => (
        <button
          key={m}
          onClick={() => onMode(m)}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "6px 13px", borderRadius: 99, whiteSpace: "nowrap",
            cursor: "pointer",
            border:      mode === m ? `1.5px solid ${T.red}` : `1.5px solid ${T.border}`,
            background:  mode === m ? T.redSoft : "#fff",
            color:       mode === m ? T.red     : T.muted,
            fontSize: 12, fontWeight: 600,
          }}
        >
          <Icon />{lbl}
        </button>
      ))}
    </div>
  );
}
