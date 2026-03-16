export const runtime = "edge";

export async function POST(request) {
  try {
    const { project } = await request.json();

    const prompt = `Chuyên gia BDS Việt Nam. Phân tích dự án, trả về JSON thuần không có markdown:
Dự án: ${project.ten_du_an} | ${project.chu_dau_tu} | ${project.tinh}
Loại: ${project.loai_hinh} | Giá: ${Math.min(...project.gia_ca.map(g=>g.gia_tu))}–${Math.max(...project.gia_ca.map(g=>g.gia_den))} tỷ
Reviews: ${project.reviews.map(r=>r.noi_dung).join(" | ")}

{"tom_tat":"2 câu mô tả","diem_manh":["a","b","c"],"rui_ro":["x","y"],"tiem_nang_diem":8,"thanh_khoan":"Cao","muc_gia":"Hợp lý","phu_hop_voi":["Ở thực","Đầu tư"],"khuyen_nghi":"Nên mua","ly_do":"1 câu","du_bao_gia":"1-2 câu","sentiment_diem":7.5,"sentiment_tom_tat":"1-2 câu","sentiment_canh_bao":null}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || "{}";
    return Response.json(JSON.parse(text.replace(/```json|```/g, "").trim()));

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}