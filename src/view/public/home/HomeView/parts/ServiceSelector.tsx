'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'

/** Service definitions rendered around the workshop HUD. */
const services = [
  { key: 'mechanics', icon: '🔧' },
  { key: 'performance', icon: '⚙' },
  { key: 'paint', icon: '✦' },
  { key: 'security', icon: '◆' },
  { key: 'tow', icon: '↗' },
] as const

/** Browser key used to remember the visitor's selected service. */
const serviceSelectionStorageKey = 'rage-motors.service-selection.v1'

/** Same-tab event emitted after the visitor selects a service. */
const serviceSelectionEvent = 'rage-motors:service-selection'

/** In-memory fallback for browsers that block local storage. */
let serviceSelectionFallback = 0

/** Reads a valid stored service index or falls back to the first service. */
const readServiceSelection = (): number => {
  try {
    const storedIndex = Number.parseInt(
      window.localStorage.getItem(serviceSelectionStorageKey) ?? '',
      10,
    )

    return storedIndex >= 0 && storedIndex < services.length
      ? storedIndex
      : serviceSelectionFallback
  } catch {
    return serviceSelectionFallback
  }
}

/** Subscribes React to same-tab selections and cross-tab storage changes. */
const subscribeToServiceSelection = (
  onStoreChange: () => void,
): (() => void) => {
  window.addEventListener(serviceSelectionEvent, onStoreChange)
  window.addEventListener('storage', onStoreChange)

  return () => {
    window.removeEventListener(serviceSelectionEvent, onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

/** Persists a selection and informs subscribers in the current tab. */
const writeServiceSelection = (index: number): void => {
  serviceSelectionFallback = index

  try {
    window.localStorage.setItem(serviceSelectionStorageKey, String(index))
  } catch {
    // The selector remains usable in privacy-restricted browser contexts.
  }

  window.dispatchEvent(new Event(serviceSelectionEvent))
}

/** Lets visitors inspect one service without leaving the home route. */
const ServiceSelector = (): ReactNode => {
  const translate = useTranslations('Home')
  const selectedIndex = useSyncExternalStore(
    subscribeToServiceSelection,
    readServiceSelection,
    () => 0,
  )
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const activeIndex = previewIndex ?? selectedIndex
  const activeService = services[activeIndex] ?? services[0]

  /** Selects and persists a service independently from hover previews. */
  const selectService = (index: number): void => {
    writeServiceSelection(index)
  }

  return (
    <section className='service-showcase section' id='servicios'>
      <div className='section-title'>
        <span>{translate('servicesEyebrow')}</span>
        <h2>{translate('servicesTitle')}</h2>
      </div>
      <div className='service-showcase__grid'>
        <div
          className={`service-orbit service-orbit--position-${activeIndex + 1}`}
          onMouseLeave={() => setPreviewIndex(null)}
        >
          <div className='service-orbit__track'>
            <div
              aria-hidden='true'
              className='service-orbit__ring service-orbit__ring--outer'
            />
            <div
              aria-hidden='true'
              className='service-orbit__ring service-orbit__ring--inner'
            />
            <div aria-hidden='true' className='service-orbit__indicator' />
          </div>
          {services.map((service, index) => (
            <button
              aria-label={translate(`services.${service.key}.title`)}
              aria-pressed={index === selectedIndex}
              className={[
                'service-orbit__button',
                `service-orbit__button--${index + 1}`,
                index === activeIndex && 'service-orbit__button--active',
              ]
                .filter(Boolean)
                .join(' ')}
              key={service.key}
              onBlur={() => setPreviewIndex(null)}
              onClick={() => selectService(index)}
              onFocus={() => setPreviewIndex(index)}
              onMouseEnter={() => setPreviewIndex(index)}
              type='button'
            >
              <span aria-hidden='true'>{service.icon}</span>
            </button>
          ))}
          <div className='service-orbit__center' key={activeService.key}>
            <span aria-hidden='true'>{activeService.icon}</span>
            <strong>{translate(`services.${activeService.key}.title`)}</strong>
            <small>{translate(`services.${activeService.key}.tag`)}</small>
          </div>
        </div>
        <article className='service-detail'>
          <p className='service-detail__overline'>
            {translate('servicesHint')}
          </p>
          <div>
            <h3>{translate(`services.${activeService.key}.title`)}</h3>
            <p>{translate(`services.${activeService.key}.description`)}</p>
            <strong>{translate(`services.${activeService.key}.price`)}</strong>
          </div>
          <ul className='service-detail__chips'>
            <li>{translate(`services.${activeService.key}.chipA`)}</li>
            <li>{translate(`services.${activeService.key}.chipB`)}</li>
          </ul>
          <Link className='button button--outline' href='/precios'>
            {translate('bookService')}
          </Link>
        </article>
      </div>
    </section>
  )
}

export default ServiceSelector
