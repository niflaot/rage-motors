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

  it('rejects an icon that Lucide does not provide', () => {
    expect(
      catalogPartInputSchema.safeParse({
        icon: 'icono-inexistente',
        name: 'Bloque motor',
        salePrice: 8000,
      }).success,
    ).toBe(false)
  })
})
