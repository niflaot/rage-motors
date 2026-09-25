import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

/** Service rows shown in the workshop pricing table. */
const serviceKeys = ['repairs', 'paint', 'oil', 'tint'] as const

/** Upgrade categories that share the same three price levels. */
const upgradeCategories = [
  { key: 'nos', prices: ['$10.000', '$20.000', '$30.000'] },
  { key: 'gps', prices: ['$5.000', '$7.500', '$10.000'] },
  { key: 'ignition', prices: ['$5.000', '$7.500', '$10.000'] },
  { key: 'locks', prices: ['$5.000', '$7.500', '$10.000'] },
] as const

/** Renders all published workshop rates in one desktop viewport. */
const PricingView = (): ReactNode => {
  const translate = useTranslations('Pricing')

  return (
    <main className='pricing-page viewport-page' id='main-content'>
      <header className='pricing-page__heading'>
        <div>
          <p className='eyebrow'>{translate('eyebrow')}</p>
          <h1>{translate('title')}</h1>
        </div>
        <p>{translate('description')}</p>
      </header>
      <section className='price-highlights'>
        {(['popular', 'power', 'tow'] as const).map((key) => (
          <article className='price-highlights__item' key={key}>
            <p>{translate(`${key}Label`)}</p>
            <strong>{translate(`${key}Value`)}</strong>
            <span>{translate(`${key}Description`)}</span>
          </article>
        ))}
      </section>
      <div className='pricing-page__tables'>
        <section className='price-section'>
          <div className='section-title section-title--compact'>
            <span>01</span>
            <h2>{translate('workshopTitle')}</h2>
          </div>
          <div className='service-prices'>
            {serviceKeys.map((key) => (
              <article className='service-prices__item' key={key}>
                <div>
                  <h3>{translate(`services.${key}.name`)}</h3>
                  <p>{translate(`services.${key}.detail`)}</p>
                </div>
                <strong>{translate(`services.${key}.price`)}</strong>
              </article>
            ))}
          </div>
        </section>
        <section className='price-section' id='niveles'>
          <div className='section-title section-title--compact'>
            <span>02</span>
            <h2>{translate('levelsTitle')}</h2>
          </div>
          <p className='price-section__description'>
            {translate('levelsDescription')}
          </p>
          <div className='upgrade-prices'>
            {upgradeCategories.map((category) => (
              <article className='upgrade-prices__item' key={category.key}>
                <h3>{translate(`categories.${category.key}`)}</h3>
                <dl>
                  {category.prices.map((price, index) => (
                    <div key={price}>
                      <dt>{translate('level', { number: index + 1 })}</dt>
                      <dd>{price}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default PricingView
