const { withContentlayer } = require('next-contentlayer2')
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { optimizeCss: true },
  // Turbopack config to silence webpack warning from contentlayer2
  turbopack: {},
  webpack: (config) => {
    // Add alias for contentlayer2/generated to resolve to .contentlayer/generated
    config.resolve.alias = {
      ...config.resolve.alias,
      'contentlayer2/generated': path.resolve(__dirname, '.contentlayer/generated'),
    }
    return config
  },
}

module.exports = withContentlayer(nextConfig)
