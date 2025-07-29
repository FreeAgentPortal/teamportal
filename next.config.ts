import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL || 'https://api.freeagentportal.com/api/v1',
    AUTH_URL: process.env.AUTH_URL,
    SERVICE_NAME: process.env.SERVICE_NAME,
    ENV: process.env.NODE_ENV,
    ENCRYPTION_KEY: 'asdf234as2342asdf2i;lk342342;$23423',
    TEAMS_APP_URL: process.env.TEAMS_APP_URL,
    ADMIN_APP_URL: process.env.ADMIN_APP_URL,
    SCOUT_APP_URL: process.env.SCOUT_APP_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
    // loader: 'custom',
    loaderFile: './src/utils/customImageLoader.ts',

    // Image optimization settings
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
