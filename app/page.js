"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MOCK_PROJECTS = [
  {
    id: "vh-001",
    ten_du_an: "Vinhomes Ocean Park 3",
    chu_dau_tu: "Vinhomes",
    dia_chi: "Hưng Yên",
    tinh: "Hưng Yên",
    loai_hinh: "Đại đô thị",
    tien_ich: "Bể bơi nước mặn, trường học, bệnh viện, TTTM, công viên 5ha",
    trang_thai: "Đang mở bán",
    gia_tu: 2.1, gia_den: 8.5, don_vi: "tỷ",
    dien_tich_tu: 45, dien_tich_den: 200,
    phap_ly: "Sổ hồng", ban_giao: "Q4 2025",
    hinh_anh_bg: "#1a3a4a",
  },
  {
    id: "mi-002",
    ten_du_an: "Masteri Waterfront",
    chu_dau_tu: "Masterise Homes",
    dia_chi: "Long Biên, Hà Nội",
    tinh: "Hà Nội",
    loai_hinh: "Căn hộ cao cấp",
    tien_ich: "Sky gym, rooftop pool, concierge 24/7, view sông Hồng",
    trang_thai: "Sắp mở bán",
    gia_tu: 4.2, gia_den: 12, don_vi: "tỷ",
    dien_tich_tu: 52, dien_tich_den: 150,
    phap_ly: "Sổ hồng lâu dài", ban_giao: "Q2 2026",
    hinh_anh_bg: "#2a1a3a",
  },
  {
    id: "ak-003",
    ten_du_an: "Akari City",
    chu_dau_tu: "Nam Long Group",
    dia_chi: "Bình Tân, TP.HCM",
    tinh: "TP. Hồ Chí Minh",
    loai_hinh: "Căn hộ tầm trung",
    tien_ich: "Hồ bơi, công viên nội khu, trường học, khu thương mại",
    trang_thai: "Đang bàn giao",
    gia_tu: 2.8, gia_den: 5.2, don_vi: "tỷ",
    dien_tich_tu: 58, dien_tich_den: 90,
    phap_ly: "Sổ hồng", ban_giao: "Q1 2025",
    hinh_anh_bg: "#1a3a2a",
  },
  {
    id: "sw-004",
    ten_du_an: "Sun Grand City Feria",
    chu_dau_tu: "Sun Group",
    dia_chi: "Hạ Long, Quảng Ninh",
    tinh: "Quảng Ninh",
    loai_hinh: "Shophouse & Căn hộ",
    tien_ich: "View vịnh Hạ Long, marina, casino, resort 5 sao nội khu",
    trang_thai: "Đang mở bán",
    gia_tu: 3.5, gia_den: 25, don_vi: "tỷ",
    dien_tich_tu: 40, dien_tich_den: 300,
    phap_ly: "Sổ hồng 50 năm", ban_giao: "Q3 2026",
    hinh_anh_bg: "#2a2a1a",
  },
];

const TINH_LIST   = ["Tất cả", "Hà Nội", "TP. Hồ Chí Minh", "Hưng Yên", "Quảng Ninh"];
const LOAI_LIST   = ["Tất cả", "Căn hộ cao cấp", "Căn hộ tầm trung", "Đại đô thị", "Shophouse & Căn hộ"];
const STATUS_LIST = ["Tất cả", "Đang mở bán", "Sắp mở bán", "Đang bàn giao"];

const C = {
  bg: "#080f1a", surface: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)", text: "#f8fafc",
  muted: "rgba(255,255,255,0.45)", accent: "#facc15",
  green: "#4ade80", blue: "#60a5fa",
};

function Tag({ children, variant = "default" }) {
  const styles = {
    default: { bg: "rgba(255,255,255,0.1)",  color: "#e2e8f0" },
    green:   { bg: "rgba(74,222,128,0.15)",  color: C.green },
    yellow:  { bg: "rgba(250,204,21,0.15)",  color: C.accent },
    blue:    { bg: "rgba(96,165,250,0.15)",  color: C.blue },
  };
  const s = styles[variant] || styles.default;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
      {children}
    </span>
  );
}

function ProjectCard({ project, index, onClick }) {
  const statusVariant = { "Đang mở bán": "green", "Sắp mở bán": "yellow", "Đang bàn giao": "blue" }[project.trang_thai] || "default";
  return (
    <div
      onClick={onClick}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", animation: `fadeUp 0.5s ${index * 0.08}s ease both` }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ background: `linear-gradient(135deg, ${project.hinh_anh_bg}, #0f172a)`, padding: "20px 24px 16px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,0.015) 20px,rgba(255,255,255,0.015) 21px)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <Tag variant={statusVariant}>{project.trang_thai}</Tag>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>#{project.id}</span>
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px", lineHeight: 1.3 }}>{project.ten_du_an}</h3>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace" }}>{project.chu_dau_tu} · {project.dia_chi}</p>
        </div>
      </div>
      <div style={{ padding: "16px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 2, fontFamily: "'DM Mono', monospace" }}>GIÁ TỪ</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{project.gia_tu} <span style={{ fontSize: 13, color: C.accent }}>{project.don_vi}</span></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 2, fontFamily: "'DM Mono', monospace" }}>DIỆN TÍCH</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{project.dien_tich_tu}–{project.dien_tich_den} m²</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          <Tag>{project.loai_hinh}</Tag>
          <Tag variant="blue">{project.phap_ly}</Tag>
        </div>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{project.tien_ich}</p>
        <div style={{ width: "100%", padding: "10px", background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.2)", borderRadius: 8, color: C.accent, fontSize: 12, fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          Xem chi tiết →
        </div>
      </div>
    </div>
  );
}

export default function ListingPage() {
  const router = useRouter();
  const [projects] = useState(MOCK_PROJECTS);
  const [filtered, setFiltered] = useState(MOCK_PROJECTS);
  const [filterTinh, setFilterTinh]     = useState("Tất cả");
  const [filterLoai, setFilterLoai]     = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [search, setSearch]             = useState("");

  useEffect(() => {
    let result = projects;
    if (filterTinh   !== "Tất cả") result = result.filter(p => p.tinh === filterTinh);
    if (filterLoai   !== "Tất cả") result = result.filter(p => p.loai_hinh === filterLoai);
    if (filterStatus !== "Tất cả") result = result.filter(p => p.trang_thai === filterStatus);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.ten_du_an.toLowerCase().includes(q) || p.chu_dau_tu.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [filterTinh, filterLoai, filterStatus, search, projects]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#080f1a} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px}
        select { appearance: none; }
      `}</style>
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif" }}>
        <header style={{ borderBottom: `1px solid ${C.border}`, padding: "0 24px", background: "rgba(8,15,26,0.95)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#facc15,#f97316)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#080f1a" }}>M</div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>muachungcu<span style={{ color: C.accent }}>.net</span></span>
            </div>
            <nav style={{ display: "flex", gap: 24, fontSize: 13, color: C.muted }}>
              <span style={{ color: C.accent, fontWeight: 500 }}>Dự án</span>
            </nav>
            <div style={{ padding: "6px 14px", background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.25)", borderRadius: 20, fontSize: 11, color: C.accent, fontFamily: "'DM Mono', monospace" }}>✦ AI Powered</div>
          </div>
        </header>

        <div style={{ padding: "40px 24px 28px", background: "linear-gradient(180deg,rgba(250,204,21,0.04) 0%,transparent 100%)", borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: C.accent, letterSpacing: "0.1em", marginBottom: 8 }}>DỮ LIỆU TỪ GOOGLE SHEETS · PHÂN TÍCH BỞI CLAUDE AI</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 24 }}>
              Dự án <span style={{ color: C.accent }}>căn hộ & chung cư</span> Việt Nam
            </h1>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <input type="text" placeholder="Tìm kiếm dự án, chủ đầu tư..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "13px 20px 13px 46px", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" }}
                onFocus={e => e.target.style.borderColor = "rgba(250,204,21,0.4)"}
                onBlur={e => e.target.style.borderColor = C.border}
              />
              <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 18, opacity: 0.4 }}>⌕</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {[
                { value: filterTinh,   options: TINH_LIST,   setter: setFilterTinh },
                { value: filterLoai,   options: LOAI_LIST,   setter: setFilterLoai },
                { value: filterStatus, options: STATUS_LIST, setter: setFilterStatus },
              ].map((f, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <select value={f.value} onChange={e => f.setter(e.target.value)}
                    style={{ padding: "8px 34px 8px 14px", background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, borderRadius: 8, color: f.value !== "Tất cả" ? C.accent : "#e2e8f0", fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: "pointer", outline: "none" }}>
                    {f.options.map(o => <option key={o} value={o} style={{ background: "#0f172a" }}>{o}</option>)}
                  </select>
                  <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, opacity: 0.4, pointerEvents: "none" }}>▾</span>
                </div>
              ))}
              <span style={{ marginLeft: "auto", fontSize: 12, fontFamily: "'DM Mono', monospace", color: C.muted }}>{filtered.length} dự án</span>
            </div>
          </div>
        </div>

        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 60px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⌕</div>
              <p>Không tìm thấy dự án phù hợp</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i}
                  onClick={() => router.push(`/projects/${p.id}`)}
                />
              ))}
            </div>
          )}
        </main>

        <footer style={{ borderTop: `1px solid ${C.border}`, padding: "24px", textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>
          muachungcu.net · Dữ liệu từ Google Sheets · Phân tích bởi Claude AI
        </footer>
      </div>
    </>
  );
}
