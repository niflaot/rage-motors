import 'server-only'

import { headers } from 'next/headers'

import { authSessionSchema, type AuthSession } from '@/lib/auth/auth-contract'

/** Result of checking both authentication and the Discord staff allowlist. */
export interface StaffSessionResult {
  /** Whether a signed-in Discord account was rejected by the allowlist. */
  readonly accessDenied: boolean
  /** Authorized session, when the account passed every server check. */
  readonly session: AuthSession | null
}

/** Reads an authorized session directly from the backend service. */
export const getStaffSession = async (): Promise<StaffSessionResult> => {
  const incomingHeaders = await headers()
  const apiUrl = process.env.RAGE_API_URL ?? 'http://localhost:3001'

  try {
    const response = await fetch(`${apiUrl}/api/staff/session`, {
      cache: 'no-store',
      headers: {
        cookie: incomingHeaders.get('cookie') ?? '',
      },
    })

    if (response.status === 403) return { accessDenied: true, session: null }
    if (!response.ok) return { accessDenied: false, session: null }

    const result = authSessionSchema.safeParse(await response.json())
    return {
      accessDenied: false,
      session: result.success ? result.data : null,
    }
  } catch {
    return { accessDenied: false, session: null }
  }
}
