"use client";

import { useState, useRef } from "react";
import { T, inputS, btnRed } from "@/styles/tokens";
import Logo from "@/components/ui/Logo";
import { Close, Mail, Lock, Shield } from "@/components/icons";
import { generateOtp, verifyOtp } from "@/lib/otp";
import { nowIso } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

interface AuthModalProps {
  onSuccess: (user: AuthUser) => void;
  onClose:   () => void;
}

type Step = "email" | "otp" | "success";

export default function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const [step, setStep]     = useState<Step>("email");
  const [email, setEmail]   = useState("");
  const [otp, setOtp]       = useState(["", "", "", "", "", ""]);
  const [loading, setLoad]  = useState(false);
  const [err, setErr]       = useState("");
  const [demoCode, setDemoCode] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function sendOtp() {
    if (!validEmail) { setErr("Email không hợp lệ."); return; }
    setLoad(true); setErr("");
    await new Promise((r) => setTimeout(r, 900));
    const code = generateOtp(email);
    setDemoCode(code);
    setLoad(false);
    setStep("otp");
  }

  function handleOtpKey(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const v = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpBackspace(e: React.KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }

  async function verify() {
    const c = otp.join("");
    if (c.length < 6) { setErr("Nhập đủ 6 chữ số."); return; }
    setLoad(true); setErr("");
    await new Promise((r) => setTimeout(r, 700));
    if (verifyOtp(email, c)) {
      const user: AuthUser = { email, loginAt: nowIso() };
      setStep("success");
      await new Promise((r) => setTimeout(r, 900));
      onSuccess(user);
    } else {
      setErr("Mã không đúng hoặc đã hết hạn.");
    }
    setLoad(false);
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 16, backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", width: "100%", maxWidth: 380, position: "relative", animation: "mccFade .25s ease", boxShadow: "0 20px 60px rgba(17,24,39,.2)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: T.muted, display: "flex" }}><Close /></button>
        <div style={{ marginBottom: 20 }}><Logo size="md" /></div>

        {/* Step: email */}
        {step === "email" && (
          <>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Đăng nhập / Đăng ký</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 20, lineHeight: 1.6 }}>Nhập email để nhận mã xác nhận. Tài khoản tự động tạo nếu chưa tồn tại.</div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, display: "block", marginBottom: 5 }}>ĐỊA CHỈ EMAIL</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.muted }}><Mail /></div>
                <input
                  type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  placeholder="ten@email.com"
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                  style={{ ...inputS({ paddingLeft: 38 }) }}
                  onFocus={(e) => (e.target.style.borderColor = T.red)}
                  onBlur={(e)  => (e.target.style.borderColor = T.border)}
                />
              </div>
            </div>
            {err && <div style={{ fontSize: 12, color: "#E53E3E", marginBottom: 10 }}>{err}</div>}
            <button onClick={sendOtp} disabled={loading} style={{ ...btnRed({ opacity: loading ? 0.7 : 1 }) }}>
              {loading ? "Đang gửi…" : <><Mail />Gửi mã xác nhận</>}
            </button>
            <div style={{ marginTop: 14, padding: "10px 12px", background: T.bg, borderRadius: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ color: T.green, marginTop: 1 }}><Shield /></div>
              <div style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.55 }}>Không đăng nhập? Lịch sử vẫn lưu trên thiết bị này.</div>
            </div>
          </>
        )}

        {/* Step: OTP */}
        {step === "otp" && (
          <>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Nhập mã xác nhận</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 10, lineHeight: 1.6 }}>Mã 6 chữ số gửi tới <strong>{email}</strong></div>
            {demoCode && (
              <div style={{ marginBottom: 18, padding: "8px 12px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 9, fontSize: 12, color: "#92400E", display: "flex", gap: 6, alignItems: "center" }}>
                <span>🔐</span><span><strong>Demo:</strong> mã là <strong style={{ fontFamily: "monospace", letterSpacing: 2 }}>{demoCode}</strong></span>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  value={v}
                  onChange={(e) => handleOtpKey(e, i)}
                  onKeyDown={(e) => handleOtpBackspace(e, i)}
                  maxLength={1}
                  inputMode="numeric"
                  style={{ width: 44, height: 52, textAlign: "center", fontSize: 22, fontWeight: 800, border: `2px solid ${v ? T.red : T.border}`, borderRadius: 10, outline: "none", fontFamily: "'Open Sans',sans-serif", color: T.text, background: v ? T.redSoft : "#fff", transition: "all .15s" }}
                />
              ))}
            </div>
            {err && <div style={{ fontSize: 12, color: "#E53E3E", marginBottom: 10, textAlign: "center" }}>{err}</div>}
            <button onClick={verify} disabled={loading} style={{ ...btnRed({ opacity: loading ? 0.7 : 1 }) }}>
              {loading ? "Đang xác nhận…" : <><Lock />Xác nhận & Đăng nhập</>}
            </button>
            <button onClick={() => { setStep("email"); setOtp(["", "", "", "", "", ""]); setErr(""); }} style={{ width: "100%", marginTop: 10, padding: "10px", background: "none", border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, color: T.muted, cursor: "pointer", fontFamily: "'Open Sans',sans-serif" }}>
              ← Đổi email
            </button>
          </>
        )}

        {/* Step: success */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 56, height: 56, background: T.greenSoft, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 26 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Đăng nhập thành công!</div>
            <div style={{ fontSize: 13, color: T.muted }}>Đang tải lịch sử…</div>
          </div>
        )}
      </div>
    </div>
  );
}
