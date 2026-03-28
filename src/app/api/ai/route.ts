import { NextRequest, NextResponse } from "next/server";

/* ═══════════════════════════════════════════════════════════════════
   SYSTEM PROMPT
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

/* ═══════════════════════════════════════════════════════════════════
   ROUTE HANDLER
   POST /api/ai
   Body: { messages: Array<{ role: "user"|"assistant", content: string }> }
═══════════════════════════════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key chưa được cấu hình." }, { status: 500 });
  }

  let body: { messages: Array<{ role: string; content: string }> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body không hợp lệ." }, { status: 400 });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages là bắt buộc." }, { status: 400 });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system:     SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      console.error("[/api/ai] Anthropic error:", err);
      return NextResponse.json({ error: `Lỗi từ AI: ${upstream.status}` }, { status: 502 });
    }

    const data = await upstream.json();
    const raw  = (data.content?.[0]?.text as string) ?? "{}";

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      return NextResponse.json({ error: "AI trả về định dạng không hợp lệ." }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (e) {
    console.error("[/api/ai]", e);
    return NextResponse.json({ error: "Lỗi kết nối tới AI." }, { status: 503 });
  }
}
