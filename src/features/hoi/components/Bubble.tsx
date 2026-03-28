"use client";

import { T, FIELD_LABELS } from "@/styles/tokens";
import { AiAvatar, UserAvatar } from "@/components/ui/Avatar";
import { Warn } from "@/components/icons";
import type { ChatMessage } from "@/types/session";

interface BubbleProps {
  msg:      ChatMessage;
  initials: string;
}

export default function Bubble({ msg, initials }: BubbleProps) {
  const me = msg.role === "user";

  return (
    <div style={{ display: "flex", gap: 8, flexDirection: me ? "row-reverse" : "row", animation: "mccFade .3s ease" }}>
      {me ? <UserAvatar initials={initials} /> : <AiAvatar />}

      <div style={{ maxWidth: "calc(100% - 42px)", display: "flex", flexDirection: "column", alignItems: me ? "flex-end" : "flex-start" }}>
        <div style={{
          padding: "10px 13px", borderRadius: 14,
          borderTopLeftRadius:  me ? 14 : 3,
          borderTopRightRadius: me ? 3  : 14,
          background: me ? "#EDEEF5" : T.redSoft,
          fontSize: 13, lineHeight: 1.65, color: T.text,
        }}>
          {msg.error ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#E53E3E", fontSize: 12 }}>
              <Warn />{msg.text}
            </div>
          ) : (
            <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
          )}

          {/* Profile snapshot (parse stage) */}
          {msg.profile && Object.values(msg.profile).some((v) => v) && (
            <div style={{ background: "#fff", border: `1px solid ${T.redMid}`, borderRadius: 10, padding: "8px 10px", marginTop: 8, fontSize: 12 }}>
              {Object.entries(msg.profile).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 8, padding: "2.5px 0" }}>
                  <span style={{ color: T.muted, minWidth: 100, fontSize: 11.5 }}>{FIELD_LABELS[k] ?? k}</span>
                  <span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Clarify questions */}
          {msg.questions && msg.questions.length > 0 && (
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
              {msg.questions.map((q, i) => (
                <div key={i} style={{ display: "flex", gap: 7, fontSize: 12.5, alignItems: "flex-start" }}>
                  <div style={{
                    width: 18, height: 18, background: T.red, color: "#fff",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800, flexShrink: 0, marginTop: 1,
                  }}>{i + 1}</div>
                  <div>{q}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ fontSize: 10, color: T.muted, marginTop: 4, padding: "0 3px" }}>{msg.time}</div>
      </div>
    </div>
  );
}
