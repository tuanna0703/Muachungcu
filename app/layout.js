import PWAProvider from "@/components/PWAProvider";

export const metadata = {
  title: {
    default: "MuaChungCu.net - Dự án Căn hộ & Chung cư Việt Nam",
    template: "%s | MuaChungCu.net",
  },
  description: "Tổng hợp thông tin dự án căn hộ, chung cư Việt Nam, phân tích tiềm năng đầu tư bởi Claude AI",
  keywords: ["mua chung cư", "căn hộ", "dự án chung cư", "chung cư Hà Nội", "chung cư HCM", "đầu tư căn hộ"],
  authors: [{ name: "MuaChungCu.net" }],
  creator: "MuaChungCu.net",
  manifest: "/manifest.json",
  themeColor: "#facc15",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MuaChungCu",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://muachungcu.net",
    siteName: "MuaChungCu.net",
    title: "MuaChungCu.net - Dự án Căn hộ & Chung cư Việt Nam",
    description: "Tổng hợp thông tin dự án căn hộ, chung cư, phân tích bởi Claude AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MuaChungCu.net",
    description: "Tổng hợp thông tin dự án căn hộ, chung cư Việt Nam",
    images: ["/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MuaChungCu" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="msapplication-TileColor" content="#080f1a" />
        <meta name="theme-color" content="#facc15" />
      </head>
      <body style={{ margin: 0, background: "#080f1a" }}>
        <PWAProvider>
          {children}
        </PWAProvider>
      </body>
    </html>
  );
}
