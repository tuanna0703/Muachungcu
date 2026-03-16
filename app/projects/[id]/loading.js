export default function Loading() {
  return (
    <div style={{ minHeight:"100vh", background:"#080f1a" }}>
      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}.sk{background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:6px}`}</style>
      <div style={{ height:60, borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"0 24px", display:"flex", alignItems:"center", gap:12 }}>
        <div className="sk" style={{ width:28, height:28, borderRadius:6 }} />
        <div className="sk" style={{ width:120, height:20 }} />
      </div>
      <div style={{ padding:"36px 24px 24px", background:"linear-gradient(135deg,#0f2233,#080f1a)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="sk" style={{ width:"60%", height:48, marginBottom:10 }} />
          <div className="sk" style={{ width:"35%", height:16, marginBottom:28 }} />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
            {[1,2,3,4].map(i=><div key={i} className="sk" style={{ height:72, borderRadius:10 }} />)}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {[200,120,280].map((h,i)=><div key={i} className="sk" style={{ height:h, borderRadius:16 }} />)}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[180,140].map((h,i)=><div key={i} className="sk" style={{ height:h, borderRadius:14 }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
