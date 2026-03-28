"use client";

import { useState } from "react";
import { T } from "@/styles/tokens";
import { Close, Copy, Share } from "@/components/icons";
import ShareCard from "./ShareCard";
import { useShare, type ShareData } from "@/features/hoi/hooks/useShare";
import type { ProjectProfile, AnalysisData } from "@/types/ai";

interface ShareModalProps {
  onClose:  () => void;
  profile:  Partial<ProjectProfile> | null;
  analysis: AnalysisData | null;
}

async function copyText(str: string) {
  try {
    await navigator.clipboard.writeText(str);
  } catch {
    const t = document.createElement("textarea");
    t.value = str;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    document.body.removeChild(t);
  }
}

export default function ShareModal({ onClose, profile, analysis }: ShareModalProps) {
  const [copied, setCopied] = useState("");
  const [tab, setTab]       = useState<"card" | "text">("card");

  const url = typeof window !== "undefined" ? window.location.href : "https://hoi.muachungcu.net";
  const { buildTexts } = useShare();
  const data: ShareData = { profile: profile ?? {}, analysis };
  const { short: shortTxt, full: fullTxt } = buildTexts(data);
  const enc = (s: string) => encodeURIComponent(s);

  async function copy(str: string, key: string) {
    await copyText(str);
    setCopied(key);
    setTimeout(() => setCopied(""), 2200);
  }

  const CHANNELS = [
    { id: "fb",   label: "Facebook",    color: "#1877F2", bg: "#E8F0FE", action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(shortTxt)}`) },
    { id: "zalo", label: "Zalo",        color: "#0068FF", bg: "#E5F0FF", action: () => window.open(`https://zalo.me/share/entry/?url=${enc(url)}&text=${enc(shortTxt)}`) },
    { id: "tele", label: "Telegram",    color: "#26A5E4", bg: "#E5F5FD", action: () => window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc(shortTxt)}`) },
    { id: "twit", label: "X/Twitter",   color: "#000",    bg: "#F0F0F0", action: () => window.open(`https://twitter.com/intent/tweet?text=${enc(shortTxt)}`) },
    { id: "sms",  label: "SMS/iMsg",    color: "#34C759", bg: "#EDFAF0", action: () => window.open(`sms:?&body=${enc(shortTxt)}`) },
    { id: "copy", label: copied === "link" ? "✓ Đã sao chép" : "Sao chép link", color: T.red, bg: T.redSoft, action: () => copy(url, "link") },
  ];

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 2000, backdropFilter: "blur(4px)", animation: "mccFade .2s ease" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 520, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 -8px 40px rgba(17,24,39,.18)", animation: "mccSlideUp .25s ease" }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
          <div style={{ width: 36, height: 4, background: T.border, borderRadius: 99 }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px 10px" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Chia sẻ phân tích</div>
            <div style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>{profile?.project ?? "Phân tích dự án"}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, display: "flex", padding: 4 }}><Close /></button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", margin: "0 20px 14px", background: T.bg, borderRadius: 10, padding: 3 }}>
          {(["card", "text"] as const).map((id) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "7px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'Open Sans',sans-serif", background: tab === id ? "#fff" : "transparent", color: tab === id ? T.text : T.muted, boxShadow: tab === id ? "0 1px 6px rgba(0,0,0,.08)" : "none" }}>
              {id === "card" ? "🃏 Thẻ chia sẻ" : "📝 Văn bản"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px" }}>
          {tab === "card" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ShareCard profile={profile} analysis={analysis} />
              </div>
              <div style={{ display: "flex", gap: 8, padding: "10px 12px", background: T.bg, borderRadius: 12, alignItems: "center" }}>
                <div style={{ flex: 1, fontSize: 12, color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace" }}>hoi.muachungcu.net/share/…</div>
                <button onClick={() => copy(url, "link")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: copied === "link" ? T.greenSoft : "#fff", border: `1px solid ${copied === "link" ? "#A7EDD0" : T.border}`, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", color: copied === "link" ? "#0E9960" : T.red, fontFamily: "'Open Sans',sans-serif", flexShrink: 0, transition: "all .2s" }}>
                  {copied === "link" ? <>✓ Đã sao chép</> : <><Copy />Sao chép link</>}
                </button>
              </div>
            </div>
          )}

          {tab === "text" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: T.bg, borderRadius: 12, padding: "12px 14px", fontSize: 12, lineHeight: 1.7, color: T.text, fontFamily: "monospace", whiteSpace: "pre-wrap", maxHeight: 200, overflowY: "auto", border: `1px solid ${T.border}` }}>
                {fullTxt}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {([["short", "Sao chép ngắn", shortTxt], ["full", "Sao chép đầy đủ", fullTxt]] as [string, string, string][]).map(([k, lbl, str]) => (
                  <button key={k} onClick={() => copy(str, k)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", background: copied === k ? T.greenSoft : k === "short" ? T.redSoft : "#fff", border: `1px solid ${copied === k ? "#A7EDD0" : k === "short" ? T.redMid : T.border}`, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", color: copied === k ? "#0E9960" : k === "short" ? T.red : T.text, fontFamily: "'Open Sans',sans-serif", transition: "all .2s" }}>
                    {copied === k ? <>✓ Đã sao chép</> : <><Copy />{lbl}</>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Social channels */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: T.muted, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 10 }}>Chia sẻ qua</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={ch.action}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px", background: ch.bg, border: `1px solid ${ch.color}22`, borderRadius: 12, cursor: "pointer", fontFamily: "'Open Sans',sans-serif", transition: "all .15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 12px ${ch.color}33`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: ch.color, textAlign: "center" }}>{ch.label}</div>
                </button>
              ))}
            </div>
          </div>

          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={async () => { try { await navigator.share({ title: "Phân tích BĐS – hoi.muachungcu.net", text: shortTxt, url }); } catch { /* user cancelled */ } }}
              style={{ width: "100%", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", background: "#111827", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'Open Sans',sans-serif" }}
            >
              <Share />Chia sẻ qua ứng dụng khác…
            </button>
          )}

          <div style={{ marginTop: 14, padding: "10px 12px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, fontSize: 11, color: "#92400E", lineHeight: 1.55, display: "flex", gap: 6 }}>
            <span>⚠️</span><span>Phân tích AI chỉ mang tính tham khảo. Vui lòng xác minh trước khi giao dịch.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
