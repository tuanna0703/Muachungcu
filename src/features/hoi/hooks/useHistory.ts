"use client";

import { useState, useCallback } from "react";
import { loadSessions, saveSession, deleteSession } from "@/lib/storage";
import type { Session } from "@/types/session";

export function useHistory(email: string | undefined) {
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions(email));

  const refresh = useCallback(() => {
    setSessions(loadSessions(email));
  }, [email]);

  const persist = useCallback((s: Session) => {
    saveSession(email, s);
    setSessions(loadSessions(email));
  }, [email]);

  const remove = useCallback((id: string) => {
    deleteSession(email, id);
    setSessions(loadSessions(email));
  }, [email]);

  return { sessions, refresh, persist, remove };
}
