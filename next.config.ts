import type { NextConfig } from 'next';

if (process.env.NODE_ENV === 'development') {
  const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing type errors between Prisma generated types and custom types.
    // Run `tsc --noEmit` separately to check types.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
  serverExternalPackages: ['@prisma/client', '.prisma/client'],
  async rewrites() {
    return [
      {
        source: '/gallery/:slug',
        destination: '/api/gallery/:slug',
      },
      {
        source: '/hero/:slug',
        destination: '/api/hero/:slug',
      },
      {
        source: '/services/:slug',
        destination: '/api/services/:slug',
      },
      {
        source: '/testimonials/:slug',
        destination: '/api/testimonials/:slug',
      },
    ];
  },
};

export default nextConfig;
