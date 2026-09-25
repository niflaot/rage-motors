import { toNextJsHandler } from 'better-auth/next-js'

import { auth } from '@/lib/auth/auth'

/** Better Auth handlers mounted on the same origin as the Next.js application. */
const authHandlers = toNextJsHandler(auth)

/** Handles Better Auth read operations such as session retrieval and callbacks. */
export const GET = authHandlers.GET

/** Handles Better Auth mutations such as Discord sign-in and sign-out. */
export const POST = authHandlers.POST
