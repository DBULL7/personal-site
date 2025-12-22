const { withContentlayer } = require('next-contentlayer2')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { optimizeCss: true },
  // Turbopack config to silence webpack warning from contentlayer2
  turbopack: {}
}

module.exports = withContentlayer(nextConfig)
