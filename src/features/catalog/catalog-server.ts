import 'server-only'

import { catalogPartInputSchema } from '@/features/catalog/catalog-contract'
import {
  authorizeStaff,
  createAuthorizationErrorResponse,
} from '@/lib/auth/staff-authorization'
import { prisma } from '@/lib/database/prisma'
import {
  createApiErrorResponse,
  createInternalServerErrorResponse,
} from '@/lib/http/api-response'

/** Returns the public catalog ordered by creation time. */
export const handleCatalogGet = async (): Promise<Response> => {
  try {
    const catalog = await prisma.catalogPart.findMany({
      orderBy: { createdAt: 'asc' },
    })
    return Response.json(catalog)
  } catch (error) {
    return createInternalServerErrorResponse(error)
  }
}

/** Validates and creates one staff-managed catalog part. */
export const handleCatalogPost = async (
  request: Request,
): Promise<Response> => {
  try {
    const authorization = await authorizeStaff(request.headers)
    if (!authorization.authorized) {
      return createAuthorizationErrorResponse(authorization)
    }

    const result = catalogPartInputSchema.safeParse(await request.json())
    if (!result.success) {
      return createApiErrorResponse('INVALID_CATALOG_PART', 422)
    }

    const part = await prisma.catalogPart.create({ data: result.data })
    return Response.json(part, { status: 201 })
  } catch (error) {
    return createInternalServerErrorResponse(error)
  }
}

/** Deletes one staff-managed catalog part by its stable identifier. */
export const handleCatalogDelete = async (
  request: Request,
  identifier: string,
): Promise<Response> => {
  try {
    const authorization = await authorizeStaff(request.headers)
    if (!authorization.authorized) {
      return createAuthorizationErrorResponse(authorization)
    }

    const deleted = await prisma.catalogPart.deleteMany({
      where: { id: identifier },
    })
    return deleted.count === 0
      ? createApiErrorResponse('CATALOG_PART_NOT_FOUND', 404)
      : new Response(null, { status: 204 })
  } catch (error) {
    return createInternalServerErrorResponse(error)
  }
}
