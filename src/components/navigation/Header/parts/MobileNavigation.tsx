import Link from 'next/link'
import type { ReactNode } from 'react'

import type { NavigationItem } from '@/components/navigation/Header/parts/DesktopNavigation'

/** Properties accepted by the mobile navigation drawer. */
interface MobileNavigationProperties {
  /** Localized accessible name for the drawer. */
  readonly ariaLabel: string
  /** Whether the drawer is currently visible. */
  readonly open: boolean
  /** Destinations displayed in the drawer. */
  readonly items: readonly NavigationItem[]
  /** Current pathname used to expose the active destination. */
  readonly pathname: string
  /** Closes the drawer after selecting a destination. */
  readonly onClose: () => void
}

/** Renders the compact route drawer for small viewports. */
const MobileNavigation = ({
  ariaLabel,
  items,
  onClose,
  open,
  pathname,
}: MobileNavigationProperties): ReactNode => (
  <nav
    aria-label={ariaLabel}
    aria-hidden={!open}
    className={['mobile-navigation', open && 'mobile-navigation--open']
      .filter(Boolean)
      .join(' ')}
  >
    {items.map((item) => (
      <Link
        aria-current={item.href === pathname ? 'page' : undefined}
        className={[
          'mobile-navigation__link',
          item.href === pathname && 'mobile-navigation__link--active',
        ]
          .filter(Boolean)
          .join(' ')}
        href={item.href}
        key={item.href}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      >
        {item.label}
      </Link>
    ))}
  </nav>
)

export default MobileNavigation
