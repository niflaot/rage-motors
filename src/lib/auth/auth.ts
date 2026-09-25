import 'server-only'

import { prismaAdapter } from '@better-auth/prisma-adapter'
import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'

import { serverEnvironment } from '@/lib/config/server-environment'
import { prisma } from '@/lib/database/prisma'

/** Database-backed authentication shared by Next.js routes and server views. */
export const auth = betterAuth({
  advanced: {
    database: {
      joins: true,
    },
  },
  appName: 'Rage Motors',
  baseURL: serverEnvironment.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [nextCookies()],
  secret: serverEnvironment.BETTER_AUTH_SECRET,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
      strategy: 'jwe',
    },
  },
  socialProviders: {
    discord: {
      clientId: serverEnvironment.DISCORD_CLIENT_ID,
      clientSecret: serverEnvironment.DISCORD_CLIENT_SECRET,
    },
  },
  trustedOrigins: [serverEnvironment.BETTER_AUTH_URL],
})

/** Session shape inferred from the server authentication configuration. */
export type AuthSession = typeof auth.$Infer.Session
