"use client";

import { T } from "@/styles/tokens";
import Logo from "@/components/ui/Logo";
import { Share, History, User, Logout } from "@/components/icons";
import type { AuthUser } from "@/types/auth";

interface HeaderProps {
  auth:          AuthUser | null;
  status:        "idle" | "analyzing" | "ready";
  sessionCount:  number;
  isMob:         boolean;
  onShowShare:   () => void;
  onShowHistory: () => void;
  onLogin:       () => void;
  onLogout:      () => void;
}

function StatusBadge({ status }: { status: HeaderProps["status"] }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
      background: status === "ready" ? "#E6FAF3" : status === "analyzing" ? "#FFF4E5" : "#F6F7FB",
      color:      status === "ready" ? "#0E9960"  : status === "analyzing" ? "#FF8A00"  : "#8A93AD",
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: status === "analyzing" ? "mccBlink 1.4s infinite" : "none" }} />
      {status === "ready" ? "✓ Phân tích xong" : status === "analyzing" ? "Đang phân tích…" : "Chờ câu hỏi"}
    </div>
  );
}

export default function Header({ auth, status, sessionCount, isMob, onShowShare, onShowHistory, onLogin, onLogout }: HeaderProps) {
  const initials = auth?.email?.[0]?.toUpperCase() ?? "G";

  return (
    <header style={{ background: "#fff", borderBottom: `1px solid ${T.border}`, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0, boxShadow: "0 2px 12px rgba(17,24,39,.05)" }}>
      <Logo size="md" showTag={!isMob} />

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {!isMob && <StatusBadge status={status} />}

        {status === "ready" && (
          <button onClick={onShowShare} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: "linear-gradient(135deg,#19C37D,#0DA86A)", color: "#fff", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans',sans-serif" }}>
            <Share />{!isMob && "Chia sẻ"}
          </button>
        )}

        <button onClick={onShowHistory} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 9, border: `1px solid ${T.border}`, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.muted, fontFamily: "'Open Sans',sans-serif" }}>
          <History />{!isMob && "Lịch sử"}
          {sessionCount > 0 && (
            <span style={{ background: T.red, color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 800, padding: "1px 5px" }}>{sessionCount}</span>
          )}
        </button>

        {auth ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "#E6FAF3", border: "1px solid #A7EDD0", borderRadius: 99, fontSize: 11.5, fontWeight: 700, color: "#0E9960" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#19C37D", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{initials}</div>
              {!isMob && <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{auth.email.split("@")[0]}</span>}
            </div>
            <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 8px", border: `1px solid ${T.border}`, borderRadius: 9, background: "#fff", cursor: "pointer", color: T.muted, fontSize: 11, fontFamily: "'Open Sans',sans-serif" }}>
              <Logout />{!isMob && "Đăng xuất"}
            </button>
          </div>
        ) : (
          <button onClick={onLogin} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: T.red, color: "#fff", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans',sans-serif" }}>
            <User />{!isMob && "Đăng nhập"}
          </button>
        )}
      </div>
    </header>
  );
}
