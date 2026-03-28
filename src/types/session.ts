import type { IntelData } from "./ai";

export type MessageRole = "user" | "ai";

export interface ChatMessage {
  id:        string;
  role:      MessageRole;
  text:      string;
  time:      string;
  error?:    boolean;
  /** Only present on parse-stage AI messages */
  profile?:  Record<string, string> | null;
  /** Only present on clarify-stage AI messages */
  questions?: string[] | null;
}

/** AI conversation history entry (Anthropic messages format) */
export interface HistoryEntry {
  role:    "user" | "assistant";
  content: string;
}

export interface Session {
  id:         string;
  title:      string;
  createdAt:  string;
  msgs:       ChatMessage[];
  intelData:  IntelData | null;
  aiHistory:  HistoryEntry[];
}
