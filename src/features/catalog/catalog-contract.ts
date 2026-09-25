import { z } from 'zod'
import { iconNames } from 'lucide-react/dynamic'
import type { IconName } from 'lucide-react/dynamic'

/** Legacy identifiers migrated from the original ten-icon catalog. */
const legacyCatalogIcons = {
  aceite: 'droplet',
  bateria: 'battery-charging',
  carroceria: 'car-front',
  frenos: 'disc-3',
  gps: 'map-pin',
  motor: 'cog',
  nitro: 'flask-conical',
  rueda: 'circle-dot',
  seguridad: 'shield-check',
  transmision: 'git-branch',
} as const satisfies Readonly<Record<string, IconName>>

/** Fast lookup used by Zod to reject unknown dynamic icon names. */
const catalogIconNames: ReadonlySet<string> = new Set(iconNames)

/** Converts an old icon identifier into its Lucide equivalent. */
const normalizeCatalogIcon = (value: unknown): unknown =>
  typeof value === 'string' && value in legacyCatalogIcons
    ? legacyCatalogIcons[value as keyof typeof legacyCatalogIcons]
    : value

/** Any valid icon name exported by the installed Lucide package. */
export const catalogIconSchema = z.preprocess(
  normalizeCatalogIcon,
  z.custom<IconName>(
    (value) => typeof value === 'string' && catalogIconNames.has(value),
  ),
)

/** Shared validation contract for staff-created catalog parts. */
export const catalogPartInputSchema = z.object({
  icon: catalogIconSchema,
  name: z.string().trim().min(2).max(80),
  salePrice: z.coerce.number().int().positive().max(100000000),
})

/** Supported Lucide identifier for a catalog part. */
export type CatalogIcon = IconName

/** Validated values entered into the catalog form. */
export type CatalogPartInput = z.infer<typeof catalogPartInputSchema>

/** Persisted PostgreSQL catalog part returned by the service API. */
export interface CatalogPart extends CatalogPartInput {
  /** Stable identifier used for list updates. */
  readonly id: string
}
