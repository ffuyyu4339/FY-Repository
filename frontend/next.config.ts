import type { NextConfig } from "next";

const backendInternalUrl =
  process.env.BACKEND_INTERNAL_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendInternalUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
