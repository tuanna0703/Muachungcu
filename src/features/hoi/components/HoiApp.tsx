"use client";

import { useState, useCallback } from "react";
import { T, BRAND } from "@/styles/tokens";
import { Reset } from "@/components/icons";

import Header       from "./Header";
import BottomNav    from "./BottomNav";
import InputZone    from "./InputZone";
import ChatArea     from "./ChatArea";
import IntelContent from "./IntelContent";
import AuthModal    from "./AuthModal";
import HistoryPanel from "./HistoryPanel";
import ShareModal   from "./ShareModal";

import { useViewport }    from "@/features/hoi/hooks/useViewport";
import { useAuth }        from "@/features/hoi/hooks/useAuth";
import { useHistory }     from "@/features/hoi/hooks/useHistory";
import { useShare }       from "@/features/hoi/hooks/useShare";
import { useChatSession } from "@/features/hoi/hooks/useChatSession";
import type { IntelData } from "@/types/ai";
import type { Session }   from "@/types/session";

export default function HoiApp() {
  const { isMob, isTbl, isDsk } = useViewport();
  const { auth, login, logout }  = useAuth();
  const { sessions, persist, remove, refresh } = useHistory(auth?.email);
  const { shareData, setShareData, showShare, openShare, closeShare } = useShare();

  const [showAuth,    setShowAuth]    = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [inputTxt,    setInputTxt]    = useState("");

  /* callbacks for useChatSession */
  const handleIntelUpdate = useCallback((_data: IntelData) => {}, []);
  const handleAnalysisDone = useCallback((data: IntelData) => {
    setShareData({ profile: data.profile, analysis: data.analysis });
  }, [setShareData]);
  const handlePersist = useCallback((s: Session) => {
    persist(s);
  }, [persist]);

  const chat = useChatSession({
    isMob,
    onIntelUpdate:  handleIntelUpdate,
    onAnalysisDone: handleAnalysisDone,
    onPersist:      handlePersist,
    inputTxt,
    userEmail:      auth?.email,
  });

  const userInitials = auth?.email?.[0]?.toUpperCase() ?? "G";

  /* ── IntelContent scroll wrapper ── */
  function IntelScroll() {
    return (
      <div ref={chat.intelRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
        <IntelContent intelData={chat.intelData} onShare={() => openShare()} />
      </div>
    );
  }

  /* ── Sub tab selector (right panel desktop/tablet) ── */
  function SubTabBar() {
    return (
      <div style={{ display: "flex", background: T.bg, borderRadius: 10, padding: 3 }}>
        {["Hồ sơ dự án", "Phân tích", "Lịch sử"].map((t, i) => (
          <div key={t} style={{ flex: 1, padding: "5px 12px", borderRadius: 8, fontSize: 11.5, fontWeight: 600, textAlign: "center", background: i === 0 ? "#fff" : "transparent", color: i === 0 ? T.text : T.muted, boxShadow: i === 0 ? "0 1px 4px rgba(0,0,0,.08)" : "none", cursor: "pointer" }}>{t}</div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: "'Open Sans',sans-serif", background: T.bg }}>
      <Header
        auth={auth}
        status={chat.status}
        sessionCount={sessions.length}
        isMob={isMob}
        onShowShare={() => openShare()}
        onShowHistory={() => setShowHistory(true)}
        onLogin={() => setShowAuth(true)}
        onLogout={() => { logout(); refresh(); }}
      />

      {/* ══ MOBILE ══ */}
      {isMob && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

            {chat.tab === "input" && (
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 0" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, margin: "10px 0 3px", lineHeight: 1.2 }}>{BRAND.tagline}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginBottom: 14 }}>Hỏi gì về chung cư — AI trả lời ngay</div>
                  <InputZone inputTxt={inputTxt} onInput={setInputTxt} onSubmit={() => chat.startFlow(inputTxt)} aiLoading={chat.aiLoading} />
                  <div style={{ height: 16 }} />
                </div>
              </div>
            )}

            {chat.tab === "chat" && (
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <ChatArea
                  msgs={chat.msgs} typing={chat.typing} aiLoading={chat.aiLoading}
                  status={chat.status} showQuick={chat.showQuick}
                  userReply={chat.userReply} initials={userInitials}
                  chatRef={chat.chatRef}
                  onReplyChange={chat.setUserReply}
                  onReply={chat.sendReply}
                  onShare={() => openShare()}
                  onQuickPick={(q) => { chat.setUserReply(q); }}
                />
              </div>
            )}

            {chat.tab === "intel" && (
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "10px 16px 8px", flexShrink: 0 }}>
                  <SubTabBar />
                </div>
                <IntelScroll />
              </div>
            )}
          </div>

          <BottomNav
            tab={chat.tab}
            chatDot={chat.chatDot}
            intelDot={chat.intelDot}
            onTab={(t) => {
              chat.setTab(t);
              if (t === "chat")  chat.setChatDot(false);
              if (t === "intel") chat.setIntelDot(false);
            }}
          />
        </div>
      )}

      {/* ══ TABLET ══ */}
      {isTbl && (
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "16px 16px 0", gap: 12, maxWidth: 900, margin: "0 auto", width: "100%" }}>
          {/* 2-col grid */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minHeight: 0 }}>
            <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(229,57,53,.06)", minHeight: 0 }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>Trò chuyện AI</div>
                {chat.msgs.length > 0 && (
                  <button
                    onClick={() => { chat.reset(); setInputTxt(""); }}
                    style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "#111827", color: "#fff", border: "none", borderRadius: 99, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans',sans-serif" }}
                  >
                    <Reset />Hỏi câu khác
                  </button>
                )}
              </div>
              <ChatArea
                msgs={chat.msgs} typing={chat.typing} aiLoading={chat.aiLoading}
                status={chat.status} showQuick={chat.showQuick}
                userReply={chat.userReply} initials={userInitials}
                chatRef={chat.chatRef}
                onReplyChange={chat.setUserReply}
                onReply={chat.sendReply}
                onShare={() => openShare()}
                onQuickPick={(q) => chat.setUserReply(q)}
              />
            </div>
            <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(229,57,53,.06)" }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>Hồ sơ dự án</div>
              </div>
              <IntelScroll />
            </div>
          </div>

          {/* Input card — only shown before chat starts */}
          {chat.msgs.length === 0 && (
            <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", flexShrink: 0, boxShadow: "0 2px 12px rgba(229,57,53,.06)" }}>
              <div style={{ padding: "10px 18px 8px", borderBottom: `1px solid ${T.border}`, background: "#FAFBFB" }}>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: -0.3 }}>{BRAND.tagline}</div>
              </div>
              <div style={{ padding: "12px 18px 14px", background: "#FAFBFB" }}>
                <InputZone inputTxt={inputTxt} onInput={setInputTxt} onSubmit={() => chat.startFlow(inputTxt)} aiLoading={chat.aiLoading} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ DESKTOP ══ */}
      {isDsk && (
        <div style={{ flex: 1, overflow: "hidden", display: "flex", maxWidth: 1380, width: "100%", margin: "0 auto", padding: "18px 20px 0", gap: 14 }}>
          {/* Left panel — phase 1: input form / phase 2: chat */}
          <div style={{ width: 460, flexShrink: 0, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 16px rgba(229,57,53,.06)" }}>
            {chat.msgs.length === 0 ? (
              /* ── Phase 1: Input form ── */
              <>
                <div style={{ padding: "16px 20px 14px", borderBottom: `1px solid ${T.border}`, flexShrink: 0, background: "#FAFBFB" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.2, marginBottom: 2 }}>{BRAND.tagline}</div>
                  <div style={{ fontSize: 11.5, color: T.muted }}>Dán tin rao hoặc đặt câu hỏi về bất kỳ dự án chung cư nào</div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 20px" }}>
                  <InputZone inputTxt={inputTxt} onInput={setInputTxt} onSubmit={() => chat.startFlow(inputTxt)} aiLoading={chat.aiLoading} />
                </div>
              </>
            ) : (
              /* ── Phase 2: Chat window ── */
              <>
                <div style={{ padding: "11px 16px 10px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0, background: "#FAFBFB" }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>Trò chuyện AI</div>
                  <button
                    onClick={() => { chat.reset(); setInputTxt(""); }}
                    style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: "#111827", color: "#fff", border: "none", borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Open Sans',sans-serif" }}
                  >
                    <Reset />Hỏi câu khác
                  </button>
                </div>
                <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <ChatArea
                    msgs={chat.msgs} typing={chat.typing} aiLoading={chat.aiLoading}
                    status={chat.status} showQuick={chat.showQuick}
                    userReply={chat.userReply} initials={userInitials}
                    chatRef={chat.chatRef}
                    onReplyChange={chat.setUserReply}
                    onReply={chat.sendReply}
                    onShare={() => openShare()}
                    onQuickPick={(q) => chat.setUserReply(q)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Right panel */}
          <div style={{ flex: 1, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 16px rgba(229,57,53,.06)" }}>
            <div style={{ padding: "16px 20px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.3 }}>Hồ sơ dự án</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>Được xây dựng tự động từ câu hỏi của bạn</div>
              </div>
              <SubTabBar />
            </div>
            <IntelScroll />
          </div>
        </div>
      )}

      {/* Footer */}
      {!isMob && (
        <footer style={{ textAlign: "center", padding: "9px", fontSize: 11, color: T.muted, borderTop: `1px solid ${T.border}`, background: "#fff", flexShrink: 0 }}>
          ⚠️ Phân tích AI chỉ mang tính tham khảo. © 2025 {BRAND.siteName} ({BRAND.domain}) — Tính năng hỏi AI
        </footer>
      )}

      {/* FAB: Hỏi câu khác — mobile only (desktop/tablet have inline reset button) */}
      {isMob && chat.status === "ready" && (
        <button
          onClick={() => { chat.reset(); setInputTxt(""); }}
          style={{ position: "fixed", bottom: 68, right: 14, background: "#111827", color: "#fff", padding: "10px 18px", borderRadius: 99, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 7, boxShadow: "0 4px 20px rgba(17,24,39,.22)", border: "none", cursor: "pointer", fontFamily: "'Open Sans',sans-serif", zIndex: 900 }}
        >
          <Reset />Hỏi câu khác
        </button>
      )}

      {/* Modals */}
      {showAuth && (
        <AuthModal
          onSuccess={(user) => { login(user); setShowAuth(false); refresh(); }}
          onClose={() => setShowAuth(false)}
        />
      )}

      {showHistory && (
        <HistoryPanel
          sessions={sessions}
          userEmail={auth?.email}
          onLoad={(s) => { chat.loadSession(s); setShowHistory(false); if (isMob) chat.setTab("chat"); }}
          onDelete={(id) => remove(id)}
          onShare={(s) => { if (s.intelData) setShareData({ profile: s.intelData.profile, analysis: s.intelData.analysis }); setShowHistory(false); openShare(); }}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showShare && (
        <ShareModal
          onClose={closeShare}
          profile={shareData?.profile ?? null}
          analysis={shareData?.analysis ?? null}
        />
      )}
    </div>
  );
}
