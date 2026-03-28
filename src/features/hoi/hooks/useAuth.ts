"use client";

import { useState, useCallback } from "react";
import { loadAuth, saveAuth, clearAuth } from "@/lib/storage";
import type { AuthUser } from "@/types/auth";

export function useAuth() {
  const [auth, setAuth] = useState<AuthUser | null>(() => loadAuth());

  const login = useCallback((user: AuthUser) => {
    saveAuth(user);
    setAuth(user);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth(null);
  }, []);

  return { auth, login, logout };
}
