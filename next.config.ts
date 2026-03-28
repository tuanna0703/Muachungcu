import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phép gọi Anthropic API từ server-side route handler
  // Không cần cấu hình thêm vì proxy đặt trong app/api/ai/route.ts
};

export default nextConfig;
