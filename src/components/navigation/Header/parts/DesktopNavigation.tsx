import Link from 'next/link'
import type { ReactNode } from 'react'

/** A translated navigation destination rendered by the desktop header. */
export interface NavigationItem {
  /** Localized destination label. */
  readonly label: string
  /** Route used by Next.js navigation. */
  readonly href: string
}

/** Properties accepted by the desktop navigation group. */
interface DesktopNavigationProperties {
  /** Localized accessible name for this navigation group. */
  readonly ariaLabel: string
  /** Destinations to render in this side of the header. */
  readonly items: readonly NavigationItem[]
  /** Current pathname used to expose the active destination. */
  readonly pathname: string
}

/** Renders an accessible group of desktop route links. */
const DesktopNavigation = ({
  ariaLabel,
  items,
  pathname,
}: DesktopNavigationProperties): ReactNode => (
  <nav aria-label={ariaLabel} className='desktop-navigation'>
    {items.map((item) => {
      const active = item.href === pathname

      return (
        <Link
          aria-current={active ? 'page' : undefined}
          className={[
            'desktop-navigation__link',
            active && 'desktop-navigation__link--active',
          ]
            .filter(Boolean)
            .join(' ')}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      )
    })}
  </nav>
)

export default DesktopNavigation
