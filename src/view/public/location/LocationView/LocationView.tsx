import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

/** Renders the workshop location, landmarks and towing details. */
const LocationView = (): ReactNode => {
  const translate = useTranslations('Location')

  return (
    <main className='location-page viewport-page' id='main-content'>
      <header className='location-page__heading'>
        <p className='eyebrow'>{translate('eyebrow')}</p>
        <h1>{translate('title')}</h1>
      </header>
      <section className='location-page__content'>
        <div className='location-map'>
          <Image
            alt={translate('mapLabel')}
            className='location-map__image'
            fill
            preload
            sizes='(max-width: 960px) calc(100vw - 2rem), 54vw'
            src='/assets/banners/c.png'
          />
          <span className='location-map__coordinate'>Idlewood / LS</span>
        </div>
        <div className='location-page__details'>
          <article className='location-card location-card--accent'>
            <span aria-hidden='true' className='location-card__mark'>
              ⌖
            </span>
            <div>
              <h2>{translate('addressLabel')}</h2>
              <p>{translate('address')}</p>
            </div>
          </article>
          <article className='location-card'>
            <span aria-hidden='true' className='location-card__mark'>
              ↳
            </span>
            <div>
              <h2>{translate('referencesLabel')}</h2>
              <p>{translate('references')}</p>
            </div>
          </article>
          <div className='location-page__minor-grid'>
            <article className='location-card'>
              <div>
                <h2>{translate('scheduleLabel')}</h2>
                <p>{translate('schedule')}</p>
              </div>
            </article>
            <article className='location-card'>
              <div>
                <h2>{translate('towLabel')}</h2>
                <a href='tel:1424'>1424</a>
                <p>{translate('towPrice')}</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LocationView
