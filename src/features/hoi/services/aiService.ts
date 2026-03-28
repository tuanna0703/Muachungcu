import type { AIResponse } from "@/types/ai";
import type { HistoryEntry } from "@/types/session";

/**
 * Gọi /api/ai (Next.js route handler, server-side proxy).
 * Không gọi Anthropic trực tiếp từ client — API key ở server.
 */
export async function callAI(history: HistoryEntry[]): Promise<AIResponse> {
  const res = await fetch("/api/ai", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ messages: history }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error((err as { error?: string }).error ?? `API ${res.status}`);
  }

  return res.json() as Promise<AIResponse>;
}
