"use client";

import { RefObject } from "react";
import { T, inputS } from "@/styles/tokens";
import Bubble  from "./Bubble";
import Typing  from "@/components/ui/Typing";
import { Chat, Send, Share } from "@/components/icons";
import type { ChatMessage } from "@/types/session";

interface ChatAreaProps {
  msgs:       ChatMessage[];
  typing:     boolean;
  aiLoading:  boolean;
  status:     "idle" | "analyzing" | "ready";
  showQuick:  boolean;
  userReply:  string;
  initials:   string;
  chatRef:    RefObject<HTMLDivElement | null>;
  onReplyChange: (v: string) => void;
  onReply:       () => void;
  onShare:       () => void;
  onQuickPick:   (q: string) => void;
}

const QUICK_ACTIONS = ["Phân tích rủi ro pháp lý", "So sánh giá khu vực", "Tiềm năng cho thuê"];

export default function ChatArea({
  msgs, typing, aiLoading, status, showQuick,
  userReply, initials, chatRef,
  onReplyChange, onReply, onShare, onQuickPick,
}: ChatAreaProps) {
  return (
    <>
      {/* Chat scroll area */}
      <div
        ref={chatRef}
        style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14, scrollBehavior: "smooth" }}
      >
        {msgs.length === 0 && !typing && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, textAlign: "center", padding: "32px 12px", color: "#C5CCDE" }}>
            <Chat />
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>Nhập câu hỏi và nhấn Hỏi AI để bắt đầu.</div>
          </div>
        )}
        {msgs.map((m) => <Bubble key={m.id} msg={m} initials={initials} />)}
        {typing && <Typing />}
      </div>

      {/* Reply input */}
      {msgs.length > 0 && status !== "ready" && (
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8, flexShrink: 0, background: "#fff" }}>
          <input
            value={userReply}
            onChange={(e) => onReplyChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onReply()}
            placeholder="Trả lời câu hỏi của AI…"
            disabled={aiLoading}
            style={{ ...inputS({ flex: 1, padding: "9px 12px", fontSize: 13, borderRadius: 10 }) }}
            onFocus={(e) => (e.target.style.borderColor = T.red)}
            onBlur={(e)  => (e.target.style.borderColor = T.border)}
          />
          <button
            onClick={onReply}
            disabled={aiLoading || !userReply.trim()}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: T.red, color: "#fff",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: aiLoading || !userReply.trim() ? 0.5 : 1, flexShrink: 0,
            }}
          >
            <Send />
          </button>
        </div>
      )}

      {/* Quick actions */}
      {showQuick && (
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 7, flexWrap: "wrap", flexShrink: 0, background: "#fff", alignItems: "center" }}>
          {QUICK_ACTIONS.map((c) => (
            <button
              key={c}
              onClick={() => onQuickPick(c)}
              style={{
                padding: "7px 12px", borderRadius: 99,
                border: `1.5px solid ${T.redMid}`, background: T.redSoft, color: T.red,
                fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans',sans-serif",
              }}
            >
              {c}
            </button>
          ))}
          <button
            onClick={onShare}
            style={{
              marginLeft: "auto", display: "flex", alignItems: "center", gap: 5,
              padding: "7px 12px", background: T.greenSoft, border: "1px solid #A7EDD0",
              borderRadius: 99, color: "#0E9960", fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Open Sans',sans-serif",
            }}
          >
            <Share />Chia sẻ
          </button>
        </div>
      )}
    </>
  );
}
