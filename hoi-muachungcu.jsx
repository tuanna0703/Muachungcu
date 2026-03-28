import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   BRAND CONFIG
═══════════════════════════════════════════════════════════════════ */
const BRAND = {
  domain:    "muachungcu.net",
  subdomain: "hoi.muachungcu.net",
  siteName:  "MuaChungCư",
  apiDomain: "api.muachungcu.net",
  tagline:   "Hỏi gì về dự án cũng có câu trả lời",
  shortTag:  "AI tra cứu dự án chung cư Việt Nam",
  logoText:  "hỏi",
  color:     "#E53935",
  colorDark: "#B71C1C",
  colorSoft: "#FFF5F5",
  colorMid:  "#FFCDD2",
};

/* ═══════════════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════════════ */
const nowTs   = () => new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"});
const nowIso  = () => new Date().toISOString();
const uid     = () => Math.random().toString(36).slice(2,10);
const fmtDate = iso => new Date(iso).toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});

/* ═══════════════════════════════════════════════════════════════════
   LOCAL STORAGE
═══════════════════════════════════════════════════════════════════ */
const LS = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k,v) => localStorage.setItem(k, JSON.stringify(v)),
  rm:  k => localStorage.removeItem(k),
};
const sessionKey    = email => email ? `mcc_user_${email}_sessions` : "mcc_guest_sessions";
const loadSessions  = email => LS.get(sessionKey(email)) || [];
const saveSession   = (email, s) => { const all = loadSessions(email); const i = all.findIndex(x=>x.id===s.id); if(i>=0) all[i]=s; else all.unshift(s); LS.set(sessionKey(email), all.slice(0,50)); };
const deleteSession = (email, id) => LS.set(sessionKey(email), loadSessions(email).filter(s=>s.id!==id));

/* OTP in-memory */
const OTP_STORE = {};
const generateOtp = email => { const c = String(Math.floor(100000+Math.random()*900000)); OTP_STORE[email]={c,exp:Date.now()+600000}; return c; };
const verifyOtp   = (email,code) => { const r=OTP_STORE[email]; return r && Date.now()<r.exp && r.c===code.trim(); };

/* ═══════════════════════════════════════════════════════════════════
   AI ENGINE
═══════════════════════════════════════════════════════════════════ */
const SYSTEM_PROMPT = `Bạn là chuyên gia phân tích bất động sản Việt Nam của nền tảng muachungcu.net.

NHIỆM VỤ: Phân tích tin rao hoặc câu hỏi về dự án chung cư và trả lời theo JSON NGHIÊM NGẶT.

QUY TRÌNH:
1. Đọc tin rao / câu hỏi → trích xuất thông tin cốt lõi
2. Nếu thiếu thông tin → hỏi tối đa 3 câu ngắn gọn
3. Khi đủ thông tin → phân tích đầy đủ

LUÔN trả về JSON (không có text ngoài JSON):
{
  "stage": "parse" | "clarify" | "analysis",
  "message": "Tin nhắn tiếng Việt tự nhiên",
  "profile": {
    "project": "", "type": "", "area": "", "price": "",
    "price_per_sqm": "", "province": "", "district": "",
    "transaction_type": "", "handover_status": "",
    "tower": "", "floor": "", "orientation": "", "view": "", "legal_status": ""
  },
  "missing_fields": [],
  "questions": [],
  "confidence": 0,
  "analysis": {
    "price_assessment": "overpriced|fair|underpriced",
    "price_label": "",
    "market_low": 0, "market_high": 0, "market_unit": "triệu/m²",
    "verdict_pill": "", "verdict_main": "", "verdict_detail": "",
    "risks": [], "opportunities": [],
    "recommendation": "buy_to_live|buy_to_invest|avoid|wait",
    "recommendation_reason": ""
  }
}`;

async function callAI(history) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: history,
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const raw  = data.content?.[0]?.text || "{}";
  return JSON.parse(raw.replace(/```json|```/g,"").trim());
}

/* ═══════════════════════════════════════════════════════════════════
   SHARE HELPERS
═══════════════════════════════════════════════════════════════════ */
function buildShareText(profile, analysis, short=false) {
  const sep = "─".repeat(30);
  const lines = [
    `🏠 PHÂN TÍCH DỰ ÁN — ${BRAND.subdomain}`, sep,
    ...Object.entries(profile||{}).filter(([,v])=>v).map(([k,v])=>`• ${FIELD_LABELS[k]||k}: ${v}`),
  ];
  if (analysis) {
    lines.push(`\n💰 ~${profile?.price_per_sqm||"N/A"} | TT: ${analysis.market_low}–${analysis.market_high} ${analysis.market_unit}`);
    lines.push(`✅ ${analysis.verdict_pill} — ${analysis.verdict_main}`);
    if (!short && analysis.risks?.length) lines.push(`\n⚠️ Rủi ro:\n${analysis.risks.map(r=>`  • ${r}`).join("\n")}`);
  }
  lines.push(`\n${sep}\n🔗 ${BRAND.subdomain} | AI tra cứu chung cư VN`);
  return lines.join("\n");
}

/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════ */
const T = {
  // Brand
  red:      BRAND.color,
  redDark:  BRAND.colorDark,
  redSoft:  BRAND.colorSoft,
  redMid:   BRAND.colorMid,
  // Semantic
  green:    "#19C37D", greenSoft:"#E6FAF3",
  orange:   "#FF8A00", orangeSoft:"#FFF4E5",
  blue:     "#2B59FF", blueSoft:"#EEF2FF",
  // Neutral
  border:   "#E8EAEF", surface:"#FFFFFF", bg:"#F6F7FB",
  text:     "#111827", muted:"#8A93AD",
};

/* ═══════════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════════ */
const cardS  = { background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"14px 15px", animation:"mccFade .35s ease" };
const lblS   = { fontSize:10.5, fontWeight:800, letterSpacing:.8, textTransform:"uppercase", color:T.muted, marginBottom:10 };
const inputS = extra => ({ width:"100%", border:`1.5px solid ${T.border}`, borderRadius:12, padding:"11px 13px", fontSize:14, outline:"none", fontFamily:"'Open Sans',sans-serif", color:T.text, background:T.surface, transition:"border-color .15s", ...extra });
const btnRed = extra => ({ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px 16px", background:T.red, color:"#fff", borderRadius:12, fontSize:14, fontWeight:700, border:"none", cursor:"pointer", fontFamily:"'Open Sans',sans-serif", width:"100%", ...extra });

/* ═══════════════════════════════════════════════════════════════════
   FIELD LABELS
═══════════════════════════════════════════════════════════════════ */
const FIELD_LABELS = {
  project:"Dự án", type:"Loại", area:"Diện tích", price:"Giá rao",
  price_per_sqm:"Giá/m²", province:"Tỉnh/TP", district:"Quận/Huyện",
  transaction_type:"Giao dịch", handover_status:"Tình trạng",
  tower:"Tòa", floor:"Tầng", orientation:"Hướng", view:"View", legal_status:"Pháp lý",
};

/* ═══════════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════════ */
const Ic = {
  Bolt:    ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Check:   ()=><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#19C37D" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  Plus:    ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Star:    ()=><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23 1.18-6.86L2 9.27l6.91-1.01L12 2z"/></svg>,
  Ok:      ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Link:    ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Img:     ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Doc:     ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Chat:    ()=><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Edit:    ()=><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Pulse:   ()=><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Reset:   ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>,
  Mail:    ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Lock:    ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  User:    ()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Logout:  ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  History: ()=><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Trash:   ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Close:   ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Shield:  ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Share:   ()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Copy:    ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Send:    ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Warn:    ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Home:    ()=><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Search:  ()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Sparkle: ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
};

/* ═══════════════════════════════════════════════════════════════════
   LOGO COMPONENT
═══════════════════════════════════════════════════════════════════ */
function Logo({ size = "md", showTag = false }) {
  const sizes = { sm: { mark:28, name:13, tag:9 }, md: { mark:32, name:15, tag:10 }, lg: { mark:42, name:20, tag:12 } };
  const s = sizes[size];
  return (
    <div style={{ display:"flex", alignItems:"center", gap: size==="lg"?12:9 }}>
      {/* Mark */}
      <div style={{ width:s.mark, height:s.mark, background:`linear-gradient(135deg,${T.red},${T.redDark})`, borderRadius: size==="lg"?12:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 2px 8px ${T.red}44` }}>
        <span style={{ fontFamily:"'Open Sans',sans-serif", fontSize:s.mark*0.34, fontWeight:800, color:"#fff", letterSpacing:-.5 }}>mcc</span>
      </div>
      {/* Text */}
      <div>
        <div style={{ fontSize:s.name, fontWeight:800, letterSpacing:-.5, lineHeight:1.1, color:T.text }}>
          <span>muachungcu</span>
          <span style={{ color:T.muted, fontWeight:400 }}>.net</span>
          {/* feature badge */}
          <span style={{ display:"inline-flex", alignItems:"center", marginLeft:6, padding:"1px 7px", background:T.red, color:"#fff", borderRadius:99, fontSize:s.name*0.68, fontWeight:800, verticalAlign:"middle", letterSpacing:0 }}>hỏi</span>
        </div>
        {showTag && <div style={{ fontSize:s.tag, color:T.muted, marginTop:2, fontWeight:400 }}>{BRAND.shortTag}</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TYPING INDICATOR
═══════════════════════════════════════════════════════════════════ */
function Typing() {
  return (
    <div style={{ display:"flex", gap:8 }}>
      <AiAvatar/>
      <div style={{ display:"flex", gap:4, padding:"12px 14px", background:T.redSoft, borderRadius:14, borderTopLeftRadius:3 }}>
        {[0,200,400].map((_,i)=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:T.red, animation:`mccBounce 1.3s ${i*200}ms infinite`, opacity:.45 }}/>)}
      </div>
    </div>
  );
}

function AiAvatar() {
  return (
    <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, marginTop:2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:"#fff", background:`linear-gradient(135deg,${T.red},${T.redDark})`, letterSpacing:-.3 }}>
      hỏi
    </div>
  );
}

function UserAvatar({ initials }) {
  return (
    <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, marginTop:2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", background:"linear-gradient(135deg,#444,#777)" }}>
      {initials||"U"}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CHAT BUBBLE
═══════════════════════════════════════════════════════════════════ */
function Bubble({ msg, initials }) {
  const me = msg.role === "user";
  return (
    <div style={{ display:"flex", gap:8, flexDirection:me?"row-reverse":"row", animation:"mccFade .3s ease" }}>
      {me ? <UserAvatar initials={initials}/> : <AiAvatar/>}
      <div style={{ maxWidth:"calc(100% - 42px)", display:"flex", flexDirection:"column", alignItems:me?"flex-end":"flex-start" }}>
        <div style={{ padding:"10px 13px", borderRadius:14, borderTopLeftRadius:me?14:3, borderTopRightRadius:me?3:14, background:me?"#EDEEF5":T.redSoft, fontSize:13, lineHeight:1.65, color:T.text }}>
          {msg.error
            ? <div style={{ display:"flex", alignItems:"center", gap:6, color:"#E53E3E", fontSize:12 }}><Ic.Warn/>{msg.text}</div>
            : <div style={{ whiteSpace:"pre-wrap" }}>{msg.text}</div>
          }
          {/* Profile snapshot */}
          {msg.profile && Object.values(msg.profile).some(v=>v) && (
            <div style={{ background:"#fff", border:`1px solid ${T.redMid}`, borderRadius:10, padding:"8px 10px", marginTop:8, fontSize:12 }}>
              {Object.entries(msg.profile).filter(([,v])=>v).map(([k,v])=>(
                <div key={k} style={{ display:"flex", gap:8, padding:"2.5px 0" }}>
                  <span style={{ color:T.muted, minWidth:100, fontSize:11.5 }}>{FIELD_LABELS[k]||k}</span>
                  <span style={{ fontWeight:700 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {/* Clarify questions */}
          {msg.questions?.length>0 && (
            <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:5 }}>
              {msg.questions.map((q,i)=>(
                <div key={i} style={{ display:"flex", gap:7, fontSize:12.5, alignItems:"flex-start" }}>
                  <div style={{ width:18, height:18, background:T.red, color:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, flexShrink:0, marginTop:1 }}>{i+1}</div>
                  <div>{q}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ fontSize:10, color:T.muted, marginTop:4, padding:"0 3px" }}>{msg.time}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INTEL CARDS
═══════════════════════════════════════════════════════════════════ */
function ConfCard({ val }) {
  const [w, setW] = useState(0);
  useEffect(()=>{ const t=setTimeout(()=>setW(val),150); return()=>clearTimeout(t); },[val]);
  const col = val>=70?T.green:val>=40?T.orange:"#EF4444";
  return (
    <div style={cardS}>
      <div style={lblS}>ĐỘ XÁC ĐỊNH</div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:6 }}>
        <div style={{ fontSize:50, fontWeight:800, color:col, letterSpacing:-2, lineHeight:1 }}>{val}%</div>
        <div style={{ fontSize:13, color:T.muted, paddingBottom:5, fontWeight:500 }}>tin cậy</div>
      </div>
      <div style={{ marginTop:12, height:8, borderRadius:99, background:T.bg, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${col},${col}88)`, width:`${w}%`, transition:"width 1.3s cubic-bezier(.4,0,.2,1)" }}/>
      </div>
    </div>
  );
}

function ProfileCard({ profile }) {
  const filled = Object.entries(profile||{}).filter(([,v])=>v);
  if (!filled.length) return null;
  return (
    <div style={cardS}>
      <div style={lblS}>THÔNG TIN DỰ ÁN</div>
      {filled.map(([k,v],i,a)=>(
        <div key={k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6.5px 0", borderBottom:i<a.length-1?`1px solid #F2F3F8`:"none" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:12.5, color:T.muted, fontWeight:500 }}>
            <div style={{ width:17, height:17, background:T.greenSoft, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Ic.Check/></div>
            {FIELD_LABELS[k]||k}
          </div>
          <div style={{ fontSize:13, fontWeight:700, textAlign:"right", maxWidth:"55%" }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function MissingCard({ missing }) {
  if (!missing?.length) return null;
  return (
    <div style={{ ...cardS, borderColor:"#FFCF80" }}>
      <div style={{ ...lblS, color:T.orange }}>⚠ THÔNG TIN CÒN THIẾU</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {missing.map(m=>(
          <div key={m} style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 11px", background:T.orangeSoft, border:"1px solid #FFCF80", borderRadius:99, fontSize:12, fontWeight:600, color:T.orange }}>
            <Ic.Plus/>{m}
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceCard({ analysis, profile }) {
  if (!analysis) return null;
  const ppm  = parseFloat(profile?.price_per_sqm)||0;
  const low  = analysis.market_low||0;
  const high = analysis.market_high||0;
  const pct  = high>low ? Math.min(Math.max((ppm-low)/(high-low)*100,0),100) : 50;
  const col  = analysis.price_assessment==="fair"?T.green:analysis.price_assessment==="overpriced"?"#EF4444":T.orange;
  return (
    <div style={cardS}>
      <div style={lblS}>PHÂN TÍCH GIÁ</div>
      {ppm>0 && (
        <div style={{ display:"flex", alignItems:"flex-end", gap:5, marginBottom:10 }}>
          <div style={{ fontSize:34, fontWeight:800, letterSpacing:-1.5, lineHeight:1 }}>{ppm.toFixed(0)}</div>
          <div style={{ fontSize:13, color:T.muted, paddingBottom:4 }}>triệu/m²</div>
        </div>
      )}
      {low>0&&high>0 && (
        <div style={{ background:T.bg, borderRadius:10, padding:"10px 12px", marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.muted, marginBottom:8 }}>Khoảng TT: {low}–{high} {analysis.market_unit}</div>
          <div style={{ position:"relative", height:6, background:T.border, borderRadius:99, marginBottom:6 }}>
            <div style={{ position:"absolute", left:"5%", width:"90%", height:"100%", background:`linear-gradient(90deg,#E8EAEF,${T.red}44)`, borderRadius:99 }}/>
            {ppm>0 && <div style={{ position:"absolute", left:`${5+pct*.9}%`, top:-3, width:12, height:12, background:col, border:"2.5px solid #fff", borderRadius:"50%", boxShadow:`0 2px 6px ${col}66`, transition:"left 1s ease" }}/>}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10.5, color:T.muted }}><span>{low}</span><span>{high}</span></div>
        </div>
      )}
      <div style={{ padding:"8px 10px", background:`${col}18`, borderRadius:9, fontSize:12.5, fontWeight:700, color:col, display:"flex", alignItems:"center", gap:6 }}>
        <Ic.Ok/>{analysis.price_label}
      </div>
    </div>
  );
}

function RiskCard({ analysis }) {
  if (!analysis?.risks?.length) return null;
  return (
    <div style={{ ...cardS, borderColor:"#FFCF80" }}>
      <div style={{ ...lblS, color:T.orange }}>RỦI RO CẦN LƯU Ý</div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {analysis.risks.map(r=>(
          <div key={r} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"8px 11px", background:T.orangeSoft, border:"1px solid #FFCF80", borderRadius:9, fontSize:12.5, color:"#B86000", fontWeight:500 }}>
            <div style={{ width:6, height:6, background:T.orange, borderRadius:"50%", flexShrink:0, marginTop:4 }}/>
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}

function OppCard({ analysis }) {
  if (!analysis?.opportunities?.length) return null;
  return (
    <div style={{ ...cardS, borderColor:"#A7EDD0" }}>
      <div style={{ ...lblS, color:"#0E9960" }}>💡 CƠ HỘI</div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {analysis.opportunities.map(o=>(
          <div key={o} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"8px 11px", background:T.greenSoft, border:"1px solid #A7EDD0", borderRadius:9, fontSize:12.5, color:"#0E9960", fontWeight:500 }}>
            <div style={{ width:6, height:6, background:T.green, borderRadius:"50%", flexShrink:0, marginTop:4 }}/>
            {o}
          </div>
        ))}
      </div>
    </div>
  );
}

const REC = {
  buy_to_live:   { bg:"linear-gradient(135deg,#E6FAF3,#F0FFF8)", border:"#A7EDD0", pill:T.green,  label:"Phù hợp ở thực" },
  buy_to_invest: { bg:`linear-gradient(135deg,${BRAND.colorSoft},#FFF8F8)`,  border:BRAND.colorMid, pill:T.red,   label:"Tiềm năng đầu tư" },
  avoid:         { bg:"linear-gradient(135deg,#FEF2F2,#FFF5F5)", border:"#FECACA", pill:"#EF4444",label:"Nên tránh" },
  wait:          { bg:"linear-gradient(135deg,#FFF4E5,#FFFBF0)", border:"#FFCF80", pill:T.orange, label:"Chờ thêm" },
};

function RecCard({ analysis, onShare }) {
  if (!analysis) return null;
  const cfg = REC[analysis.recommendation]||REC.wait;
  return (
    <div style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:14, padding:"14px 15px", animation:"mccFade .4s ease" }}>
      <div style={{ ...lblS, color:"#0E9960" }}>KHUYẾN NGHỊ</div>
      <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 14px", background:cfg.pill, color:"#fff", borderRadius:99, fontSize:12, fontWeight:800, marginBottom:10 }}>
        <Ic.Star/>{analysis.verdict_pill||cfg.label}
      </div>
      <div style={{ fontSize:14, fontWeight:800, lineHeight:1.45, marginBottom:6 }}>{analysis.verdict_main}</div>
      <div style={{ fontSize:12.5, color:"#555", lineHeight:1.65, marginBottom:12 }}>{analysis.recommendation_reason}</div>
      <button onClick={onShare} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"11px", background:`linear-gradient(135deg,${T.redDark},${T.red})`, color:"#fff", borderRadius:11, fontSize:13, fontWeight:800, border:"none", cursor:"pointer", fontFamily:"'Open Sans',sans-serif", boxShadow:`0 4px 16px ${T.red}44`, letterSpacing:-.2 }}>
        <Ic.Share/>Chia sẻ phân tích này
      </button>
    </div>
  );
}

function IntelContent({ intelData, onShare }) {
  const { profile, missing_fields, confidence, analysis, stage } = intelData||{};
  if (!stage) return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, textAlign:"center", padding:"48px 24px" }}>
      <div style={{ width:64, height:64, background:T.redSoft, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Ic.Home/>
      </div>
      <div>
        <div style={{ fontSize:15, fontWeight:800, color:"#C5CCDE", marginBottom:6 }}>Chưa có dữ liệu</div>
        <div style={{ fontSize:12, color:T.muted, lineHeight:1.65 }}>Dán tin rao hoặc đặt câu hỏi<br/>về dự án chung cư bất kỳ.</div>
      </div>
    </div>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {confidence!=null && <ConfCard val={confidence}/>}
      <ProfileCard profile={profile}/>
      {stage!=="analysis" && <MissingCard missing={missing_fields}/>}
      {stage==="analysis" && analysis && <>
        <PriceCard analysis={analysis} profile={profile}/>
        <OppCard analysis={analysis}/>
        <RiskCard analysis={analysis}/>
        <RecCard analysis={analysis} onShare={onShare}/>
      </>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARE CARD (visual preview)
═══════════════════════════════════════════════════════════════════ */
function ShareCard({ profile, analysis }) {
  return (
    <div style={{ background:`linear-gradient(135deg,${T.redDark} 0%,${T.red} 60%,#FF6B6B 100%)`, borderRadius:16, padding:"20px 20px 16px", color:"#fff", fontFamily:"'Open Sans',sans-serif", width:"100%", maxWidth:340, boxShadow:`0 8px 32px ${T.red}55` }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <div style={{ width:30, height:30, background:"rgba(255,255,255,.18)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>hỏi</div>
        <div>
          <div style={{ fontSize:12, fontWeight:800, letterSpacing:-.3 }}>hỏi.<span style={{ opacity:.7 }}>muachungcu.net</span></div>
          <div style={{ fontSize:9, opacity:.55 }}>AI tra cứu dự án chung cư</div>
        </div>
        {analysis && <div style={{ marginLeft:"auto", background:"rgba(255,255,255,.2)", borderRadius:99, padding:"3px 10px", fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>{analysis.verdict_pill}</div>}
      </div>
      <div style={{ fontSize:16, fontWeight:800, letterSpacing:-.3, marginBottom:3, lineHeight:1.25 }}>{profile?.project||"Phân tích dự án"}</div>
      <div style={{ fontSize:11, opacity:.6, marginBottom:14 }}>{[profile?.type,profile?.area,profile?.province].filter(Boolean).join(" • ")}</div>
      {profile && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:14 }}>
          {[["Giá rao",profile.price],["Giá/m²",profile.price_per_sqm],["Giao dịch",profile.transaction_type],["Tình trạng",profile.handover_status]].filter(([,v])=>v).map(([l,v])=>(
            <div key={l} style={{ background:"rgba(255,255,255,.12)", borderRadius:9, padding:"7px 9px" }}>
              <div style={{ fontSize:12, fontWeight:800 }}>{v}</div>
              <div style={{ fontSize:9, opacity:.5, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      )}
      {analysis?.verdict_main && (
        <div style={{ background:"rgba(255,255,255,.15)", borderRadius:10, padding:"8px 12px", marginBottom:12, fontSize:12, fontWeight:700 }}>✅ {analysis.verdict_main}</div>
      )}
      {analysis?.risks?.length>0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:12 }}>
          {analysis.risks.slice(0,3).map(r=><span key={r} style={{ background:"rgba(0,0,0,.18)", borderRadius:99, padding:"3px 8px", fontSize:10, fontWeight:600 }}>⚠ {r}</span>)}
        </div>
      )}
      <div style={{ borderTop:"1px solid rgba(255,255,255,.15)", paddingTop:10, display:"flex", justifyContent:"space-between", fontSize:9, opacity:.45 }}>
        <span>{BRAND.subdomain} • {new Date().toLocaleDateString("vi-VN")}</span>
        <span>⚡ AI phân tích tức thì</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARE MODAL
═══════════════════════════════════════════════════════════════════ */
function ShareModal({ onClose, profile, analysis }) {
  const [copied, setCopied] = useState("");
  const [tab, setTab]       = useState("card");
  const url      = typeof window!=="undefined" ? window.location.href : `https://${BRAND.subdomain}`;
  const shortTxt = buildShareText(profile,analysis,true);
  const fullTxt  = buildShareText(profile,analysis,false);
  const enc = s => encodeURIComponent(s);

  async function copy(str, key) {
    try { await navigator.clipboard.writeText(str); } catch { const t=document.createElement("textarea");t.value=str;document.body.appendChild(t);t.select();document.execCommand("copy");document.body.removeChild(t); }
    setCopied(key); setTimeout(()=>setCopied(""),2200);
  }

  const CHANNELS = [
    { id:"fb",   label:"Facebook",   color:"#1877F2", bg:"#E8F0FE", icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, action:()=>window.open(`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(shortTxt)}`) },
    { id:"zalo", label:"Zalo",       color:"#0068FF", bg:"#E5F0FF", icon:<svg width="20" height="20" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#0068FF"/><text x="8" y="33" fontSize="20" fontWeight="900" fill="white" fontFamily="Arial">Z</text></svg>, action:()=>window.open(`https://zalo.me/share/entry/?url=${enc(url)}&text=${enc(shortTxt)}`) },
    { id:"tele", label:"Telegram",   color:"#26A5E4", bg:"#E5F5FD", icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="#26A5E4"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>, action:()=>window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc(shortTxt)}`) },
    { id:"twit", label:"X/Twitter",  color:"#000",    bg:"#F0F0F0", icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, action:()=>window.open(`https://twitter.com/intent/tweet?text=${enc(shortTxt)}`) },
    { id:"sms",  label:"SMS/iMsg",   color:"#34C759", bg:"#EDFAF0", icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, action:()=>window.open(`sms:?&body=${enc(shortTxt)}`) },
    { id:"copy", label:"Sao chép link", color:T.red, bg:T.redSoft, icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>, action:()=>copy(url,"link") },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(17,24,39,.55)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:2000, backdropFilter:"blur(4px)", animation:"mccFade .2s ease" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:520, maxHeight:"90vh", display:"flex", flexDirection:"column", boxShadow:"0 -8px 40px rgba(17,24,39,.18)", animation:"mccSlideUp .25s ease" }}>
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 0" }}>
          <div style={{ width:36, height:4, background:T.border, borderRadius:99 }}/>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 20px 10px" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800 }}>Chia sẻ phân tích</div>
            <div style={{ fontSize:11.5, color:T.muted, marginTop:1 }}>{profile?.project||"Phân tích dự án"}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, display:"flex", padding:4 }}><Ic.Close/></button>
        </div>
        <div style={{ display:"flex", margin:"0 20px 14px", background:T.bg, borderRadius:10, padding:3 }}>
          {[["card","🃏 Thẻ chia sẻ"],["text","📝 Văn bản"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ flex:1, padding:"7px", borderRadius:8, fontSize:13, fontWeight:700, border:"none", cursor:"pointer", fontFamily:"'Open Sans',sans-serif", background:tab===id?"#fff":"transparent", color:tab===id?T.text:T.muted, boxShadow:tab===id?"0 1px 6px rgba(0,0,0,.08)":"none" }}>{lbl}</button>
          ))}
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"0 20px 24px" }}>
          {tab==="card" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"flex", justifyContent:"center" }}><ShareCard profile={profile} analysis={analysis}/></div>
              <div style={{ display:"flex", gap:8, padding:"10px 12px", background:T.bg, borderRadius:12, alignItems:"center" }}>
                <div style={{ flex:1, fontSize:12, color:T.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"monospace" }}>{BRAND.subdomain}/share/…</div>
                <button onClick={()=>copy(url,"link")} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", background:copied==="link"?T.greenSoft:"#fff", border:`1px solid ${copied==="link"?"#A7EDD0":T.border}`, borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", color:copied==="link"?"#0E9960":T.red, fontFamily:"'Open Sans',sans-serif", flexShrink:0, transition:"all .2s" }}>
                  {copied==="link"?<>✓ Đã sao chép</>:<><Ic.Copy/>Sao chép link</>}
                </button>
              </div>
            </div>
          )}
          {tab==="text" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ background:T.bg, borderRadius:12, padding:"12px 14px", fontSize:12, lineHeight:1.7, color:T.text, fontFamily:"monospace", whiteSpace:"pre-wrap", maxHeight:200, overflowY:"auto", border:`1px solid ${T.border}` }}>{fullTxt}</div>
              <div style={{ display:"flex", gap:8 }}>
                {[["short","Sao chép ngắn",shortTxt],["full","Sao chép đầy đủ",fullTxt]].map(([k,lbl,str])=>(
                  <button key={k} onClick={()=>copy(str,k)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"10px", background:copied===k?T.greenSoft:k==="short"?T.redSoft:"#fff", border:`1px solid ${copied===k?"#A7EDD0":k==="short"?T.redMid:T.border}`, borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", color:copied===k?"#0E9960":k==="short"?T.red:T.text, fontFamily:"'Open Sans',sans-serif", transition:"all .2s" }}>
                    {copied===k?<>✓ Đã sao chép</>:<><Ic.Copy/>{lbl}</>}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:11, fontWeight:800, color:T.muted, letterSpacing:.6, textTransform:"uppercase", marginBottom:10 }}>Chia sẻ qua</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
              {CHANNELS.map(ch=>(
                <button key={ch.id} onClick={ch.action} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"12px 8px", background:ch.bg, border:`1px solid ${ch.color}22`, borderRadius:12, cursor:"pointer", fontFamily:"'Open Sans',sans-serif", transition:"all .15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 4px 12px ${ch.color}33`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                  {ch.icon}
                  <div style={{ fontSize:11, fontWeight:700, color:ch.color, textAlign:"center" }}>{copied==="link"&&ch.id==="copy"?"✓ Đã sao chép":ch.label}</div>
                </button>
              ))}
            </div>
          </div>
          {typeof navigator!=="undefined"&&navigator.share&&(
            <button onClick={async()=>{try{await navigator.share({title:`Phân tích BĐS – ${BRAND.subdomain}`,text:shortTxt,url});}catch{}}} style={{ width:"100%", marginTop:12, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px", background:"#111827", color:"#fff", borderRadius:12, fontSize:14, fontWeight:700, border:"none", cursor:"pointer", fontFamily:"'Open Sans',sans-serif" }}>
              <Ic.Share/>Chia sẻ qua ứng dụng khác…
            </button>
          )}
          <div style={{ marginTop:14, padding:"10px 12px", background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:10, fontSize:11, color:"#92400E", lineHeight:1.55, display:"flex", gap:6 }}>
            <span>⚠️</span><span>Phân tích AI chỉ mang tính tham khảo. Vui lòng xác minh trước khi giao dịch.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AUTH MODAL
═══════════════════════════════════════════════════════════════════ */
function AuthModal({ onSuccess, onClose }) {
  const [step,setStep]     = useState("email");
  const [email,setEmail]   = useState("");
  const [otp,setOtp]       = useState(["","","","","",""]);
  const [loading,setLoad]  = useState(false);
  const [err,setErr]       = useState("");
  const [code,setCode]     = useState("");
  const refs = useRef([]);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function send() {
    if (!valid) { setErr("Email không hợp lệ."); return; }
    setLoad(true); setErr("");
    await new Promise(r=>setTimeout(r,900));
    setCode(generateOtp(email)); setLoad(false); setStep("otp");
  }

  function keyOtp(e,i) {
    const v = e.target.value.replace(/\D/g,"").slice(-1);
    const n = [...otp]; n[i]=v; setOtp(n);
    if (v&&i<5) refs.current[i+1]?.focus();
    if (!v&&e.nativeEvent.inputType==="deleteContentBackward"&&i>0) refs.current[i-1]?.focus();
  }

  async function verify() {
    const c = otp.join("");
    if (c.length<6) { setErr("Nhập đủ 6 chữ số."); return; }
    setLoad(true); setErr("");
    await new Promise(r=>setTimeout(r,700));
    if (verifyOtp(email,c)) {
      const a = { email, loginAt:nowIso() };
      LS.set("mcc_auth", a); setStep("success");
      await new Promise(r=>setTimeout(r,900));
      onSuccess(a);
    } else { setErr("Mã không đúng hoặc đã hết hạn."); }
    setLoad(false);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(17,24,39,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, padding:16, backdropFilter:"blur(4px)" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff", borderRadius:20, padding:"28px 24px", width:"100%", maxWidth:380, position:"relative", animation:"mccFade .25s ease", boxShadow:"0 20px 60px rgba(17,24,39,.2)" }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", cursor:"pointer", color:T.muted, display:"flex" }}><Ic.Close/></button>
        <div style={{ marginBottom:20 }}><Logo size="md"/></div>

        {step==="email" && <>
          <div style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>Đăng nhập / Đăng ký</div>
          <div style={{ fontSize:13, color:T.muted, marginBottom:20, lineHeight:1.6 }}>Nhập email để nhận mã xác nhận. Tài khoản tự động tạo nếu chưa tồn tại.</div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:700, color:T.muted, display:"block", marginBottom:5 }}>ĐỊA CHỈ EMAIL</label>
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:T.muted }}><Ic.Mail/></div>
              <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} placeholder="ten@email.com" onKeyDown={e=>e.key==="Enter"&&send()} style={{ ...inputS({ paddingLeft:38 }) }} onFocus={e=>e.target.style.borderColor=T.red} onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
          </div>
          {err && <div style={{ fontSize:12, color:"#E53E3E", marginBottom:10 }}>{err}</div>}
          <button onClick={send} disabled={loading} style={{ ...btnRed(), opacity:loading?.7:1 }}>{loading?"Đang gửi…":<><Ic.Mail/>Gửi mã xác nhận</>}</button>
          <div style={{ marginTop:14, padding:"10px 12px", background:T.bg, borderRadius:10, display:"flex", gap:8, alignItems:"flex-start" }}>
            <div style={{ color:T.green, marginTop:1 }}><Ic.Shield/></div>
            <div style={{ fontSize:11.5, color:T.muted, lineHeight:1.55 }}>Không đăng nhập? Lịch sử vẫn lưu trên thiết bị này.</div>
          </div>
        </>}

        {step==="otp" && <>
          <div style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>Nhập mã xác nhận</div>
          <div style={{ fontSize:13, color:T.muted, marginBottom:10, lineHeight:1.6 }}>Mã 6 chữ số gửi tới <strong>{email}</strong></div>
          <div style={{ marginBottom:18, padding:"8px 12px", background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:9, fontSize:12, color:"#92400E", display:"flex", gap:6, alignItems:"center" }}>
            <span>🔐</span><span><strong>Demo:</strong> mã là <strong style={{ fontFamily:"monospace", letterSpacing:2 }}>{code}</strong></span>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:16 }}>
            {otp.map((v,i)=>(
              <input key={i} ref={el=>refs.current[i]=el} value={v} onChange={e=>keyOtp(e,i)} maxLength={1} inputMode="numeric"
                style={{ width:44, height:52, textAlign:"center", fontSize:22, fontWeight:800, border:`2px solid ${v?T.red:T.border}`, borderRadius:10, outline:"none", fontFamily:"'Open Sans',sans-serif", color:T.text, background:v?T.redSoft:"#fff", transition:"all .15s" }}/>
            ))}
          </div>
          {err && <div style={{ fontSize:12, color:"#E53E3E", marginBottom:10, textAlign:"center" }}>{err}</div>}
          <button onClick={verify} disabled={loading} style={{ ...btnRed(), opacity:loading?.7:1 }}>{loading?"Đang xác nhận…":<><Ic.Lock/>Xác nhận & Đăng nhập</>}</button>
          <button onClick={()=>{setStep("email");setOtp(["","","","","",""]);setErr("");}} style={{ width:"100%", marginTop:10, padding:"10px", background:"none", border:`1px solid ${T.border}`, borderRadius:10, fontSize:13, color:T.muted, cursor:"pointer", fontFamily:"'Open Sans',sans-serif" }}>← Đổi email</button>
        </>}

        {step==="success" && (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ width:56, height:56, background:T.greenSoft, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", fontSize:26 }}>✓</div>
            <div style={{ fontSize:18, fontWeight:800, marginBottom:6 }}>Đăng nhập thành công!</div>
            <div style={{ fontSize:13, color:T.muted }}>Đang tải lịch sử…</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HISTORY PANEL
═══════════════════════════════════════════════════════════════════ */
function HistoryPanel({ sessions, onLoad, onDelete, onShare, onClose, userEmail }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(17,24,39,.45)", zIndex:1500, display:"flex", justifyContent:"flex-end", backdropFilter:"blur(3px)", animation:"mccFade .2s ease" }}>
      <div style={{ width:"min(360px,100%)", background:"#fff", height:"100%", display:"flex", flexDirection:"column", boxShadow:"-8px 0 40px rgba(17,24,39,.15)" }}>
        <div style={{ padding:"18px 16px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:800 }}>Lịch sử tra cứu</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{userEmail?<span style={{ color:T.red }}>☁ {userEmail}</span>:"💾 Lưu trên thiết bị này"}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, display:"flex" }}><Ic.Close/></button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:12 }}>
          {sessions.length===0 ? (
            <div style={{ textAlign:"center", padding:"48px 16px", color:T.muted }}>
              <div style={{ fontSize:32, marginBottom:10 }}>📭</div>
              <div style={{ fontSize:13, fontWeight:600 }}>Chưa có lịch sử</div>
              <div style={{ fontSize:12, marginTop:4 }}>Các câu hỏi sẽ xuất hiện ở đây.</div>
            </div>
          ) : sessions.map(s=>(
            <div key={s.id} style={{ background:T.bg, borderRadius:12, padding:"12px 14px", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
                <div style={{ flex:1, cursor:"pointer" }} onClick={()=>onLoad(s)}>
                  <div style={{ fontSize:13, fontWeight:700, marginBottom:3, color:T.text, lineHeight:1.4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title||"Tra cứu dự án"}</div>
                  <div style={{ fontSize:11, color:T.muted }}>{fmtDate(s.createdAt)}</div>
                  {s.intelData?.analysis?.verdict_pill && (
                    <div style={{ marginTop:5, display:"inline-block", padding:"2px 8px", background:T.redSoft, border:`1px solid ${T.redMid}`, borderRadius:99, fontSize:10.5, fontWeight:700, color:T.red }}>{s.intelData.analysis.verdict_pill}</div>
                  )}
                </div>
                <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                  {s.intelData?.stage==="analysis" && (
                    <button onClick={e=>{e.stopPropagation();onShare(s);}} style={{ background:"none", border:`1px solid ${T.redMid}`, borderRadius:7, cursor:"pointer", color:T.red, padding:"4px 6px", display:"flex" }}><Ic.Share/></button>
                  )}
                  <button onClick={e=>{e.stopPropagation();onDelete(s.id);}} style={{ background:"none", border:"none", cursor:"pointer", color:"#ccc", padding:4, display:"flex" }}><Ic.Trash/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [auth,setAuth]             = useState(()=>LS.get("mcc_auth"));
  const [showAuth,setShowAuth]     = useState(false);
  const [showHistory,setShowHistory]= useState(false);
  const [showShare,setShowShare]   = useState(false);
  const [sessions,setSessions]     = useState([]);
  const [shareData,setShareData]   = useState(null);

  const [tab,setTab]         = useState("input");
  const [mode,setMode]       = useState("text");
  const [inputTxt,setInputTxt]= useState("");
  const [userReply,setUserReply]= useState("");

  const [sessionId,setSessionId]= useState(()=>uid());
  const [msgs,setMsgs]         = useState([]);
  const [typing,setTyping]     = useState(false);
  const [aiLoading,setAiLoad]  = useState(false);
  const [intelData,setIntelData]= useState({});
  const [aiHistory,setAiHistory]= useState([]);
  const [status,setStatus]     = useState("idle");
  const [showQuick,setShowQuick]= useState(false);
  const [chatDot,setChatDot]   = useState(false);
  const [intelDot,setIntelDot] = useState(false);

  const chatRef  = useRef(null);
  const intelRef = useRef(null);
  const inputRef = useRef(null);

  const [vw,setVw] = useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{ const fn=()=>setVw(window.innerWidth); window.addEventListener("resize",fn); return()=>window.removeEventListener("resize",fn); },[]);
  const isMob=vw<768, isTbl=vw>=768&&vw<1100, isDsk=vw>=1100;

  useEffect(()=>{ setSessions(loadSessions(auth?.email)); },[auth]);
  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[msgs,typing]);
  useEffect(()=>{ if(intelRef.current) intelRef.current.scrollTop=intelRef.current.scrollHeight; },[intelData]);

  useEffect(()=>{
    if (!msgs.length) return;
    const s = { id:sessionId, title:(inputTxt||"Tra cứu dự án").slice(0,60), createdAt:nowIso(), msgs, intelData, aiHistory };
    saveSession(auth?.email, s);
    setSessions(loadSessions(auth?.email));
  },[msgs,intelData]);

  /* ── AI CALL ── */
  const sendToAI = useCallback(async(history) => {
    setAiLoad(true); setTyping(true);
    try {
      const result = await callAI(history);
      setTyping(false);

      const updated = { stage:result.stage, profile:result.profile||{}, missing_fields:result.missing_fields||[], confidence:result.confidence||0, analysis:result.analysis||null };
      setIntelData(updated);
      if (isMob) setIntelDot(true);

      const aiMsg = { role:"ai", time:nowTs(), id:uid(), text:result.message, profile:result.stage==="parse"?result.profile:null, questions:result.stage==="clarify"?result.questions:null };
      setMsgs(p=>[...p,aiMsg]);

      if (result.stage==="analysis") {
        setStatus("ready"); setShowQuick(true);
        setShareData({ profile:result.profile, analysis:result.analysis });
      }

      const entry = { role:"assistant", content:JSON.stringify(result) };
      setAiHistory(p=>[...p,entry]);

    } catch(e) {
      setTyping(false);
      setMsgs(p=>[...p,{ role:"ai", time:nowTs(), id:uid(), text:`Lỗi kết nối: ${e.message}`, error:true }]);
    }
    setAiLoad(false);
  },[isMob]);

  async function startFlow() {
    if (!inputTxt.trim()||aiLoading) return;
    const nid=uid(); setSessionId(nid);
    setStatus("analyzing"); setMsgs([]); setIntelData({});
    setShowQuick(false); setChatDot(true); setAiHistory([]);
    if (isMob) setTab("chat");

    const userMsg = { role:"user", time:nowTs(), id:uid(), text:inputTxt };
    setMsgs([userMsg]);
    const history = [{ role:"user", content:`Tin rao/câu hỏi về BĐS:\n\n${inputTxt}` }];
    setAiHistory(history);
    await sendToAI(history);
  }

  async function sendReply() {
    const text=userReply.trim();
    if (!text||aiLoading) return;
    setUserReply("");
    setMsgs(p=>[...p,{ role:"user", time:nowTs(), id:uid(), text }]);
    const history=[...aiHistory,{ role:"user", content:text }];
    setAiHistory(history);
    await sendToAI(history);
  }

  function loadSession(s) {
    setSessionId(s.id); setMsgs(s.msgs||[]); setIntelData(s.intelData||{});
    setAiHistory(s.aiHistory||[]); setStatus(s.intelData?.stage==="analysis"?"ready":"idle");
    setShowQuick(s.intelData?.stage==="analysis");
    if (s.intelData?.stage==="analysis") setShareData({ profile:s.intelData.profile, analysis:s.intelData.analysis });
    setShowHistory(false); if(isMob) setTab("chat");
  }

  function openShare(s) {
    if (s?.intelData) setShareData({ profile:s.intelData.profile, analysis:s.intelData.analysis });
    setShowHistory(false); setShowShare(true);
  }

  function reset() {
    setTab("input"); setMsgs([]); setIntelData({}); setStatus("idle");
    setAiLoad(false); setTyping(false); setShowQuick(false);
    setChatDot(false); setIntelDot(false); setSessionId(uid()); setShareData(null); setAiHistory([]);
  }

  const userInitials = auth?.email?.[0]?.toUpperCase()||"G";

  /* ── STATUS BADGE ── */
  const StatusBadge = () => (
    <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:99, fontSize:11, fontWeight:600, background:status==="ready"?T.greenSoft:status==="analyzing"?"#FFF4E5":T.bg, color:status==="ready"?"#0E9960":status==="analyzing"?T.orange:T.muted }}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:"currentColor", animation:status==="analyzing"?"mccBlink 1.4s infinite":"none" }}/>
      {status==="ready"?"✓ Phân tích xong":status==="analyzing"?"Đang phân tích…":"Chờ câu hỏi"}
    </div>
  );

  /* ── MODE BAR ── */
  const ModeBar = () => (
    <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
      {[["text","Văn bản / Câu hỏi",Ic.Doc],["image","Ảnh chụp",Ic.Img]].map(([m,lbl,Icon])=>(
        <button key={m} onClick={()=>setMode(m)} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 13px", borderRadius:99, whiteSpace:"nowrap", cursor:"pointer", border:mode===m?`1.5px solid ${T.red}`:`1.5px solid ${T.border}`, background:mode===m?T.redSoft:"#fff", color:mode===m?T.red:T.muted, fontSize:12, fontWeight:600 }}>
          <Icon/>{lbl}
        </button>
      ))}
    </div>
  );

  /* ── INPUT ZONE ── */
  const InputZone = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <ModeBar/>
      {mode==="text" && (
        <textarea ref={inputRef} value={inputTxt} onChange={e=>setInputTxt(e.target.value)} rows={5}
          placeholder={"Đặt câu hỏi hoặc dán tin rao…\n\nVí dụ:\n• Vinhomes Smart City 2PN giá bao nhiêu?\n• Masterise Ocean Park 2 có đáng mua không?\n• [Dán tin rao bất kỳ]"}
          style={{ ...inputS({ lineHeight:1.65, resize:"none" }) }}
          onFocus={e=>e.target.style.borderColor=T.red} onBlur={e=>e.target.style.borderColor=T.border}/>
      )}
      {mode==="image" && (
        <div style={{ border:`1.5px dashed ${T.border}`, borderRadius:12, padding:"28px 16px", display:"flex", flexDirection:"column", alignItems:"center", gap:8, textAlign:"center", cursor:"pointer", color:T.muted }}>
          <Ic.Img/><div style={{ fontSize:13, fontWeight:500 }}>Nhấn để chọn ảnh chụp màn hình</div><div style={{ fontSize:11, color:"#C5CCDE" }}>PNG, JPG — tối đa 10MB</div>
        </div>
      )}
      <button onClick={startFlow} disabled={aiLoading||!inputTxt.trim()} style={{ ...btnRed({ opacity:aiLoading||!inputTxt.trim()?.5:1 }) }}>
        {aiLoading
          ? <><div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,.3)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"mccSpin 1s linear infinite" }}/>Đang phân tích…</>
          : <><Ic.Sparkle/>Hỏi AI ngay</>
        }
      </button>
      <div style={{ display:"flex", gap:6, alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:T.green }}/>
        <div style={{ fontSize:11, color:T.muted }}>Được hỗ trợ bởi Claude AI • {BRAND.siteName}</div>
      </div>
    </div>
  );

  /* ── CHAT AREA ── */
  function ChatArea() {
    return (
      <>
        <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:14, scrollBehavior:"smooth" }}>
          {msgs.length===0&&!typing && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, textAlign:"center", padding:"32px 12px", color:"#C5CCDE" }}>
              <Ic.Chat/><div style={{ fontSize:12, fontWeight:600, marginTop:4 }}>Nhập câu hỏi và nhấn Hỏi AI để bắt đầu.</div>
            </div>
          )}
          {msgs.map(m=><Bubble key={m.id} msg={m} initials={userInitials}/>)}
          {typing && <Typing/>}
        </div>
        {/* Reply input */}
        {msgs.length>0 && status!=="ready" && (
          <div style={{ padding:"10px 14px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8, flexShrink:0, background:"#fff" }}>
            <input value={userReply} onChange={e=>setUserReply(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendReply()}
              placeholder="Trả lời câu hỏi của AI…" disabled={aiLoading}
              style={{ ...inputS({ flex:1, padding:"9px 12px", fontSize:13, borderRadius:10 }) }}
              onFocus={e=>e.target.style.borderColor=T.red} onBlur={e=>e.target.style.borderColor=T.border}/>
            <button onClick={sendReply} disabled={aiLoading||!userReply.trim()} style={{ width:38, height:38, borderRadius:10, background:T.red, color:"#fff", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", opacity:aiLoading||!userReply.trim()?.5:1, flexShrink:0 }}>
              <Ic.Send/>
            </button>
          </div>
        )}
        {/* Quick actions */}
        {showQuick && (
          <div style={{ padding:"10px 14px", borderTop:`1px solid ${T.border}`, display:"flex", gap:7, flexWrap:"wrap", flexShrink:0, background:"#fff", alignItems:"center" }}>
            {["Phân tích rủi ro pháp lý","So sánh giá khu vực","Tiềm năng cho thuê"].map(c=>(
              <button key={c} onClick={()=>setUserReply(c)} style={{ padding:"7px 12px", borderRadius:99, border:`1.5px solid ${T.redMid}`, background:T.redSoft, color:T.red, fontSize:11.5, fontWeight:700, cursor:"pointer", fontFamily:"'Open Sans',sans-serif" }}>{c}</button>
            ))}
            <button onClick={()=>setShowShare(true)} style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5, padding:"7px 12px", background:T.greenSoft, border:`1px solid #A7EDD0`, borderRadius:99, color:"#0E9960", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Open Sans',sans-serif" }}>
              <Ic.Share/>Chia sẻ
            </button>
          </div>
        )}
      </>
    );
  }

  const IntelScroll = () => (
    <div ref={intelRef} style={{ flex:1, overflowY:"auto", padding:"14px 16px" }}>
      <IntelContent intelData={intelData} onShare={()=>setShowShare(true)}/>
    </div>
  );

  /* ── HEADER ── */
  const Header = () => (
    <header style={{ background:"#fff", borderBottom:`1px solid ${T.border}`, height:56, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", flexShrink:0, boxShadow:"0 2px 12px rgba(17,24,39,.05)" }}>
      <Logo size="md" showTag={!isMob}/>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {!isMob && <StatusBadge/>}
        {status==="ready" && (
          <button onClick={()=>setShowShare(true)} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", background:`linear-gradient(135deg,${T.green},#0DA86A)`, color:"#fff", border:"none", borderRadius:9, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Open Sans',sans-serif" }}>
            <Ic.Share/>{!isMob&&"Chia sẻ"}
          </button>
        )}
        <button onClick={()=>setShowHistory(true)} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 10px", borderRadius:9, border:`1px solid ${T.border}`, background:"#fff", cursor:"pointer", fontSize:12, fontWeight:600, color:T.muted, fontFamily:"'Open Sans',sans-serif" }}>
          <Ic.History/>{!isMob&&"Lịch sử"}
          {sessions.length>0 && <span style={{ background:T.red, color:"#fff", borderRadius:99, fontSize:10, fontWeight:800, padding:"1px 5px" }}>{sessions.length}</span>}
        </button>
        {auth ? (
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 10px", background:T.greenSoft, border:"1px solid #A7EDD0", borderRadius:99, fontSize:11.5, fontWeight:700, color:"#0E9960" }}>
              <div style={{ width:20, height:20, borderRadius:"50%", background:T.green, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800 }}>{userInitials}</div>
              {!isMob && <span style={{ maxWidth:100, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{auth.email.split("@")[0]}</span>}
            </div>
            <button onClick={()=>{LS.rm("mcc_auth");setAuth(null);setSessions(loadSessions(null));}} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 8px", border:`1px solid ${T.border}`, borderRadius:9, background:"#fff", cursor:"pointer", color:T.muted, fontSize:11, fontFamily:"'Open Sans',sans-serif" }}>
              <Ic.Logout/>{!isMob&&"Đăng xuất"}
            </button>
          </div>
        ) : (
          <button onClick={()=>setShowAuth(true)} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", background:T.red, color:"#fff", border:"none", borderRadius:9, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Open Sans',sans-serif" }}>
            <Ic.User/>{!isMob&&"Đăng nhập"}
          </button>
        )}
      </div>
    </header>
  );

  /* ── BOTTOM NAV (mobile) ── */
  const BottomNav = () => (
    <nav style={{ display:"flex", background:"#fff", borderTop:`1px solid ${T.border}`, height:56, flexShrink:0, boxShadow:"0 -4px 16px rgba(17,24,39,.06)" }}>
      {[
        { id:"input", label:"Hỏi AI",    Icon:Ic.Search },
        { id:"chat",  label:"Trò chuyện", Icon:Ic.Chat,   dot:chatDot },
        { id:"intel", label:"Hồ sơ",      Icon:Ic.Home,   dot:intelDot },
      ].map(({id,label,Icon,dot})=>(
        <button key={id} onClick={()=>{setTab(id);if(id==="chat")setChatDot(false);if(id==="intel")setIntelDot(false);}}
          style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, fontSize:10.5, fontWeight:600, border:"none", background:"none", cursor:"pointer", color:tab===id?T.red:T.muted, position:"relative", fontFamily:"'Open Sans',sans-serif" }}>
          <div style={{ position:"relative", display:"inline-flex" }}>
            <Icon/>
            {dot && <div style={{ position:"absolute", top:-1, right:-2, width:8, height:8, background:T.red, border:"1.5px solid #fff", borderRadius:"50%" }}/>}
          </div>
          {label}
          {tab===id && <div style={{ position:"absolute", bottom:0, width:24, height:2, background:T.red, borderRadius:"2px 2px 0 0" }}/>}
        </button>
      ))}
    </nav>
  );

  /* ── RENDER ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body,#root{height:100%;font-family:'Open Sans',sans-serif!important;background:#F6F7FB;}
        button,input,textarea{font-family:'Open Sans',sans-serif!important;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#E8EAEF;border-radius:99px;}
        @keyframes mccFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes mccBounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}
        @keyframes mccBlink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes mccSlideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes mccSpin{to{transform:rotate(360deg)}}
      `}</style>

      <div style={{ height:"100%", display:"flex", flexDirection:"column", fontFamily:"'Open Sans',sans-serif", background:T.bg }}>
        <Header/>

        {/* ══ MOBILE ══ */}
        {isMob && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
              {tab==="input" && (
                <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
                  <div style={{ flex:1, overflowY:"auto", padding:"14px 16px 0" }}>
                    <div style={{ marginBottom:4 }}><StatusBadge/></div>
                    <div style={{ fontSize:18, fontWeight:800, letterSpacing:-.5, margin:"10px 0 3px", lineHeight:1.2 }}>{BRAND.tagline}</div>
                    <div style={{ fontSize:12, color:T.muted, marginBottom:14 }}>Hỏi gì về chung cư — AI trả lời ngay</div>
                    <InputZone/>
                    <div style={{ height:16 }}/>
                  </div>
                </div>
              )}
              {tab==="chat" && <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}><ChatArea/></div>}
              {tab==="intel" && (
                <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
                  <div style={{ padding:"10px 16px 8px", flexShrink:0 }}>
                    <div style={{ display:"flex", background:T.bg, borderRadius:10, padding:3 }}>
                      {["Hồ sơ dự án","Phân tích","Lịch sử"].map((t,i)=>(
                        <div key={t} style={{ flex:1, padding:"6px 8px", borderRadius:8, fontSize:11.5, fontWeight:600, textAlign:"center", background:i===0?"#fff":"transparent", color:i===0?T.text:T.muted, boxShadow:i===0?"0 1px 6px rgba(0,0,0,.08)":"none" }}>{t}</div>
                      ))}
                    </div>
                  </div>
                  <IntelScroll/>
                </div>
              )}
            </div>
            <BottomNav/>
          </div>
        )}

        {/* ══ TABLET ══ */}
        {isTbl && (
          <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", padding:"16px 16px 0", gap:12, maxWidth:900, margin:"0 auto", width:"100%" }}>
            <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden", flexShrink:0, boxShadow:"0 2px 12px rgba(229,57,53,.06)" }}>
              <div style={{ padding:"14px 18px 10px", borderBottom:`1px solid ${T.border}`, background:"#FAFBFB" }}>
                <div style={{ fontSize:15, fontWeight:800, letterSpacing:-.3 }}>{BRAND.tagline}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Hỏi gì về dự án chung cư — AI trả lời tức thì</div>
              </div>
              <div style={{ padding:"14px 18px 16px", background:"#FAFBFB" }}><InputZone/></div>
            </div>
            <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, minHeight:0 }}>
              <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 2px 12px rgba(229,57,53,.06)" }}>
                <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
                  <div style={{ fontSize:13, fontWeight:800 }}>Trò chuyện AI</div>
                  <StatusBadge/>
                </div>
                <ChatArea/>
              </div>
              <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 2px 12px rgba(229,57,53,.06)" }}>
                <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, flexShrink:0 }}>
                  <div style={{ fontSize:13, fontWeight:800 }}>Hồ sơ dự án</div>
                </div>
                <IntelScroll/>
              </div>
            </div>
          </div>
        )}

        {/* ══ DESKTOP ══ */}
        {isDsk && (
          <div style={{ flex:1, overflow:"hidden", display:"flex", maxWidth:1380, width:"100%", margin:"0 auto", padding:"18px 20px 0", gap:14 }}>
            {/* Left */}
            <div style={{ width:460, flexShrink:0, background:"#fff", border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 2px 16px rgba(229,57,53,.06)" }}>
              <div style={{ padding:"16px 20px 14px", borderBottom:`1px solid ${T.border}`, flexShrink:0, background:"#FAFBFB" }}>
                <div style={{ fontSize:15, fontWeight:800, letterSpacing:-.4, lineHeight:1.2, marginBottom:2 }}>{BRAND.tagline}</div>
                <div style={{ fontSize:11.5, color:T.muted }}>Dán tin rao hoặc đặt câu hỏi về bất kỳ dự án chung cư nào</div>
              </div>
              <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, background:"#FAFBFB", flexShrink:0 }}>
                <InputZone/>
              </div>
              <ChatArea/>
            </div>
            {/* Right */}
            <div style={{ flex:1, background:"#fff", border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 2px 16px rgba(229,57,53,.06)" }}>
              <div style={{ padding:"16px 20px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, letterSpacing:-.3 }}>Hồ sơ dự án</div>
                  <div style={{ fontSize:11, color:T.muted, marginTop:1 }}>Được xây dựng tự động từ câu hỏi của bạn</div>
                </div>
                <div style={{ display:"flex", background:T.bg, borderRadius:10, padding:3 }}>
                  {["Hồ sơ dự án","Phân tích","Lịch sử"].map((t,i)=>(
                    <div key={t} style={{ padding:"5px 12px", borderRadius:8, fontSize:11.5, fontWeight:600, background:i===0?"#fff":"transparent", color:i===0?T.text:T.muted, boxShadow:i===0?"0 1px 4px rgba(0,0,0,.08)":"none", cursor:"pointer" }}>{t}</div>
                  ))}
                </div>
              </div>
              <IntelScroll/>
            </div>
          </div>
        )}

        {/* Footer */}
        {!isMob && (
          <footer style={{ textAlign:"center", padding:"9px", fontSize:11, color:T.muted, borderTop:`1px solid ${T.border}`, background:"#fff", flexShrink:0 }}>
            ⚠️ Phân tích AI chỉ mang tính tham khảo. © 2025 {BRAND.siteName} ({BRAND.domain}) — Tính năng hỏi AI
          </footer>
        )}
      </div>

      {/* FAB */}
      {status==="ready" && (
        <button onClick={reset} style={{ position:"fixed", bottom:isMob?68:20, right:isMob?14:28, background:"#111827", color:"#fff", padding:"10px 18px", borderRadius:99, fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:7, boxShadow:"0 4px 20px rgba(17,24,39,.22)", border:"none", cursor:"pointer", fontFamily:"'Open Sans',sans-serif", zIndex:900 }}>
          <Ic.Reset/>Hỏi câu khác
        </button>
      )}

      {/* Modals */}
      {showAuth    && <AuthModal onSuccess={a=>{setAuth(a);setShowAuth(false);setSessions(loadSessions(a.email));}} onClose={()=>setShowAuth(false)}/>}
      {showHistory && <HistoryPanel sessions={sessions} onLoad={loadSession} onDelete={id=>{deleteSession(auth?.email,id);setSessions(loadSessions(auth?.email));}} onShare={openShare} onClose={()=>setShowHistory(false)} userEmail={auth?.email}/>}
      {showShare   && <ShareModal onClose={()=>setShowShare(false)} profile={shareData?.profile} analysis={shareData?.analysis}/>}
    </>
  );
}
