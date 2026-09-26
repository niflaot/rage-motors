import 'server-only'

/** Discord user IDs permanently allowed to access the workshop panel. */
const authorizedDiscordIdValues = [
  '123456789012345678',
  '278642935426449418',
  '987654321098765432',
  '1532775222388854847',
] as const

/** Fast server-only lookup for the hardcoded staff allowlist. */
export const authorizedDiscordIds: ReadonlySet<string> = new Set(
  authorizedDiscordIdValues,
)
