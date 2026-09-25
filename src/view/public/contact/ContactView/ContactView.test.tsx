import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import messages from '../../../../../messages/es.json'
import ContactView from '@/view/public/contact/ContactView/ContactView'

/** Configured part used to exercise the public add/remove interaction. */
const configuredPart = {
  icon: 'motor',
  id: 'motor-1',
  name: 'Bloque motor',
  salePrice: 8000,
} as const

/** Renders the Spanish public contact surface. */
const renderContactView = (): void => {
  render(
    <NextIntlClientProvider locale='es' messages={messages}>
      <ContactView />
    </NextIntlClientProvider>,
  )
}

describe('ContactView', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        json: async () => [configuredPart],
        ok: true,
      })),
    )
  })

  it('adds and removes a configured piece from its icon tile', async () => {
    const user = userEvent.setup()
    renderContactView()

    expect(
      await screen.findByRole('status', { name: 'Bloque motor: 0' }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Añadir Bloque motor' }),
    )
    expect(
      screen.getByRole('status', { name: 'Bloque motor: 1' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
    expect(screen.getByText('1 pieza seleccionada')).toBeInTheDocument()
    expect(
      screen
        .getByText('Subtotal estimado')
        .closest('.parts-form__catalog-summary'),
    ).toHaveTextContent(/\$4[.,]?000/)

    await user.click(
      screen.getByRole('button', {
        name: 'Quitar una unidad de Bloque motor',
      }),
    )
    expect(
      screen.getByRole('status', { name: 'Bloque motor: 0' }),
    ).toBeInTheDocument()
  })
})
