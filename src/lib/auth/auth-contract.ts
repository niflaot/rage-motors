import { z } from 'zod'

/** Minimal session payload consumed by the frontend shell and staff route. */
export const authSessionSchema = z.object({
  session: z.object({
    id: z.string(),
    userId: z.string(),
  }),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string().nullable().optional(),
  }),
})

/** Server-validated authenticated session returned by the backend. */
export type AuthSession = z.infer<typeof authSessionSchema>
