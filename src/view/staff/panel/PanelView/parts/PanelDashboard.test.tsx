import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import messages from '../../../../../../messages/es.json'
import PanelDashboard from '@/view/staff/panel/PanelView/parts/PanelDashboard'

/** Renders the authenticated panel tools with Spanish messages. */
const renderPanelDashboard = (): void => {
  render(
    <NextIntlClientProvider locale='es' messages={messages}>
      <PanelDashboard />
    </NextIntlClientProvider>,
  )
}

describe('PanelDashboard', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        json: async () => [],
        ok: true,
      })),
    )
  })

  it('switches from requests to the catalog and selects a Lucide icon', async () => {
    const user = userEvent.setup()
    renderPanelDashboard()

    await user.click(screen.getByRole('tab', { name: /Catálogo de compra/ }))

    expect(
      screen.getByRole('heading', { name: 'Catálogo de compra' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Cog/ }))
    await user.type(
      screen.getByRole('searchbox', { name: 'Buscar icono' }),
      'wrench',
    )
    await user.click(
      await screen.findByRole('option', { name: 'Elegir Wrench' }),
    )

    expect(screen.getByRole('button', { name: /Wrench/ })).toBeInTheDocument()
  })
})
