"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PROJECT_STORE = {
  "vh-001": {
    id: "vh-001", ten_du_an: "Vinhomes Ocean Park 3", chu_dau_tu: "Vinhomes",
    dia_chi: "Đường Vành Đai 4, Hưng Yên", tinh: "Hưng Yên", loai_hinh: "Đại đô thị",
    tien_ich: "Bể bơi nước mặn 16ha, trường học liên cấp, bệnh viện đa khoa, TTTM Vincom, công viên 5ha, sân golf 18 lỗ",
    trang_thai: "Đang mở bán", phap_ly: "Sổ hồng lâu dài", ban_giao: "Q4 2025", so_can: 8500,
    lat: 20.9373, lng: 105.9841,
    gia_ca: [
      { loai_can: "Studio",       dien_tich_tu: 28,  dien_tich_den: 35,  gia_tu: 1.2, gia_den: 1.8,  don_vi: "tỷ" },
      { loai_can: "1 Phòng ngủ", dien_tich_tu: 45,  dien_tich_den: 55,  gia_tu: 2.1, gia_den: 2.9,  don_vi: "tỷ" },
      { loai_can: "2 Phòng ngủ", dien_tich_tu: 68,  dien_tich_den: 88,  gia_tu: 3.2, gia_den: 4.8,  don_vi: "tỷ" },
      { loai_can: "3 Phòng ngủ", dien_tich_tu: 95,  dien_tich_den: 120, gia_tu: 5.5, gia_den: 7.2,  don_vi: "tỷ" },
      { loai_can: "Penthouse",   dien_tich_tu: 150, dien_tich_den: 200, gia_tu: 9.0, gia_den: 14.5, don_vi: "tỷ" },
    ],
    reviews: [
      { nguon: "Cafef",     noi_dung: "Vị trí chiến lược gần vành đai 4, tiện ích đẳng cấp.", rating: 4 },
      { nguon: "BDS.com",   noi_dung: "Pháp lý minh bạch, tiến độ đúng hạn.", rating: 4 },
      { nguon: "Facebook",  noi_dung: "View hồ đẹp, quản lý tốt. Giá thuê 8-10 triệu/tháng.", rating: 5 },
      { nguon: "VnExpress", noi_dung: "Rủi ro nguồn cung lớn trong khu vực.", rating: 3 },
    ],
  },
  "mi-002": {
    id: "mi-002", ten_du_an: "Masteri Waterfront", chu_dau_tu: "Masterise Homes",
    dia_chi: "Long Biên, Hà Nội", tinh: "Hà Nội", loai_hinh: "Căn hộ cao cấp",
    tien_ich: "Sky gym, rooftop infinity pool, concierge 24/7, smart home, view sông Hồng",
    trang_thai: "Sắp mở bán", phap_ly: "Sổ hồng lâu dài", ban_giao: "Q2 2026", so_can: 1200,
    lat: 21.0285, lng: 105.8542,
    gia_ca: [
      { loai_can: "1 Phòng ngủ", dien_tich_tu: 52,  dien_tich_den: 65,  gia_tu: 4.2, gia_den: 5.8,  don_vi: "tỷ" },
      { loai_can: "2 Phòng ngủ", dien_tich_tu: 75,  dien_tich_den: 95,  gia_tu: 6.5, gia_den: 9.0,  don_vi: "tỷ" },
      { loai_can: "3 Phòng ngủ", dien_tich_tu: 105, dien_tich_den: 150, gia_tu: 9.5, gia_den: 12.0, don_vi: "tỷ" },
    ],
    reviews: [
      { nguon: "Cafef",    noi_dung: "Masterise đảm bảo chất lượng hoàn thiện cao cấp.", rating: 5 },
      { nguon: "BDS.com",  noi_dung: "Giá khá cao so với mặt bằng chung khu Long Biên.", rating: 3 },
      { nguon: "Facebook", noi_dung: "View sông Hồng tuyệt vời, tiện ích 5 sao.", rating: 5 },
    ],
  },
  "ak-003": {
    id: "ak-003", ten_du_an: "Akari City", chu_dau_tu: "Nam Long Group",
    dia_chi: "Bình Tân, TP.HCM", tinh: "TP. Hồ Chí Minh", loai_hinh: "Căn hộ tầm trung",
    tien_ich: "Hồ bơi, công viên nội khu, khu thương mại, trường học nội khu",
    trang_thai: "Đang bàn giao", phap_ly: "Sổ hồng", ban_giao: "Q1 2025", so_can: 3600,
    lat: 10.7353, lng: 106.6131,
    gia_ca: [
      { loai_can: "1 Phòng ngủ", dien_tich_tu: 40, dien_tich_den: 55, gia_tu: 2.0, gia_den: 2.8, don_vi: "tỷ" },
      { loai_can: "2 Phòng ngủ", dien_tich_tu: 58, dien_tich_den: 75, gia_tu: 2.8, gia_den: 4.0, don_vi: "tỷ" },
      { loai_can: "3 Phòng ngủ", dien_tich_tu: 78, dien_tich_den: 90, gia_tu: 4.0, gia_den: 5.2, don_vi: "tỷ" },
    ],
    reviews: [
      { nguon: "Cafef",   noi_dung: "Giá hợp lý, phù hợp ở thực cho gia đình trẻ.", rating: 4 },
      { nguon: "BDS.com", noi_dung: "Tiến độ bàn giao đúng hạn, pháp lý rõ ràng.", rating: 5 },
    ],
  },
  "sw-004": {
    id: "sw-004", ten_du_an: "Sun Grand City Feria", chu_dau_tu: "Sun Group",
    dia_chi: "Hạ Long, Quảng Ninh", tinh: "Quảng Ninh", loai_hinh: "Shophouse & Căn hộ",
    tien_ich: "View vịnh Hạ Long, marina, casino, resort 5 sao nội khu, bãi biển riêng",
    trang_thai: "Đang mở bán", phap_ly: "Sổ hồng 50 năm", ban_giao: "Q3 2026", so_can: 2800,
    lat: 20.9101, lng: 107.1839,
    gia_ca: [
      { loai_can: "Căn hộ",    dien_tich_tu: 40,  dien_tich_den: 65,  gia_tu: 3.5,  gia_den: 6.0,  don_vi: "tỷ" },
      { loai_can: "Shophouse", dien_tich_tu: 80,  dien_tich_den: 150, gia_tu: 8.0,  gia_den: 18.0, don_vi: "tỷ" },
      { loai_can: "Villa",     dien_tich_tu: 200, dien_tich_den: 300, gia_tu: 15.0, gia_den: 25.0, don_vi: "tỷ" },
    ],
    reviews: [
      { nguon: "Cafef",    noi_dung: "Sun Group uy tín, sản phẩm nghỉ dưỡng chất lượng cao.", rating: 5 },
      { nguon: "BDS.com",  noi_dung: "Tiềm năng cho thuê du lịch rất tốt.", rating: 5 },
      { nguon: "Facebook", noi_dung: "Pháp lý 50 năm cần cân nhắc kỹ.", rating: 3 },
    ],
  },
};

async function fetchAI(project) {
  const prompt = `Chuyên gia BDS Việt Nam. Phân tích dự án, trả về JSON thuần không có markdown:
Dự án: ${project.ten_du_an} | ${project.chu_dau_tu} | ${project.tinh}
Loại: ${project.loai_hinh} | Giá: ${Math.min(...project.gia_ca.map(g=>g.gia_tu))}–${Math.max(...project.gia_ca.map(g=>g.gia_den))} tỷ
Reviews: ${project.reviews.map(r=>r.noi_dung).join(" | ")}

{"tom_tat":"2 câu mô tả","diem_manh":["a","b","c"],"rui_ro":["x","y"],"tiem_nang_diem":8,"thanh_khoan":"Cao","muc_gia":"Hợp lý","phu_hop_voi":["Ở thực","Đầu tư"],"khuyen_nghi":"Nên mua","ly_do":"1 câu","du_bao_gia":"1-2 câu","sentiment_diem":7.5,"sentiment_tom_tat":"1-2 câu","sentiment_canh_bao":null}`;

  const res = await fetch("/api/analyze", {  // ← đổi sang gọi API route nội bộ
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project }),
  });
  const data = await res.json();
  return data;
}

const C = { bg:"#080f1a", surface:"rgba(255,255,255,0.04)", border:"rgba(255,255,255,0.08)", text:"#f8fafc", muted:"rgba(255,255,255,0.45)", accent:"#facc15", green:"#4ade80", blue:"#60a5fa", red:"#f87171" };

function Tag({ children, variant="default", size="sm" }) {
  const map = { default:["rgba(255,255,255,0.08)","#cbd5e1"], green:["rgba(74,222,128,0.12)",C.green], yellow:["rgba(250,204,21,0.12)",C.accent], blue:["rgba(96,165,250,0.12)",C.blue], red:["rgba(248,113,113,0.12)",C.red] };
  const [bg, color] = map[variant]||map.default;
  return <span style={{ background:bg, color, padding:size==="sm"?"3px 10px":"6px 14px", borderRadius:20, fontSize:size==="sm"?11:13, fontFamily:"'DM Mono', monospace", fontWeight:500, display:"inline-block" }}>{children}</span>;
}

function ScoreBar({ value, color=C.green }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ flex:1, height:6, background:"rgba(255,255,255,0.08)", borderRadius:3, overflow:"hidden" }}>
        <div style={{ width:`${value*10}%`, height:"100%", background:color, borderRadius:3, transition:"width 1s ease" }} />
      </div>
      <span style={{ fontFamily:"'DM Mono', monospace", fontSize:13, color:C.text, minWidth:32 }}>{value}<span style={{ color:C.muted, fontSize:10 }}>/10</span></span>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
      <div style={{ padding:"14px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:8 }}>
        <span>{icon}</span>
        <span style={{ fontFamily:"'DM Mono', monospace", fontSize:10, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase" }}>{title}</span>
      </div>
      <div style={{ padding:"18px 22px" }}>{children}</div>
    </div>
  );
}

export default function ProjectDetail({ params }) {
  const router = useRouter();
  const id = params?.id;
  const [project, setProject] = useState(null);
  const [ai, setAi]           = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [notFound, setNotFound]   = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!id) return;
    const found = PROJECT_STORE[id];
    if (!found) { setNotFound(true); return; }
    setProject(found);
    fetchAI(found).then(setAi).catch(()=>setAi(null)).finally(()=>setAiLoading(false));
  }, [id]);

  if (notFound) return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <div style={{ fontSize:48 }}>🏚️</div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28 }}>Không tìm thấy dự án</h2>
      <button onClick={()=>router.push("/")} style={{ padding:"10px 24px", background:"linear-gradient(135deg,#facc15,#f97316)", border:"none", borderRadius:10, color:"#080f1a", fontWeight:700, cursor:"pointer", fontSize:14 }}>← Về trang chủ</button>
    </div>
  );

  if (!project) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", color:C.muted }}>
        <div style={{ fontSize:32, animation:"spin 1.5s linear infinite", display:"inline-block", marginBottom:12 }}>✦</div>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:13 }}>Đang tải...</p>
      </div>
    </div>
  );

  const giaMin = Math.min(...project.gia_ca.map(g=>g.gia_tu));
  const giaMax = Math.max(...project.gia_ca.map(g=>g.gia_den));
  const ratingAvg = (project.reviews.reduce((s,r)=>s+r.rating,0)/project.reviews.length).toFixed(1);
  const tabs = [{id:"overview",label:"Tổng quan"},{id:"pricing",label:"Bảng giá"},{id:"ai",label:"✦ AI Phân tích"},{id:"reviews",label:"Reviews"}];
  const statusV = {"Đang mở bán":"green","Sắp mở bán":"yellow","Đang bàn giao":"blue"}[project.trang_thai]||"default";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#080f1a} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:2px}
      `}</style>
      <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'DM Sans',sans-serif" }}>
        <header style={{ borderBottom:`1px solid ${C.border}`, padding:"0 24px", background:"rgba(8,15,26,0.96)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:100 }}>
          <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", height:60, gap:12 }}>
            <button onClick={()=>router.push("/")} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:0 }}>
              <div style={{ width:28, height:28, background:"linear-gradient(135deg,#facc15,#f97316)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:"#080f1a" }}>M</div>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:C.text }}>muachungcu<span style={{ color:C.accent }}>.net</span></span>
            </button>
            <span style={{ color:C.muted }}>›</span>
            <button onClick={()=>router.push("/")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:C.muted }}>Dự án</button>
            <span style={{ color:C.muted }}>›</span>
            <span style={{ fontSize:13, color:C.text, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:200 }}>{project.ten_du_an}</span>
          </div>
        </header>

        <div style={{ background:"linear-gradient(135deg,#0f2233 0%,#080f1a 100%)", borderBottom:`1px solid ${C.border}`, padding:"36px 24px 0", position:"relative", overflow:"hidden" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              <Tag variant={statusV}>{project.trang_thai}</Tag>
              <Tag>{project.loai_hinh}</Tag>
              <Tag variant="blue">{project.phap_ly}</Tag>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,5vw,46px)", fontWeight:900, lineHeight:1.15, letterSpacing:"-0.02em", marginBottom:8 }}>{project.ten_du_an}</h1>
            <p style={{ color:C.muted, fontSize:14, marginBottom:24 }}>📍 {project.dia_chi} · {project.chu_dau_tu} · {project.so_can.toLocaleString()} căn</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:24 }}>
              {[
                { label:"GIÁ TỪ",    value:`${giaMin} tỷ`, sub:`đến ${giaMax} tỷ`, accent:true },
                { label:"DIỆN TÍCH", value:`${Math.min(...project.gia_ca.map(g=>g.dien_tich_tu))}m²`, sub:`đến ${Math.max(...project.gia_ca.map(g=>g.dien_tich_den))}m²` },
                { label:"BÀN GIAO",  value:project.ban_giao },
                { label:"ĐÁNH GIÁ", value:`${ratingAvg}★`, sub:`${project.reviews.length} reviews` },
                ...(ai&&!aiLoading?[{label:"AI SCORE",value:`${ai.tiem_nang_diem}/10`,sub:"tiềm năng",accent:true}]:[]),
              ].map((s,i)=>(
                <div key={i} style={{ padding:"14px 16px", background:s.accent?"rgba(250,204,21,0.06)":"rgba(255,255,255,0.03)", border:`1px solid ${s.accent?"rgba(250,204,21,0.2)":C.border}`, borderRadius:10 }}>
                  <div style={{ fontSize:9, fontFamily:"'DM Mono',monospace", color:C.muted, marginBottom:5, letterSpacing:"0.06em" }}>{s.label}</div>
                  <div style={{ fontSize:20, fontWeight:700, fontFamily:"'Playfair Display',serif", color:s.accent?C.accent:C.text, lineHeight:1 }}>{s.value}</div>
                  {s.sub&&<div style={{ fontSize:11, color:C.muted, marginTop:3 }}>{s.sub}</div>}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", borderBottom:`1px solid ${C.border}` }}>
              {tabs.map(t=>(
                <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ padding:"11px 18px", background:"transparent", border:"none", borderBottom:activeTab===t.id?`2px solid ${C.accent}`:"2px solid transparent", color:activeTab===t.id?C.accent:C.muted, fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:activeTab===t.id?600:400, cursor:"pointer", whiteSpace:"nowrap" }}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>

        <main style={{ maxWidth:1100, margin:"0 auto", padding:"24px 24px 60px" }}>
          {activeTab==="overview"&&(
            <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, animation:"fadeUp 0.4s ease both" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <Section title="Thông tin dự án" icon="🏢">
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    {[["Chủ đầu tư",project.chu_dau_tu],["Loại hình",project.loai_hinh],["Vị trí",project.dia_chi],["Tỉnh/Thành",project.tinh],["Pháp lý",project.phap_ly],["Bàn giao",project.ban_giao],["Số căn",project.so_can.toLocaleString()],["Trạng thái",project.trang_thai]].map(([k,v])=>(
                      <div key={k}><div style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:C.muted, marginBottom:3, letterSpacing:"0.06em" }}>{k.toUpperCase()}</div><div style={{ fontSize:13, fontWeight:500 }}>{v}</div></div>
                    ))}
                  </div>
                </Section>
                <Section title="Tiện ích nội khu" icon="✨">
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {project.tien_ich.split(",").map((t,i)=><Tag key={i}>{t.trim()}</Tag>)}
                  </div>
                </Section>
                <Section title="Vị trí trên bản đồ" icon="📍">
                  <div style={{ width:"100%", height:260, borderRadius:10, overflow:"hidden", border:`1px solid ${C.border}` }}>
                    <iframe title="map" width="100%" height="100%" style={{ border:0, filter:"invert(0.9) hue-rotate(180deg) brightness(0.85) contrast(1.1)" }} loading="lazy" src={`https://maps.google.com/maps?q=${project.lat},${project.lng}&z=14&output=embed`} />
                  </div>
                </Section>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ background:"rgba(96,165,250,0.06)", border:"1px solid rgba(96,165,250,0.2)", borderRadius:14, padding:18 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <span>✦</span>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.blue, letterSpacing:"0.08em" }}>CLAUDE AI NHẬN XÉT</span>
                    {aiLoading&&<span style={{ marginLeft:"auto", fontSize:14, animation:"spin 1s linear infinite", display:"inline-block", color:C.blue }}>⟳</span>}
                  </div>
                  {aiLoading?(
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {[80,60,90,50].map((w,i)=><div key={i} style={{ height:12, width:`${w}%`, borderRadius:4, background:"linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite" }} />)}
                    </div>
                  ):ai?(
                    <>
                      <p style={{ fontSize:13, lineHeight:1.7, color:"rgba(255,255,255,0.7)", marginBottom:12 }}>{ai.tom_tat}</p>
                      <div style={{ marginBottom:12 }}>
                        <div style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:C.muted, marginBottom:6 }}>TIỀM NĂNG ĐẦU TƯ</div>
                        <ScoreBar value={ai.tiem_nang_diem} color={C.green} />
                      </div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        <Tag variant="yellow">{ai.muc_gia}</Tag>
                        <Tag variant={ai.khuyen_nghi==="Nên mua"?"green":"yellow"}>{ai.khuyen_nghi}</Tag>
                      </div>
                    </>
                  ):<p style={{ fontSize:13, color:C.muted }}>Không thể tải AI</p>}
                </div>
                <div style={{ background:"linear-gradient(135deg,rgba(250,204,21,0.08),rgba(249,115,22,0.06))", border:"1px solid rgba(250,204,21,0.2)", borderRadius:14, padding:18 }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, marginBottom:8 }}>Quan tâm dự án?</h3>
                  <p style={{ fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>Nhận thông tin và ưu đãi mới nhất</p>
                  <button style={{ width:"100%", padding:"11px", background:"linear-gradient(135deg,#facc15,#f97316)", border:"none", borderRadius:8, color:"#080f1a", fontSize:13, fontWeight:700, cursor:"pointer" }}>Đăng ký tư vấn →</button>
                </div>
              </div>
            </div>
          )}

          {activeTab==="pricing"&&(
            <div style={{ animation:"fadeUp 0.4s ease both" }}>
              <Section title="Bảng giá theo loại căn" icon="💰">
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr>{["Loại căn","Diện tích (m²)","Giá từ","Giá đến","Giá/m²"].map(h=><th key={h} style={{ padding:"10px 14px", textAlign:"left", fontFamily:"'DM Mono',monospace", fontSize:10, color:C.muted, letterSpacing:"0.06em", borderBottom:`1px solid ${C.border}` }}>{h.toUpperCase()}</th>)}</tr></thead>
                    <tbody>
                      {project.gia_ca.map((g,i)=>{
                        const giaMet=((g.gia_tu+g.gia_den)/2*1000/((g.dien_tich_tu+g.dien_tich_den)/2)).toFixed(0);
                        return <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{ padding:"13px 14px", fontWeight:600, fontSize:14 }}>{g.loai_can}</td>
                          <td style={{ padding:"13px 14px", fontFamily:"'DM Mono',monospace", fontSize:13 }}>{g.dien_tich_tu}–{g.dien_tich_den}</td>
                          <td style={{ padding:"13px 14px" }}><span style={{ color:C.green, fontWeight:600, fontFamily:"'DM Mono',monospace" }}>{g.gia_tu} {g.don_vi}</span></td>
                          <td style={{ padding:"13px 14px" }}><span style={{ color:C.accent, fontWeight:600, fontFamily:"'DM Mono',monospace" }}>{g.gia_den} {g.don_vi}</span></td>
                          <td style={{ padding:"13px 14px", fontFamily:"'DM Mono',monospace", fontSize:12, color:C.muted }}>~{parseInt(giaMet).toLocaleString()}đ/m²</td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                </div>
              </Section>
            </div>
          )}

          {activeTab==="ai"&&(
            <div style={{ animation:"fadeUp 0.4s ease both" }}>
              {aiLoading?(
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 20px", gap:14 }}>
                  <div style={{ fontSize:32, animation:"spin 2s linear infinite", display:"inline-block" }}>✦</div>
                  <p style={{ color:C.muted, fontFamily:"'DM Mono',monospace", fontSize:13 }}>Claude đang phân tích...</p>
                </div>
              ):ai?(
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                  <Section title="Điểm mạnh" icon="✅">
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {ai.diem_manh?.map((dm,i)=><div key={i} style={{ display:"flex", gap:10 }}><span style={{ color:C.green }}>↗</span><span style={{ fontSize:13, lineHeight:1.6, color:"rgba(255,255,255,0.8)" }}>{dm}</span></div>)}
                    </div>
                  </Section>
                  <Section title="Rủi ro" icon="⚠️">
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {ai.rui_ro?.map((rr,i)=><div key={i} style={{ display:"flex", gap:10 }}><span style={{ color:C.red }}>↘</span><span style={{ fontSize:13, lineHeight:1.6, color:"rgba(255,255,255,0.8)" }}>{rr}</span></div>)}
                    </div>
                  </Section>
                  <Section title="Chỉ số đánh giá" icon="📊" style={{ gridColumn:"1/-1" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                      <div>
                        {[["Tiềm năng đầu tư",ai.tiem_nang_diem,C.green],["Social Sentiment",ai.sentiment_diem,C.blue]].map(([l,v,c])=>(
                          <div key={l} style={{ marginBottom:16 }}><div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>{l}</div><ScoreBar value={v} color={c} /></div>
                        ))}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {[["Mức giá",ai.muc_gia,"yellow"],["Thanh khoản",ai.thanh_khoan,"green"],["Khuyến nghị",ai.khuyen_nghi,ai.khuyen_nghi==="Nên mua"?"green":"yellow"]].map(([k,v,variant])=>(
                          <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><span style={{ fontSize:13, color:C.muted }}>{k}</span><Tag variant={variant}>{v}</Tag></div>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginTop:16, padding:"12px 14px", background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:8 }}>
                      <span style={{ fontSize:12, color:C.green }}>💡 {ai.ly_do}</span>
                    </div>
                  </Section>
                </div>
              ):<p style={{ color:C.muted, textAlign:"center", padding:40 }}>Không thể tải phân tích AI</p>}
            </div>
          )}

          {activeTab==="reviews"&&(
            <div style={{ display:"flex", flexDirection:"column", gap:20, animation:"fadeUp 0.4s ease both" }}>
              {ai&&!aiLoading&&(
                <div style={{ padding:18, background:"rgba(96,165,250,0.06)", border:"1px solid rgba(96,165,250,0.2)", borderRadius:14, display:"flex", gap:20, alignItems:"center", flexWrap:"wrap" }}>
                  <div><div style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:C.muted, marginBottom:4 }}>SENTIMENT</div><div style={{ fontSize:30, fontWeight:700, fontFamily:"'Playfair Display',serif", color:C.blue }}>{ai.sentiment_diem}<span style={{ fontSize:13, color:C.muted }}>/10</span></div></div>
                  <div style={{ flex:1 }}><p style={{ fontSize:13, lineHeight:1.7, color:"rgba(255,255,255,0.75)" }}>{ai.sentiment_tom_tat}</p></div>
                </div>
              )}
              <Section title={`${project.reviews.length} đánh giá`} icon="💬">
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {project.reviews.map((r,i)=>(
                    <div key={i} style={{ padding:"14px", background:"rgba(255,255,255,0.03)", border:`1px solid ${C.border}`, borderRadius:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:C.blue }}>{r.nguon}</span>
                        <div>{[1,2,3,4,5].map(s=><span key={s} style={{ fontSize:11, color:s<=r.rating?C.accent:C.border }}>★</span>)}</div>
                      </div>
                      <p style={{ fontSize:13, lineHeight:1.7, color:"rgba(255,255,255,0.75)", margin:0 }}>{r.noi_dung}</p>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
