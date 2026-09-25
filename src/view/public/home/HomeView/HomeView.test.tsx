import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'

import messages from '../../../../../messages/es.json'
import HomeView from '@/view/public/home/HomeView/HomeView'

/** Renders the home view with its Spanish translation catalog. */
const renderHomeView = (): void => {
  render(
    <NextIntlClientProvider locale='es' messages={messages}>
      <HomeView />
    </NextIntlClientProvider>,
  )
}

describe('HomeView', () => {
  it('renders the translated workshop heading', () => {
    renderHomeView()

    expect(
      screen.getByRole('heading', { name: 'No lo dejes de fábrica.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ver servicios/ })).toHaveAttribute(
      'href',
      '#servicios',
    )
  })

  it('invites candidates to visit the workshop with their CV', async () => {
    const user = userEvent.setup()
    renderHomeView()

    await user.click(screen.getByRole('button', { name: 'Historia siguiente' }))
    await user.click(screen.getByRole('button', { name: 'Historia siguiente' }))

    expect(
      screen.getByRole('heading', { name: 'Hoy tenemos trabajo.' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Visítanos con tu CV/ }),
    ).toHaveAttribute('href', '/ubicacion')
  })

  it('keeps the clicked service after a temporary hover preview', async () => {
    const user = userEvent.setup()
    renderHomeView()

    await user.click(screen.getByRole('button', { name: 'Pintura' }))

    expect(screen.getByRole('heading', { name: 'Pintura' })).toBeInTheDocument()
    expect(screen.getByText('desde $800')).toBeInTheDocument()

    await user.hover(screen.getByRole('button', { name: 'Seguridad' }))

    expect(
      screen.getByRole('heading', { name: 'Seguridad' }),
    ).toBeInTheDocument()

    await user.unhover(screen.getByRole('button', { name: 'Seguridad' }))

    expect(screen.getByRole('heading', { name: 'Pintura' })).toBeInTheDocument()
  })
})
