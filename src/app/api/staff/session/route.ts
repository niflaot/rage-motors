import {
  authorizeStaff,
  createAuthorizationErrorResponse,
} from '@/lib/auth/staff-authorization'
import { createInternalServerErrorResponse } from '@/lib/http/api-response'

/** Returns the current session only when its Discord ID is authorized. */
export const GET = async (request: Request): Promise<Response> => {
  try {
    const authorization = await authorizeStaff(request.headers)
    return authorization.authorized
      ? Response.json(authorization.session)
      : createAuthorizationErrorResponse(authorization)
  } catch (error) {
    return createInternalServerErrorResponse(error)
  }
}
