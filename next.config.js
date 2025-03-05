/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  // Configuration pour Vercel
  distDir: '.next',
  output: 'standalone',
};

module.exports = nextConfig;
