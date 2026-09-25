import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

/** Next.js settings shared by development and production builds. */
const nextConfig: NextConfig = {
  reactCompiler: true,
}

/** Connects the request-scoped translation configuration to Next.js. */
const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
