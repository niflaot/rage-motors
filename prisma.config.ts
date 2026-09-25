import 'dotenv/config'

import { defineConfig, env } from 'prisma/config'

/** Configures Prisma migrations against the server-only PostgreSQL URL. */
export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: 'prisma/migrations',
  },
  schema: 'prisma/schema.prisma',
})
