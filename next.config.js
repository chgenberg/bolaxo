/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Tillåt prod-build utan att eslint är installerat i CI-miljöer
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unpkg.com',
        pathname: '/leaflet@1.9.4/dist/images/**',
      },
    ],
    // Optimize images för production
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  // Security headers (complementing middleware.ts)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
}

module.exports = nextConfig

