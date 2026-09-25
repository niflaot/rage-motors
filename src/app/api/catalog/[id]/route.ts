import { handleCatalogDelete } from '@/features/catalog/catalog-server'

/** Dynamic catalog route parameters supplied by Next.js. */
interface CatalogRouteContext {
  /** Stable catalog identifier from the URL. */
  readonly params: Promise<{ readonly id: string }>
}

/** Deletes the catalog record addressed by the dynamic route. */
export const DELETE = async (
  request: Request,
  context: CatalogRouteContext,
): Promise<Response> => {
  const { id } = await context.params
  return handleCatalogDelete(request, id)
}
