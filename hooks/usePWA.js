"use client";
import { useState, useEffect, useRef } from "react";

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled]     = useState(false);
  const [isOnline, setIsOnline]           = useState(true);
  const [hasUpdate, setHasUpdate]         = useState(false);
  const [swRegistration, setSwReg]        = useState(null);
  const deferredPrompt = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) setIsInstalled(true);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(reg => {
        setSwReg(reg);
        setInterval(()=>reg.update(), 60000);
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          nw?.addEventListener("statechange", () => {
            if (nw.state==="installed" && navigator.serviceWorker.controller) setHasUpdate(true);
          });
        });
      });
    }
    const handleInstallPrompt = e => { e.preventDefault(); deferredPrompt.current=e; setIsInstallable(true); };
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", () => { setIsInstalled(true); setIsInstallable(false); deferredPrompt.current=null; });
    setIsOnline(navigator.onLine);
    const onOnline  = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt.current) return false;
    deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    deferredPrompt.current = null;
    setIsInstallable(false);
    return outcome === "accepted";
  };

  const applyUpdate = () => { swRegistration?.waiting?.postMessage({ type:"SKIP_WAITING" }); window.location.reload(); };

  return { isInstallable, isInstalled, isOnline, hasUpdate, promptInstall, applyUpdate };
}
