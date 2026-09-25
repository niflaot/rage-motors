import { z } from 'zod'

import { catalogIconSchema } from '@/features/catalog/catalog-contract'

/** Part and quantity selected by a customer before server-side enrichment. */
export const requestedPartInputSchema = z.object({
  partId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
})

/** Immutable catalog snapshot kept with a persisted customer request. */
export const requestedPartSchema = z.object({
  icon: catalogIconSchema,
  name: z.string().trim().min(2).max(80),
  offerPrice: z.number().int().positive(),
  partId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
})

/** Shared validation contract for a new workshop request. */
export const workshopRequestInputSchema = z.object({
  name: z.string().trim().max(80),
  phone: z
    .string()
    .trim()
    .min(5)
    .max(24)
    .regex(/^[0-9+()\s-]+$/),
  details: z.string().trim().min(10).max(600),
  parts: z
    .array(requestedPartInputSchema)
    .min(1)
    .max(40)
    .refine(
      (parts) =>
        new Set(parts.map((part) => part.partId)).size === parts.length,
    ),
})

/** Runtime contract for a request returned by the PostgreSQL service. */
export const workshopRequestSchema = workshopRequestInputSchema
  .omit({ parts: true })
  .extend({
    completed: z.boolean(),
    createdAt: z.string(),
    id: z.string().min(1),
    parts: z.array(requestedPartSchema),
  })

/** Validated part selection included in a public request. */
export type RequestedPart = z.infer<typeof requestedPartSchema>

/** Part selection accepted by the public request endpoint. */
export type RequestedPartInput = z.infer<typeof requestedPartInputSchema>

/** Validated values entered into the public request form. */
export type WorkshopRequestInput = z.infer<typeof workshopRequestInputSchema>

/** Persisted workshop request displayed inside the staff panel. */
export type WorkshopRequest = z.infer<typeof workshopRequestSchema>
