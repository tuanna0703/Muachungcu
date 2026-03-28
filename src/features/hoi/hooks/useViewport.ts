"use client";

import { useState, useEffect } from "react";

interface Viewport {
  vw:    number;
  isMob: boolean;
  isTbl: boolean;
  isDsk: boolean;
}

export function useViewport(): Viewport {
  const [vw, setVw] = useState(1200); // SSR-safe default (desktop)

  useEffect(() => {
    setVw(window.innerWidth);
    const fn = () => setVw(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  return {
    vw,
    isMob: vw < 768,
    isTbl: vw >= 768 && vw < 1100,
    isDsk: vw >= 1100,
  };
}
