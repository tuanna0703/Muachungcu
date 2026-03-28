/* ═══════════════════════════════════════════════════════════════════
   OTP IN-MEMORY STORE  (demo / dev only)
   Production: thay bằng server-side storage (Redis, DB) + email thật
═══════════════════════════════════════════════════════════════════ */
interface OtpRecord {
  code: string;
  exp:  number;
}

const STORE: Record<string, OtpRecord> = {};

/** Tạo OTP 6 chữ số, hết hạn sau 10 phút */
export const generateOtp = (email: string): string => {
  const code = String(Math.floor(100_000 + Math.random() * 900_000));
  STORE[email] = { code, exp: Date.now() + 600_000 };
  return code;
};

/** Kiểm tra OTP — trả về true nếu đúng và chưa hết hạn */
export const verifyOtp = (email: string, input: string): boolean => {
  const r = STORE[email];
  return !!r && Date.now() < r.exp && r.code === input.trim();
};
