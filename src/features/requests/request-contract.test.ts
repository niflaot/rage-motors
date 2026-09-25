import { describe, expect, it } from 'vitest'

import { workshopRequestInputSchema } from '@/features/requests/request-contract'

/** Complete valid request used to verify the shared Zod contract. */
const validRequest = {
  details: 'Dos piezas en buen estado y listas para entregar.',
  name: 'Tommy',
  parts: [
    {
      icon: 'motor',
      name: 'Bloque motor',
      offerPrice: 4000,
      partId: 'motor-1',
      quantity: 2,
    },
  ],
  phone: '555-0142',
} as const

describe('workshopRequestInputSchema', () => {
  it('accepts a request with a configured piece', () => {
    expect(workshopRequestInputSchema.safeParse(validRequest).success).toBe(
      true,
    )
  })

  it('rejects a request without selected pieces', () => {
    expect(
      workshopRequestInputSchema.safeParse({ ...validRequest, parts: [] })
        .success,
    ).toBe(false)
  })
})
