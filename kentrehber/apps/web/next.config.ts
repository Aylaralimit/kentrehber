import type { NextConfig } from 'next';
import { resolve } from 'node:path';
const config: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: resolve(process.cwd(), '../..'),
  transpilePackages: [
    '@kentrehber/config',
    '@kentrehber/db',
    '@kentrehber/auth',
    '@kentrehber/services',
    '@kentrehber/ui',
  ],
  serverExternalPackages: ['@prisma/client', 'bullmq', 'ioredis'],
  experimental: { cpus: 2 },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};
export default config;
