import { z } from 'zod'

import {
  catalogPartInputSchema,
  type CatalogPart,
  type CatalogPartInput,
} from '@/features/catalog/catalog-contract'

/** Runtime contract for a catalog record returned by PostgreSQL. */
const catalogPartSchema = catalogPartInputSchema.extend({
  id: z.string().min(1),
})

/** Reads the current public catalog exclusively from the service API. */
export const getCatalog = async (): Promise<readonly CatalogPart[]> => {
  const response = await fetch('/api/catalog', { cache: 'no-store' })
  if (!response.ok) throw new Error('CATALOG_LOAD_FAILED')
  return z.array(catalogPartSchema).parse(await response.json())
}

/** Creates one staff-managed catalog part in PostgreSQL. */
export const addCatalogPart = async (
  input: CatalogPartInput,
): Promise<CatalogPart> => {
  const response = await fetch('/api/catalog', {
    body: JSON.stringify(input),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  if (!response.ok) throw new Error('CATALOG_CREATE_FAILED')
  return catalogPartSchema.parse(await response.json())
}

/** Deletes one staff-managed catalog part from PostgreSQL. */
export const deleteCatalogPart = async (identifier: string): Promise<void> => {
  const response = await fetch(
    `/api/catalog/${encodeURIComponent(identifier)}`,
    {
      method: 'DELETE',
    },
  )
  if (!response.ok) throw new Error('CATALOG_DELETE_FAILED')
}
