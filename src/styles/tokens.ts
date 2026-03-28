/* ═══════════════════════════════════════════════════════════════════
   BRAND CONFIG
═══════════════════════════════════════════════════════════════════ */
export const BRAND = {
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
} as const;

/* ═══════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════ */
export const T = {
  // Brand
  red:       BRAND.color,
  redDark:   BRAND.colorDark,
  redSoft:   BRAND.colorSoft,
  redMid:    BRAND.colorMid,
  // Semantic
  green:     "#19C37D",
  greenSoft: "#E6FAF3",
  orange:    "#FF8A00",
  orangeSoft:"#FFF4E5",
  blue:      "#2B59FF",
  blueSoft:  "#EEF2FF",
  // Neutral
  border:    "#E8EAEF",
  surface:   "#FFFFFF",
  bg:        "#F6F7FB",
  text:      "#111827",
  muted:     "#8A93AD",
} as const;

/* ═══════════════════════════════════════════════════════════════════
   REUSABLE STYLE FACTORIES
═══════════════════════════════════════════════════════════════════ */
export const cardS: React.CSSProperties = {
  background:   T.surface,
  border:       `1px solid ${T.border}`,
  borderRadius: 14,
  padding:      "14px 15px",
  animation:    "mccFade .35s ease",
};

export const lblS: React.CSSProperties = {
  fontSize:      10.5,
  fontWeight:    800,
  letterSpacing: 0.8,
  textTransform: "uppercase",
  color:         T.muted,
  marginBottom:  10,
};

export const inputS = (extra?: React.CSSProperties): React.CSSProperties => ({
  width:       "100%",
  border:      `1.5px solid ${T.border}`,
  borderRadius: 12,
  padding:     "11px 13px",
  fontSize:    14,
  outline:     "none",
  fontFamily:  "'Open Sans',sans-serif",
  color:       T.text,
  background:  T.surface,
  transition:  "border-color .15s",
  ...extra,
});

export const btnRed = (extra?: React.CSSProperties): React.CSSProperties => ({
  display:         "flex",
  alignItems:      "center",
  justifyContent:  "center",
  gap:             8,
  padding:         "12px 16px",
  background:      T.red,
  color:           "#fff",
  borderRadius:    12,
  fontSize:        14,
  fontWeight:      700,
  border:          "none",
  cursor:          "pointer",
  fontFamily:      "'Open Sans',sans-serif",
  width:           "100%",
  ...extra,
});

/* ═══════════════════════════════════════════════════════════════════
   FIELD LABELS
═══════════════════════════════════════════════════════════════════ */
export const FIELD_LABELS: Record<string, string> = {
  project:          "Dự án",
  type:             "Loại",
  area:             "Diện tích",
  price:            "Giá rao",
  price_per_sqm:    "Giá/m²",
  province:         "Tỉnh/TP",
  district:         "Quận/Huyện",
  transaction_type: "Giao dịch",
  handover_status:  "Tình trạng",
  tower:            "Tòa",
  floor:            "Tầng",
  orientation:      "Hướng",
  view:             "View",
  legal_status:     "Pháp lý",
};

/* ═══════════════════════════════════════════════════════════════════
   RECOMMENDATION CONFIG
═══════════════════════════════════════════════════════════════════ */
export const REC_CONFIG = {
  buy_to_live:   { bg: "linear-gradient(135deg,#E6FAF3,#F0FFF8)", border: "#A7EDD0", pill: T.green,      label: "Phù hợp ở thực" },
  buy_to_invest: { bg: `linear-gradient(135deg,${BRAND.colorSoft},#FFF8F8)`,         border: BRAND.colorMid, pill: T.red, label: "Tiềm năng đầu tư" },
  avoid:         { bg: "linear-gradient(135deg,#FEF2F2,#FFF5F5)", border: "#FECACA", pill: "#EF4444",    label: "Nên tránh" },
  wait:          { bg: "linear-gradient(135deg,#FFF4E5,#FFFBF0)", border: "#FFCF80", pill: T.orange,     label: "Chờ thêm" },
} as const;

// Needed by style factory files that import React.CSSProperties
import type React from "react";
