const { withContentlayer } = require('next-contentlayer2')
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { optimizeCss: true },
  // Turbopack config for module resolution
  turbopack: {
    resolveAlias: {
      'contentlayer2/generated': './.contentlayer/generated',
    },
  },
  webpack: (config, { isServer }) => {
    // Ensure alias is set for contentlayer2/generated
    // This must be applied after withContentlayer processes the config
    if (!config.resolve) {
      config.resolve = {}
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {}
    }
    config.resolve.alias['contentlayer2/generated'] = path.resolve(
      __dirname,
      '.contentlayer/generated'
    )
    return config
  },
}

// Wrap with contentlayer, but ensure our webpack alias is preserved
const configWithContentlayer = withContentlayer(nextConfig)

// Ensure webpack alias is always set (in case withContentlayer modifies it)
if (configWithContentlayer.webpack) {
  const originalWebpack = configWithContentlayer.webpack
  configWithContentlayer.webpack = (config, options) => {
    const result = originalWebpack(config, options)
    // Always ensure our alias is set
    if (!result.resolve) {
      result.resolve = {}
    }
    if (!result.resolve.alias) {
      result.resolve.alias = {}
    }
    result.resolve.alias['contentlayer2/generated'] = path.resolve(
      __dirname,
      '.contentlayer/generated'
    )
    return result
  }
}

module.exports = configWithContentlayer
