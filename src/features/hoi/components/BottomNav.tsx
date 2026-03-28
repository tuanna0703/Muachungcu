"use client";

import type { JSX } from "react";
import { T } from "@/styles/tokens";
import { Search, Chat, Home } from "@/components/icons";

type Tab = "input" | "chat" | "intel";

interface BottomNavProps {
  tab:     Tab;
  chatDot: boolean;
  intelDot: boolean;
  onTab:   (t: Tab) => void;
}

const NAV_ITEMS: { id: Tab; label: string; Icon: () => JSX.Element; dotKey: keyof Pick<BottomNavProps, "chatDot" | "intelDot"> | null }[] = [
  { id: "input", label: "Hỏi AI",      Icon: Search, dotKey: null },
  { id: "chat",  label: "Trò chuyện",  Icon: Chat,   dotKey: "chatDot" },
  { id: "intel", label: "Hồ sơ",       Icon: Home,   dotKey: "intelDot" },
];

export default function BottomNav({ tab, chatDot, intelDot, onTab }: BottomNavProps) {
  const dots = { chatDot, intelDot };

  return (
    <nav style={{ display: "flex", background: "#fff", borderTop: `1px solid ${T.border}`, height: 56, flexShrink: 0, boxShadow: "0 -4px 16px rgba(17,24,39,.06)" }}>
      {NAV_ITEMS.map(({ id, label, Icon, dotKey }) => {
        const hasDot = dotKey ? dots[dotKey] : false;
        const active = tab === id;
        return (
          <button
            key={id}
            onClick={() => onTab(id)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, fontSize: 10.5, fontWeight: 600, border: "none", background: "none", cursor: "pointer", color: active ? T.red : T.muted, position: "relative", fontFamily: "'Open Sans',sans-serif" }}
          >
            <div style={{ position: "relative", display: "inline-flex" }}>
              <Icon />
              {hasDot && <div style={{ position: "absolute", top: -1, right: -2, width: 8, height: 8, background: T.red, border: "1.5px solid #fff", borderRadius: "50%" }} />}
            </div>
            {label}
            {active && <div style={{ position: "absolute", bottom: 0, width: 24, height: 2, background: T.red, borderRadius: "2px 2px 0 0" }} />}
          </button>
        );
      })}
    </nav>
  );
}
