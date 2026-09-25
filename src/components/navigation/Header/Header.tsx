'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import DesktopNavigation from '@/components/navigation/Header/parts/DesktopNavigation'
import AuthenticatedUser from '@/components/navigation/Header/parts/AuthenticatedUser'
import MobileNavigation from '@/components/navigation/Header/parts/MobileNavigation'
import { authClient } from '@/lib/auth/auth-client'

/** Builds translated destinations shown by both header variants. */
const useNavigationItems = (): readonly {
  readonly href: string
  readonly label: string
}[] => {
  const translate = useTranslations('Navigation')

  return [
    { href: '/', label: translate('home') },
    { href: '/ubicacion', label: translate('location') },
    { href: '/precios', label: translate('pricing') },
    { href: '/contacto', label: translate('contact') },
  ]
}

/** Renders the responsive, route-aware workshop header. */
const Header = (): ReactNode => {
  const pathname = usePathname()
  const translate = useTranslations('Navigation')
  const items = useNavigationItems()
  const { data: session } = authClient.useSession()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    /** Synchronizes the header treatment with the current scroll position. */
    const updateScrolled = (): void => setScrolled(window.scrollY > 24)

    updateScrolled()
    window.addEventListener('scroll', updateScrolled, { passive: true })

    return () => window.removeEventListener('scroll', updateScrolled)
  }, [])

  /** Ends the session and refreshes server-rendered protected content. */
  const logout = async (): Promise<void> => {
    await authClient.signOut()
    window.location.reload()
  }

  /** Account control shown only after Better Auth confirms a user. */
  const authenticatedUser = session?.user ? (
    <AuthenticatedUser
      accountLabel={translate('accountLabel')}
      logoutLabel={translate('logout')}
      onLogout={logout}
      panelLabel={translate('openPanel', { name: session.user.name })}
      roleLabel={translate('accountRole')}
      userName={session.user.name}
    />
  ) : null

  return (
    <header
      className={['site-header', scrolled && 'site-header--scrolled']
        .filter(Boolean)
        .join(' ')}
    >
      <div className='site-header__inner'>
        <DesktopNavigation
          ariaLabel={translate('primaryLabel')}
          items={items.slice(0, 2)}
          pathname={pathname}
        />
        <Link aria-label='Rage Motors' className='site-header__brand' href='/'>
          <Image
            alt='Rage Motors'
            height={724}
            loading='eager'
            sizes='(max-width: 767px) 148px, 210px'
            src='/assets/rage-motors-logo.png'
            width={2172}
          />
        </Link>
        <div className='site-header__end'>
          <DesktopNavigation
            ariaLabel={translate('primaryLabel')}
            items={items.slice(2)}
            pathname={pathname}
          />
          <a
            aria-label={translate('workshopPhone')}
            className='site-header__phone'
            href='tel:1424'
          >
            <span aria-hidden='true' />
            1424
          </a>
          {authenticatedUser}
        </div>
        <div className='site-header__mobile-actions'>
          {authenticatedUser}
          <button
            aria-expanded={open}
            aria-label={translate(open ? 'closeMenu' : 'openMenu')}
            className='site-header__menu-button'
            onClick={() => setOpen((current) => !current)}
            type='button'
          >
            <span aria-hidden='true' />
            <span aria-hidden='true' />
          </button>
        </div>
      </div>
      <MobileNavigation
        items={items}
        ariaLabel={translate('mobileLabel')}
        onClose={() => setOpen(false)}
        open={open}
        pathname={pathname}
      />
    </header>
  )
}

export default Header
