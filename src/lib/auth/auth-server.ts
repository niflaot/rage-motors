import 'server-only'

import { headers } from 'next/headers'

import type { AuthSession } from '@/lib/auth/auth'
import { authorizeStaff } from '@/lib/auth/staff-authorization'

/** Result of checking both authentication and the Discord staff allowlist. */
export interface StaffSessionResult {
  /** Whether a signed-in Discord account was rejected by the allowlist. */
  readonly accessDenied: boolean
  /** Discord account ID linked to a denied authenticated session. */
  readonly deniedDiscordId: string | null
  /** Authorized session, when the account passed every server check. */
  readonly session: AuthSession | null
}

/** Reads an authorized session directly from the same Next.js process. */
export const getStaffSession = async (): Promise<StaffSessionResult> => {
  try {
    const result = await authorizeStaff(new Headers(await headers()))
    if (!result.authorized) {
      return {
        accessDenied: result.status === 403,
        deniedDiscordId: result.discordAccountId,
        session: null,
      }
    }
    return {
      accessDenied: false,
      deniedDiscordId: null,
      session: result.session,
    }
  } catch {
    return { accessDenied: false, deniedDiscordId: null, session: null }
  }
}
