import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import HeroCarousel from '@/view/public/home/HomeView/parts/HeroCarousel'
import ServiceSelector from '@/view/public/home/HomeView/parts/ServiceSelector'

/** Renders the complete public Rage Motors home route. */
const HomeView = (): ReactNode => {
  const translate = useTranslations('Home')

  return (
    <main id='main-content'>
      <HeroCarousel />
      <ServiceSelector />
      <section className='tow-banner'>
        <div>
          <p className='eyebrow'>{translate('towEyebrow')}</p>
          <h2>{translate('towTitle')}</h2>
          <p>{translate('towDescription')}</p>
        </div>
        <div className='tow-banner__actions'>
          <a className='tow-banner__phone' href='tel:1424'>
            1424
          </a>
        </div>
      </section>
    </main>
  )
}

export default HomeView
