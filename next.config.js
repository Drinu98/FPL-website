/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 400,
  images: {
    domains: ['resources.premierleague.com'], // Add 'resources.premierleague.com' to the domains array
  },
}

module.exports = nextConfig
