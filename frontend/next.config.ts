import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow importing shared code from ../backend
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
