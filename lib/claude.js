// lib/claude.js — Gọi Claude AI phân tích dự án
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type":"application/json", "x-api-key":ANTHROPIC_API_KEY, "anthropic-version":"2023-06-01" },
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1500, messages:[{ role:"user", content:prompt }] }),
  });
  const data = await res.json();
  const text = data.content?.[0]?.text || "{}";
  try { return JSON.parse(text.replace(/```json|```/g,"").trim()); } catch { return { raw: text }; }
}

export async function formatDuAn(project) {
  return callClaude(`Chuẩn hóa dữ liệu dự án BDS sau. Trả về JSON thuần:\n${JSON.stringify(project)}\n\n{"mo_ta_ngan":"","vi_tri_noi_bat":"","tien_ich_chinh":[],"loai_hinh_chuan":"","tags":[]}`);
}

export async function analyzeDuAn(project, giaCa=[], reviews=[]) {
  return callClaude(`Phân tích dự án BDS Việt Nam. Trả về JSON thuần:\nDự án: ${JSON.stringify(project)}\nGiá: ${JSON.stringify(giaCa)}\nReviews: ${JSON.stringify(reviews.slice(0,5))}\n\n{"diem_manh":[],"diem_yeu":"","danh_gia_tong":"","muc_gia":"","tiem_nang_diem":7,"tinh_thanh_khoan":"","phu_hop_voi":[],"khuyen_nghi":"","ly_do_khuyen_nghi":"","du_bao_gia":""}`);
}

export async function analyzeSentiment(reviews) {
  if (!reviews||reviews.length===0) return { diem_sentiment:5, tom_tat:"Chưa có đánh giá", cam_xuc:"Trung lập" };
  return callClaude(`Phân tích sentiment reviews BDS. Trả về JSON thuần:\n${reviews.map(r=>`- [${r.nguon}] ${r.noi_dung}`).join("\n")}\n\n{"diem_sentiment":7,"cam_xuc":"","tom_tat":"","chu_de_chinh":[],"canh_bao":null}`);
}
