"use client";

import { useState, useRef } from "react";
import { T, inputS, btnRed } from "@/styles/tokens";
import ModeBar from "./ModeBar";
import { Sparkle, Img } from "@/components/icons";

type InputMode = "text" | "image";

interface InputZoneProps {
  inputTxt:  string;
  onInput:   (v: string) => void;
  onSubmit:  () => void;
  aiLoading: boolean;
}

export default function InputZone({ inputTxt, onInput, onSubmit, aiLoading }: InputZoneProps) {
  const [mode, setMode] = useState<InputMode>("text");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <ModeBar mode={mode} onMode={setMode} />

      {mode === "text" && (
        <textarea
          ref={inputRef}
          value={inputTxt}
          onChange={(e) => onInput(e.target.value)}
          rows={3}
          placeholder={"Đặt câu hỏi hoặc dán tin rao…\n\nVí dụ:\n• Vinhomes Smart City 2PN giá bao nhiêu?\n• Masterise Ocean Park 2 có đáng mua không?\n• [Dán tin rao bất kỳ]"}
          style={{ ...inputS({ lineHeight: 1.65, resize: "none" }) }}
          onFocus={(e) => (e.target.style.borderColor = T.red)}
          onBlur={(e)  => (e.target.style.borderColor = T.border)}
        />
      )}

      {mode === "image" && (
        <div style={{
          border: `1.5px dashed ${T.border}`, borderRadius: 12,
          padding: "28px 16px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          textAlign: "center", cursor: "pointer", color: T.muted,
        }}>
          <Img />
          <div style={{ fontSize: 13, fontWeight: 500 }}>Nhấn để chọn ảnh chụp màn hình</div>
          <div style={{ fontSize: 11, color: "#C5CCDE" }}>PNG, JPG — tối đa 10MB</div>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={aiLoading || !inputTxt.trim()}
        style={{ ...btnRed({ opacity: aiLoading || !inputTxt.trim() ? 0.5 : 1 }) }}
      >
        {aiLoading ? (
          <>
            <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "mccSpin 1s linear infinite" }} />
            Đang phân tích…
          </>
        ) : (
          <><Sparkle />Hỏi AI ngay</>
        )}
      </button>

      <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
        <div style={{ fontSize: 11, color: T.muted }}>Được hỗ trợ bởi Claude AI • MuaChungCư</div>
      </div>
    </div>
  );
}
