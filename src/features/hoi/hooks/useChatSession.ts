"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { callAI } from "@/features/hoi/services/aiService";
import { nowTs, nowIso, uid } from "@/lib/utils";
import type { ChatMessage, HistoryEntry, Session } from "@/types/session";
import type { IntelData } from "@/types/ai";

interface UseChatSessionOptions {
  isMob:   boolean;
  onIntelUpdate: (data: IntelData) => void;
  onAnalysisDone: (data: IntelData) => void;
  onPersist: (s: Session) => void;
  inputTxt: string;
  userEmail: string | undefined;
}

export function useChatSession({
  isMob, onIntelUpdate, onAnalysisDone, onPersist, inputTxt, userEmail,
}: UseChatSessionOptions) {
  const [sessionId, setSessionId]  = useState(() => uid());
  const [msgs, setMsgs]            = useState<ChatMessage[]>([]);
  const [typing, setTyping]        = useState(false);
  const [aiLoading, setAiLoading]  = useState(false);
  const [intelData, setIntelData]  = useState<IntelData | null>(null);
  const [aiHistory, setAiHistory]  = useState<HistoryEntry[]>([]);
  const [status, setStatus]        = useState<"idle" | "analyzing" | "ready">("idle");
  const [showQuick, setShowQuick]  = useState(false);
  const [chatDot, setChatDot]      = useState(false);
  const [intelDot, setIntelDot]    = useState(false);
  const [userReply, setUserReply]  = useState("");
  const [tab, setTab]              = useState<"input" | "chat" | "intel">("input");

  const chatRef  = useRef<HTMLDivElement | null>(null);
  const intelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  /* auto-scroll */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, typing]);

  useEffect(() => {
    if (intelRef.current) intelRef.current.scrollTop = intelRef.current.scrollHeight;
  }, [intelData]);

  /* persist session on change */
  useEffect(() => {
    if (!msgs.length) return;
    const s: Session = {
      id:        sessionId,
      title:     (inputTxt || "Tra cứu dự án").slice(0, 60),
      createdAt: nowIso(),
      msgs,
      intelData,
      aiHistory,
    };
    onPersist(s);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs, intelData]);

  /* ── CORE AI CALL ── */
  const sendToAI = useCallback(async (history: HistoryEntry[]) => {
    setAiLoading(true);
    setTyping(true);
    try {
      const result = await callAI(history);
      setTyping(false);

      const updated: IntelData = {
        stage:          result.stage,
        profile:        result.profile ?? {} as IntelData["profile"],
        missing_fields: result.missing_fields ?? [],
        confidence:     result.confidence ?? 0,
        analysis:       result.analysis ?? null,
      };
      setIntelData(updated);
      onIntelUpdate(updated);
      if (isMob) setIntelDot(true);

      const aiMsg: ChatMessage = {
        role:      "ai",
        time:      nowTs(),
        id:        uid(),
        text:      result.message,
        profile:   result.stage === "parse"   ? (result.profile as unknown as Record<string, string>) : null,
        questions: result.stage === "clarify" ? result.questions : null,
      };
      setMsgs((p) => [...p, aiMsg]);

      if (result.stage === "analysis") {
        setStatus("ready");
        setShowQuick(true);
        onAnalysisDone(updated);
      }

      setAiHistory((p) => [...p, { role: "assistant", content: JSON.stringify(result) }]);
    } catch (e) {
      setTyping(false);
      const msg = e instanceof Error ? e.message : "Lỗi không xác định";
      setMsgs((p) => [...p, { role: "ai", time: nowTs(), id: uid(), text: `Lỗi kết nối: ${msg}`, error: true }]);
    }
    setAiLoading(false);
  }, [isMob, onIntelUpdate, onAnalysisDone]);

  /* ── START NEW FLOW ── */
  const startFlow = useCallback(async (text: string) => {
    if (!text.trim() || aiLoading) return;
    const nid = uid();
    setSessionId(nid);
    setStatus("analyzing");
    setMsgs([]);
    setIntelData(null);
    setShowQuick(false);
    setChatDot(true);
    setAiHistory([]);
    if (isMob) setTab("chat");

    const userMsg: ChatMessage = { role: "user", time: nowTs(), id: uid(), text };
    setMsgs([userMsg]);
    const history: HistoryEntry[] = [{ role: "user", content: `Tin rao/câu hỏi về BĐS:\n\n${text}` }];
    setAiHistory(history);
    await sendToAI(history);
  }, [aiLoading, isMob, sendToAI]);

  /* ── REPLY IN CONVERSATION ── */
  const sendReply = useCallback(async () => {
    const text = userReply.trim();
    if (!text || aiLoading) return;
    setUserReply("");
    setMsgs((p) => [...p, { role: "user", time: nowTs(), id: uid(), text }]);
    const history = [...aiHistory, { role: "user" as const, content: text }];
    setAiHistory(history);
    await sendToAI(history);
  }, [userReply, aiLoading, aiHistory, sendToAI]);

  /* ── LOAD SESSION FROM HISTORY ── */
  const loadSession = useCallback((s: Session) => {
    setSessionId(s.id);
    setMsgs(s.msgs ?? []);
    setIntelData(s.intelData ?? null);
    setAiHistory(s.aiHistory ?? []);
    setStatus(s.intelData?.stage === "analysis" ? "ready" : "idle");
    setShowQuick(s.intelData?.stage === "analysis");
    if (s.intelData) onIntelUpdate(s.intelData);
    if (s.intelData?.stage === "analysis") onAnalysisDone(s.intelData);
  }, [onIntelUpdate, onAnalysisDone]);

  /* ── RESET ── */
  const reset = useCallback(() => {
    setTab("input");
    setMsgs([]);
    setIntelData(null);
    setStatus("idle");
    setAiLoading(false);
    setTyping(false);
    setShowQuick(false);
    setChatDot(false);
    setIntelDot(false);
    setSessionId(uid());
    setAiHistory([]);
    setUserReply("");
  }, []);

  return {
    sessionId, msgs, typing, aiLoading, intelData,
    status, showQuick, chatDot, intelDot, userReply, setUserReply,
    tab, setTab, setChatDot, setIntelDot,
    chatRef, intelRef, inputRef,
    startFlow, sendReply, loadSession, reset,
  };
}
