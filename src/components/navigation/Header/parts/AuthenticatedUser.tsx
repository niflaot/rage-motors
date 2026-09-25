import { LogOut } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

/** Properties accepted by the authenticated header account control. */
interface AuthenticatedUserProperties {
  /** Localized label describing the account controls. */
  readonly accountLabel: string
  /** Accessible label for ending the current session. */
  readonly logoutLabel: string
  /** Accessible label for opening the staff panel. */
  readonly panelLabel: string
  /** Short localized role shown above the user name. */
  readonly roleLabel: string
  /** Display name returned by Discord. */
  readonly userName: string
  /** Ends the authenticated Better Auth session. */
  readonly onLogout: () => Promise<void>
}

/** Displays the current Discord identity and a compact session action. */
const AuthenticatedUser = ({
  accountLabel,
  logoutLabel,
  onLogout,
  panelLabel,
  roleLabel,
  userName,
}: AuthenticatedUserProperties): ReactNode => (
  <div aria-label={accountLabel} className='header-user' role='group'>
    <Link
      aria-label={panelLabel}
      className='header-user__profile'
      href='/panel'
    >
      <span aria-hidden='true' className='header-user__avatar'>
        {userName.charAt(0).toUpperCase()}
      </span>
      <span className='header-user__copy'>
        <small>{roleLabel}</small>
        <strong>{userName}</strong>
      </span>
    </Link>
    <button
      aria-label={logoutLabel}
      className='header-user__logout'
      onClick={() => void onLogout()}
      type='button'
    >
      <LogOut aria-hidden='true' />
    </button>
  </div>
)

export default AuthenticatedUser
