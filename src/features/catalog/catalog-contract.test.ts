import { describe, expect, it } from 'vitest'

import { catalogPartInputSchema } from '@/features/catalog/catalog-contract'

describe('catalogPartInputSchema', () => {
  it('migrates a legacy icon to a valid Lucide name', () => {
    const result = catalogPartInputSchema.parse({
      icon: 'motor',
      name: 'Bloque motor',
      salePrice: 8000,
    })

    expect(result.icon).toBe('cog')
  })

  it('rejects a malformed icon identifier', () => {
    expect(
      catalogPartInputSchema.safeParse({
        icon: 'Icono inexistente!',
        name: 'Bloque motor',
        salePrice: 8000,
      }).success,
    ).toBe(false)
  })
})
