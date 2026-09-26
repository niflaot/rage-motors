import 'server-only'

import { z } from 'zod'

/** Validates private runtime values required by authentication and persistence. */
const serverEnvironmentSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  DATABASE_URL: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
})

/** Validated private configuration available only to server modules. */
export const serverEnvironment = serverEnvironmentSchema.parse(process.env)
