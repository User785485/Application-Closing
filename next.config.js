/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  distDir: '.next',
  experimental: {
    // Configuration optimisée pour Next.js 15
    serverActions: {
      allowedOrigins: ['localhost:3000', 'my-muqabala-3-0.vercel.app'],
      bodySizeLimit: '2mb'
    }
  },
  // Désactiver le traçage pour éviter les problèmes de permission
  tracing: false,
  eslint: {
    ignoreDuringBuilds: true, // Ignorer les erreurs ESLint pendant la construction pour la production
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorer les erreurs TypeScript pendant la construction pour la production
  },
  images: {
    unoptimized: true, // Pour éviter les problèmes avec les images durant le déploiement
  },
  // Améliorer le logging et le reporting d'erreurs pour le déploiement
  onDemandEntries: {
    // Gérer la compilation des pages pour de meilleures performances
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Désactiver les statistiques pour éviter les problèmes de permission
  generateBuildId: async () => {
    return 'my-muqabala-build-' + new Date().getTime();
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        // Cette règle garantit que toutes les routes non-API sont traitées par Next.js
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
