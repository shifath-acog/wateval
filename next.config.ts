import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['www.aganitha.ai'],
  },
  serverRuntimeConfig: {
    timeout: 1800000, // 30 minutes in milliseconds
  }
};

export default nextConfig;