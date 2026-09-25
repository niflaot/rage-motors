import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import messages from '../../../../messages/es.json'
import Header from '@/components/navigation/Header/Header'

/** Controllable Better Auth session hook used by the header tests. */
const { useSessionMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn(),
}))

vi.mock('@/lib/auth/auth-client', () => ({
  authClient: {
    signOut: vi.fn(),
    useSession: useSessionMock,
  },
}))

/** Renders the shared header with Spanish navigation messages. */
const renderHeader = (): void => {
  render(
    <NextIntlClientProvider locale='es' messages={messages}>
      <Header />
    </NextIntlClientProvider>,
  )
}

describe('Header', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({ data: null })
  })

  it('does not expose authentication actions to signed-out visitors', () => {
    renderHeader()

    expect(
      screen.queryByRole('button', { name: 'Cerrar sesión' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Staff')).not.toBeInTheDocument()
  })

  it('shows the Discord identity only for an authenticated visitor', () => {
    useSessionMock.mockReturnValue({
      data: { user: { name: 'Niflaot' } },
    })

    renderHeader()

    expect(screen.getAllByText('Niflaot')).toHaveLength(2)
    expect(
      screen.getAllByRole('button', { name: 'Cerrar sesión' }),
    ).toHaveLength(2)
  })
})
