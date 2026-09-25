import {
  handleRequestDelete,
  handleRequestPatch,
} from '@/features/requests/request-server'

/** Dynamic workshop request parameters supplied by Next.js. */
interface RequestRouteContext {
  /** Stable workshop request identifier from the URL. */
  readonly params: Promise<{ readonly id: string }>
}

/** Updates the request addressed by the dynamic route. */
export const PATCH = async (
  request: Request,
  context: RequestRouteContext,
): Promise<Response> => {
  const { id } = await context.params
  return handleRequestPatch(request, id)
}

/** Deletes the request addressed by the dynamic route. */
export const DELETE = async (
  request: Request,
  context: RequestRouteContext,
): Promise<Response> => {
  const { id } = await context.params
  return handleRequestDelete(request, id)
}
