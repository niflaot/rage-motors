import { prisma } from '@/lib/database/prisma'
import { createInternalServerErrorResponse } from '@/lib/http/api-response'

/** Reports application and PostgreSQL readiness to the container healthcheck. */
export const GET = async (): Promise<Response> => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return Response.json({ status: 'ok' })
  } catch (error) {
    return createInternalServerErrorResponse(error)
  }
}
