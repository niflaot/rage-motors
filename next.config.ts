import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

/** Next.js settings shared by development and production builds. */
const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    const apiUrl = process.env.RAGE_API_URL ?? 'http://localhost:3001'

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ]
  },
}

/** Connects the request-scoped translation configuration to Next.js. */
const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
