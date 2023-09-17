const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    experimental: {
      mdxRs: true,
    },
  },
}

// export default withContentlayer(nextConfig)

// const withMDX = require('@next/mdx')()
// module.exports = withMDX(nextConfig)
module.exports = withContentlayer(nextConfig)
