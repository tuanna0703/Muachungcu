"use client";

import { T } from "@/styles/tokens";
import { Close, Share, Trash } from "@/components/icons";
import { fmtDate } from "@/lib/utils";
import type { Session } from "@/types/session";

interface HistoryPanelProps {
  sessions:  Session[];
  userEmail: string | undefined;
  onLoad:    (s: Session) => void;
  onDelete:  (id: string) => void;
  onShare:   (s: Session) => void;
  onClose:   () => void;
}

export default function HistoryPanel({ sessions, userEmail, onLoad, onDelete, onShare, onClose }: HistoryPanelProps) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,.45)", zIndex: 1500, display: "flex", justifyContent: "flex-end", backdropFilter: "blur(3px)", animation: "mccFade .2s ease" }}>
      <div style={{ width: "min(360px,100%)", background: "#fff", height: "100%", display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(17,24,39,.15)" }}>
        {/* Header */}
        <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>Lịch sử tra cứu</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
              {userEmail
                ? <span style={{ color: T.red }}>☁ {userEmail}</span>
                : "💾 Lưu trên thiết bị này"}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, display: "flex" }}><Close /></button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
          {sessions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 16px", color: T.muted }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Chưa có lịch sử</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Các câu hỏi sẽ xuất hiện ở đây.</div>
            </div>
          ) : sessions.map((s) => (
            <div key={s.id} style={{ background: T.bg, borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => onLoad(s)}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3, color: T.text, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.title || "Tra cứu dự án"}
                  </div>
                  <div style={{ fontSize: 11, color: T.muted }}>{fmtDate(s.createdAt)}</div>
                  {s.intelData?.analysis?.verdict_pill && (
                    <div style={{ marginTop: 5, display: "inline-block", padding: "2px 8px", background: T.redSoft, border: `1px solid ${T.redMid}`, borderRadius: 99, fontSize: 10.5, fontWeight: 700, color: T.red }}>
                      {s.intelData.analysis.verdict_pill}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {s.intelData?.stage === "analysis" && (
                    <button onClick={(e) => { e.stopPropagation(); onShare(s); }} style={{ background: "none", border: `1px solid ${T.redMid}`, borderRadius: 7, cursor: "pointer", color: T.red, padding: "4px 6px", display: "flex" }}>
                      <Share />
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); onDelete(s.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: 4, display: "flex" }}>
                    <Trash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
