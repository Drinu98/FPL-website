/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  staticPageGenerationTimeout: 1000,
}

module.exports = nextConfig
