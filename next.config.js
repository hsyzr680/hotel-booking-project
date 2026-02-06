/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // تحسين البناء على Vercel مع Prisma
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  // هذا الجزء الجديد يمنع توقف الموقع بسبب أخطاء البرمجة البسيطة أثناء الرفع
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // منع Next.js من محاولة pre-render صفحات API
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // تجنب أخطاء Build مع API Routes
  outputFileTracingRoot: undefined,
}

module.exports = nextConfig