const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {}

// export default withContentlayer(nextConfig)

// const withMDX = require('@next/mdx')()
// module.exports = withMDX(nextConfig)
module.exports = withContentlayer(nextConfig)
