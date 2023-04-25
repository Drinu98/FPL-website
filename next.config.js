/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  staticPageGenerationTimeout: 1000,
  images: {
    domains: ['resources.premierleague.com'], // Add 'resources.premierleague.com' to the domains array
  },
}

module.exports = nextConfig
