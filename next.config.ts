import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // Your existing Next.js configuration
});

export default nextConfig;
