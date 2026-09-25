import 'server-only'

import { z } from 'zod'

import { workshopRequestInputSchema } from '@/features/requests/request-contract'
import {
  authorizeStaff,
  createAuthorizationErrorResponse,
} from '@/lib/auth/staff-authorization'
import { prisma } from '@/lib/database/prisma'
import {
  createApiErrorResponse,
  createInternalServerErrorResponse,
} from '@/lib/http/api-response'

/** Validates a staff update to a request completion state. */
const requestStatusInputSchema = z.object({
  completed: z.boolean(),
})

/** Creates a public workshop request from current catalog snapshots. */
export const handleRequestsPost = async (
  request: Request,
): Promise<Response> => {
  try {
    const result = workshopRequestInputSchema.safeParse(await request.json())
    if (!result.success) {
      return createApiErrorResponse('INVALID_WORKSHOP_REQUEST', 422)
    }

    const identifiers = result.data.parts.map((part) => part.partId)
    const catalog = await prisma.catalogPart.findMany({
      where: { id: { in: identifiers } },
    })
    if (catalog.length !== identifiers.length) {
      return createApiErrorResponse('CATALOG_CHANGED', 409)
    }

    const catalogById = new Map(catalog.map((part) => [part.id, part]))
    const created = await prisma.workshopRequest.create({
      data: {
        details: result.data.details,
        name: result.data.name,
        parts: {
          create: result.data.parts.map((selection) => {
            const part = catalogById.get(selection.partId)
            if (!part)
              throw new Error('Catalog part disappeared during creation')
            return {
              icon: part.icon,
              name: part.name,
              offerPrice: Math.round(part.salePrice * 0.5),
              partId: part.id,
              quantity: selection.quantity,
            }
          }),
        },
        phone: result.data.phone,
      },
      include: { parts: true },
    })

    return Response.json(created, { status: 201 })
  } catch (error) {
    return createInternalServerErrorResponse(error)
  }
}

/** Returns every workshop request to an authorized staff account. */
export const handleRequestsGet = async (
  request: Request,
): Promise<Response> => {
  try {
    const authorization = await authorizeStaff(request.headers)
    if (!authorization.authorized) {
      return createAuthorizationErrorResponse(authorization)
    }

    const requests = await prisma.workshopRequest.findMany({
      include: { parts: true },
      orderBy: { createdAt: 'desc' },
    })
    return Response.json(requests)
  } catch (error) {
    return createInternalServerErrorResponse(error)
  }
}

/** Updates one workshop request completion state for authorized staff. */
export const handleRequestPatch = async (
  request: Request,
  identifier: string,
): Promise<Response> => {
  try {
    const authorization = await authorizeStaff(request.headers)
    if (!authorization.authorized) {
      return createAuthorizationErrorResponse(authorization)
    }

    const result = requestStatusInputSchema.safeParse(await request.json())
    if (!result.success) {
      return createApiErrorResponse('INVALID_REQUEST_STATUS', 422)
    }

    const updated = await prisma.workshopRequest.updateMany({
      data: result.data,
      where: { id: identifier },
    })
    return updated.count === 0
      ? createApiErrorResponse('WORKSHOP_REQUEST_NOT_FOUND', 404)
      : new Response(null, { status: 204 })
  } catch (error) {
    return createInternalServerErrorResponse(error)
  }
}

/** Deletes one workshop request for authorized staff. */
export const handleRequestDelete = async (
  request: Request,
  identifier: string,
): Promise<Response> => {
  try {
    const authorization = await authorizeStaff(request.headers)
    if (!authorization.authorized) {
      return createAuthorizationErrorResponse(authorization)
    }

    const deleted = await prisma.workshopRequest.deleteMany({
      where: { id: identifier },
    })
    return deleted.count === 0
      ? createApiErrorResponse('WORKSHOP_REQUEST_NOT_FOUND', 404)
      : new Response(null, { status: 204 })
  } catch (error) {
    return createInternalServerErrorResponse(error)
  }
}
