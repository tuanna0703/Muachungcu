import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title:       "Hỏi AI về dự án chung cư | MuaChungCư",
  description: "AI tra cứu, phân tích giá và tư vấn mua bán chung cư Việt Nam tức thì.",
  openGraph: {
    title:       "hỏi.muachungcu.net — AI tra cứu chung cư VN",
    description: "Dán tin rao hoặc đặt câu hỏi — AI phân tích ngay.",
    url:         "https://muachungcu.net",
    siteName:    "Mua Chung Cư",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" style={{ height: "100%" }}>
      <body style={{ height: "100%" }}>
        {children}
      </body>
    </html>
  );
}
