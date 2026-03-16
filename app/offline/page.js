"use client";
export default function OfflinePage() {
  return (
    <div style={{ minHeight:"100vh", background:"#080f1a", color:"#f8fafc", fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, textAlign:"center" }}>
      <div style={{ fontSize:64, marginBottom:24 }}>📵</div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, marginBottom:12 }}>Bạn đang offline</h1>
      <p style={{ color:"rgba(255,255,255,0.45)", fontSize:15, maxWidth:320, lineHeight:1.7, marginBottom:32 }}>Kiểm tra kết nối mạng và thử lại.</p>
      <button onClick={()=>window.location.reload()} style={{ padding:"12px 28px", background:"linear-gradient(135deg,#facc15,#f97316)", border:"none", borderRadius:10, color:"#080f1a", fontSize:14, fontWeight:700, cursor:"pointer" }}>
        Thử lại
      </button>
    </div>
  );
}
