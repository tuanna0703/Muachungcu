import type { Session } from "@/types/session";
import type { AuthUser } from "@/types/auth";

/* ═══════════════════════════════════════════════════════════════════
   SAFE LOCAL STORAGE WRAPPER
   - Tất cả đọc/ghi localStorage đi qua đây
   - Tránh SSR crash (window not defined)
═══════════════════════════════════════════════════════════════════ */
const LS = {
  get: <T>(k: string): T | null => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem(k) ?? "null") as T; } catch { return null; }
  },
  set: (k: string, v: unknown): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(k, JSON.stringify(v));
  },
  rm: (k: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(k);
  },
};

/* ═══════════════════════════════════════════════════════════════════
   AUTH PERSISTENCE
═══════════════════════════════════════════════════════════════════ */
const AUTH_KEY = "mcc_auth";

export const loadAuth  = (): AuthUser | null => LS.get<AuthUser>(AUTH_KEY);
export const saveAuth  = (a: AuthUser): void  => LS.set(AUTH_KEY, a);
export const clearAuth = (): void             => LS.rm(AUTH_KEY);

/* ═══════════════════════════════════════════════════════════════════
   SESSION PERSISTENCE
   - Guest:    mcc_guest_sessions
   - Logged in: mcc_user_{email}_sessions
   - Max 50 sessions per user
═══════════════════════════════════════════════════════════════════ */
const sessionKey = (email?: string): string =>
  email ? `mcc_user_${email}_sessions` : "mcc_guest_sessions";

export const loadSessions = (email?: string): Session[] =>
  LS.get<Session[]>(sessionKey(email)) ?? [];

export const saveSession = (email: string | undefined, s: Session): void => {
  const all = loadSessions(email);
  const i   = all.findIndex((x) => x.id === s.id);
  if (i >= 0) all[i] = s; else all.unshift(s);
  LS.set(sessionKey(email), all.slice(0, 50));
};

export const deleteSession = (email: string | undefined, id: string): void =>
  LS.set(sessionKey(email), loadSessions(email).filter((s) => s.id !== id));
