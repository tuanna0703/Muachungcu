"use client";
import { useState, useEffect } from "react";
import { usePWA } from "@/hooks/usePWA";

export default function PWAProvider({ children }) {
  const { isInstallable, isOnline, hasUpdate, promptInstall, applyUpdate } = usePWA();
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isInstallable || dismissed) return;
    const t = setTimeout(() => setShowInstallBanner(true), 5000);
    return () => clearTimeout(t);
  }, [isInstallable, dismissed]);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    setShowInstallBanner(false);
    if (!accepted) setDismissed(true);
  };

  return (
    <>
      {children}
      {!isOnline && (
        <div style={{ position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)", background:"rgba(248,113,113,0.15)", border:"1px solid rgba(248,113,113,0.4)", backdropFilter:"blur(12px)", padding:"10px 20px", borderRadius:30, display:"flex", alignItems:"center", gap:8, zIndex:9999, whiteSpace:"nowrap" }}>
          <span>📵</span>
          <span style={{ fontSize:13, color:"#fca5a5", fontFamily:"'DM Mono',monospace" }}>Đang offline — hiển thị dữ liệu đã lưu</span>
        </div>
      )}
      {hasUpdate && (
        <div style={{ position:"fixed", top:0, left:0, right:0, background:"rgba(96,165,250,0.15)", borderBottom:"1px solid rgba(96,165,250,0.3)", backdropFilter:"blur(12px)", padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"center", gap:12, zIndex:9998 }}>
          <span style={{ fontSize:13, color:"#93c5fd" }}>✦ Có phiên bản mới!</span>
          <button onClick={applyUpdate} style={{ padding:"4px 16px", background:"rgba(96,165,250,0.3)", border:"1px solid rgba(96,165,250,0.5)", borderRadius:20, color:"#bfdbfe", fontSize:12, cursor:"pointer" }}>Cập nhật ngay</button>
        </div>
      )}
      {showInstallBanner && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(8,15,26,0.97)", borderTop:"1px solid rgba(250,204,21,0.2)", backdropFilter:"blur(20px)", padding:"16px 20px", display:"flex", alignItems:"center", gap:14, zIndex:9997 }}>
          <div style={{ width:48, height:48, borderRadius:12, flexShrink:0, background:"linear-gradient(135deg,#facc15,#f97316)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:900, color:"#080f1a" }}>M</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600, fontSize:14, marginBottom:2, color:"#f8fafc" }}>Cài MuaChungCu.net về máy</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>Xem dự án nhanh hơn, không cần mạng</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>{ setShowInstallBanner(false); setDismissed(true); }} style={{ padding:"8px 14px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"rgba(255,255,255,0.4)", fontSize:12, cursor:"pointer" }}>Để sau</button>
            <button onClick={handleInstall} style={{ padding:"8px 16px", background:"linear-gradient(135deg,#facc15,#f97316)", border:"none", borderRadius:8, color:"#080f1a", fontSize:12, fontWeight:700, cursor:"pointer" }}>Cài đặt</button>
          </div>
        </div>
      )}
    </>
  );
}
