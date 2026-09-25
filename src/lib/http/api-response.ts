import 'server-only'

/** JSON-compatible error payload returned by application Route Handlers. */
interface ApiErrorPayload {
  /** Stable machine-readable error code. */
  readonly code: string
}

/** Creates a consistent JSON error response. */
export const createApiErrorResponse = (
  code: string,
  status: number,
): Response => Response.json({ code } satisfies ApiErrorPayload, { status })

/** Logs an unexpected server failure without exposing details to the browser. */
export const createInternalServerErrorResponse = (error: unknown): Response => {
  console.error(error)
  return createApiErrorResponse('INTERNAL_SERVER_ERROR', 500)
}
