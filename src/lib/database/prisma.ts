import 'server-only'

import { PrismaPg } from '@prisma/adapter-pg'

import { serverEnvironment } from '@/lib/config/server-environment'
import { PrismaClient } from '@/generated/prisma/client'

/** Development global extended with a reusable Prisma client. */
interface PrismaGlobal {
  /** Existing client preserved across Next.js development reloads. */
  prisma?: PrismaClient
}

/** Global container used to avoid opening duplicate development connections. */
const prismaGlobal = globalThis as typeof globalThis & PrismaGlobal

/** Creates a PostgreSQL-backed Prisma client for the current process. */
const createPrismaClient = (): PrismaClient =>
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: serverEnvironment.DATABASE_URL,
    }),
  })

/** Shared Prisma client used by authentication and workshop repositories. */
export const prisma = prismaGlobal.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') prismaGlobal.prisma = prisma
