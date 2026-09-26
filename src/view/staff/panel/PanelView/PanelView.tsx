import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import type { AuthSession } from '@/lib/auth/auth-contract'
import DiscordLogin from '@/view/staff/panel/PanelView/parts/DiscordLogin'
import PanelDashboard from '@/view/staff/panel/PanelView/parts/PanelDashboard'

/** Properties accepted by the staff panel view. */
interface PanelViewProperties {
  /** Whether Discord authenticated but the server allowlist rejected the ID. */
  readonly accessDenied: boolean
  /** Whether the server has usable Discord OAuth credentials. */
  readonly authConfigured: boolean
  /** Discord account ID detected when the allowlist rejected the session. */
  readonly deniedDiscordId: string | null
  /** Server-validated Better Auth session, when available. */
  readonly session: AuthSession | null
}

/** Renders a Discord login gate or the authenticated workshop dashboard. */
const PanelView = ({
  accessDenied,
  authConfigured,
  deniedDiscordId,
  session,
}: PanelViewProperties): ReactNode => {
  const translate = useTranslations('Panel')

  return (
    <main className='panel-page' id='main-content'>
      <header className='panel-page__heading'>
        <p className='eyebrow'>{translate('eyebrow')}</p>
        <h1>{translate('title')}</h1>
        <p>{translate('description')}</p>
      </header>
      {session ? (
        <PanelDashboard />
      ) : (
        <DiscordLogin
          accessDenied={accessDenied}
          authConfigured={authConfigured}
          deniedDiscordId={deniedDiscordId}
        />
      )}
    </main>
  )
}

export default PanelView
