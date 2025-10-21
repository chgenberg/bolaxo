/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Tillåt prod-build utan att eslint är installerat i CI-miljöer
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

