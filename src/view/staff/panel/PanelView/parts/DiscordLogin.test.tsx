import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it, vi } from 'vitest'

import messages from '../../../../../../messages/es.json'
import DiscordLogin from '@/view/staff/panel/PanelView/parts/DiscordLogin'

vi.mock('@/lib/auth/auth-client', () => ({
  authClient: {
    signIn: { social: vi.fn() },
    signOut: vi.fn(),
  },
}))

/** Renders the Discord login gate with Spanish translations. */
const renderDiscordLogin = (
  accessDenied: boolean,
  deniedDiscordId: string | null,
): void => {
  render(
    <NextIntlClientProvider locale='es' messages={messages}>
      <DiscordLogin
        accessDenied={accessDenied}
        authConfigured
        deniedDiscordId={deniedDiscordId}
      />
    </NextIntlClientProvider>,
  )
}

describe('DiscordLogin', () => {
  it('shows the exact Discord ID detected for a rejected account', () => {
    renderDiscordLogin(true, '1532775222388854847')

    expect(
      screen.getByText('ID detectado: 1532775222388854847'),
    ).toBeInTheDocument()
  })

  it('does not expose an account ID when there is no rejected session', () => {
    renderDiscordLogin(false, null)

    expect(screen.queryByText(/ID detectado:/)).not.toBeInTheDocument()
  })
})
