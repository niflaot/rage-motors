import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

/** Routes repeated in the footer for quick workshop navigation. */
const footerRoutes = [
  ['home', '/'],
  ['pricing', '/precios'],
  ['location', '/ubicacion'],
  ['contact', '/contacto'],
] as const

/** Renders the workshop contact and navigation footer. */
const Footer = (): ReactNode => {
  const translate = useTranslations('Footer')
  const navigation = useTranslations('Navigation')

  return (
    <footer className='site-footer'>
      <div className='site-footer__stripe' />
      <div className='site-footer__grid'>
        <div>
          <Image
            alt='Rage Motors'
            className='site-footer__logo'
            height={724}
            sizes='180px'
            src='/assets/rage-motors-logo.png'
            width={2172}
          />
          <p>{translate('address')}</p>
        </div>
        <nav aria-label={translate('workshop')} className='site-footer__column'>
          <h2>{translate('workshop')}</h2>
          {footerRoutes.map(([key, href]) => (
            <Link href={href} key={href}>
              {navigation(key)}
            </Link>
          ))}
        </nav>
        <div className='site-footer__column'>
          <h2>{translate('services')}</h2>
          <p>{translate('servicesBody')}</p>
        </div>
        <div className='site-footer__column site-footer__column--tow'>
          <h2>{translate('tow')}</h2>
          <a href='tel:1424'>1424</a>
          <p>{translate('towBody')}</p>
        </div>
      </div>
      <div className='site-footer__bottom'>
        <span>{translate('legal')}</span>
        <span>{translate('tagline')}</span>
      </div>
    </footer>
  )
}

export default Footer
