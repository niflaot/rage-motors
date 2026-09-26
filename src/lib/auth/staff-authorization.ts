import 'server-only'

import { auth, type AuthSession } from '@/lib/auth/auth'
import { authorizedDiscordIds } from '@/lib/auth/authorized-discord-ids'
import { prisma } from '@/lib/database/prisma'

/** Successful staff authorization with its validated Better Auth session. */
interface AuthorizedStaff {
  /** Indicates that the Discord account belongs to the allowlist. */
  readonly authorized: true
  /** Authenticated Better Auth session. */
  readonly session: AuthSession
}

/** Rejected staff authorization and its public API error. */
interface RejectedStaff {
  /** Indicates that the request cannot access staff operations. */
  readonly authorized: false
  /** Stable machine-readable error code. */
  readonly code: 'DISCORD_ACCOUNT_NOT_AUTHORIZED' | 'UNAUTHENTICATED'
  /** HTTP status matching the authorization failure. */
  readonly status: 401 | 403
}

/** Result returned by the shared Discord staff authorization check. */
export type StaffAuthorizationResult = AuthorizedStaff | RejectedStaff

/** Authenticates a request and verifies its linked Discord account ID. */
export const authorizeStaff = async (
  requestHeaders: Headers,
): Promise<StaffAuthorizationResult> => {
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session) {
    return { authorized: false, code: 'UNAUTHENTICATED', status: 401 }
  }

  const discordAccount = await prisma.account.findFirst({
    select: { accountId: true },
    where: {
      accountId: { in: [...authorizedDiscordIds] },
      providerId: 'discord',
      userId: session.user.id,
    },
  })

  if (!discordAccount) {
    return {
      authorized: false,
      code: 'DISCORD_ACCOUNT_NOT_AUTHORIZED',
      status: 403,
    }
  }

  return { authorized: true, session }
}

/** Converts a rejected authorization result into a JSON response. */
export const createAuthorizationErrorResponse = (
  result: RejectedStaff,
): Response => Response.json({ code: result.code }, { status: result.status })
