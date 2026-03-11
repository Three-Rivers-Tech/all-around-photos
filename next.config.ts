import type { NextConfig } from 'next';

if (process.env.NODE_ENV === 'development') {
  const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  typescript: {
    // Keep during migration — remove once all types are clean
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
