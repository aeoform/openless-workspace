import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // Static hosts do not provide the Next.js image optimization server.
    unoptimized: true,
  },
};

export default nextConfig;
