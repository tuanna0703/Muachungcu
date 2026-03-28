"use client";

import { T } from "@/styles/tokens";

export function AiAvatar() {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      flexShrink: 0, marginTop: 2,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 9, fontWeight: 800, color: "#fff",
      background: `linear-gradient(135deg,${T.red},${T.redDark})`,
      letterSpacing: -0.3,
    }}>
      hỏi
    </div>
  );
}

interface UserAvatarProps {
  initials?: string;
}

export function UserAvatar({ initials }: UserAvatarProps) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      flexShrink: 0, marginTop: 2,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 800, color: "#fff",
      background: "linear-gradient(135deg,#444,#777)",
    }}>
      {initials ?? "U"}
    </div>
  );
}
