import type { NextConfig } from "next";
import withPWA from "next-pwa";

const config: NextConfig = {
  /* config options here */
};

const nextConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
    image: "/api/placeholder/512/512",
  }
})(config);

export default nextConfig;