'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/** Translation identifiers and destinations for the home hero stories. */
const slides = [
  {
    key: 'workshop',
    href: '#servicios',
    image: '/assets/banners/r1.jpg',
  },
  {
    key: 'performance',
    href: '/precios#niveles',
    image: '/assets/banners/r2.jpg',
  },
  { key: 'team', href: '/ubicacion', image: '/assets/banners/r3.jpg' },
] as const

/** Interactive story carousel at the top of the home route. */
const HeroCarousel = (): ReactNode => {
  const translate = useTranslations('Home')
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % slides.length),
      7000,
    )

    return () => window.clearInterval(timer)
  }, [])

  const activeSlide = slides[activeIndex] ?? slides[0]

  /** Selects the previous carousel story and wraps at the beginning. */
  const showPrevious = (): void =>
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length)

  /** Selects the next carousel story and wraps at the end. */
  const showNext = (): void =>
    setActiveIndex((current) => (current + 1) % slides.length)

  return (
    <section
      aria-roledescription='carousel'
      className={`hero-carousel hero-carousel--${activeSlide.key}`}
      data-slide={activeSlide.key}
    >
      <div aria-hidden='true' className='hero-carousel__media'>
        <Image
          alt=''
          className='hero-carousel__media-image'
          fill
          key={activeSlide.image}
          preload={activeIndex === 0}
          sizes='100vw'
          src={activeSlide.image}
        />
      </div>
      <div aria-hidden='true' className='hero-carousel__texture' />
      <div className='hero-carousel__inner'>
        <div className='hero-carousel__copy' key={activeSlide.key}>
          <p className='eyebrow'>
            {translate(`slides.${activeSlide.key}.eyebrow`)}
          </p>
          <h1>{translate(`slides.${activeSlide.key}.title`)}</h1>
          <p className='hero-carousel__description'>
            {translate(`slides.${activeSlide.key}.description`)}
          </p>
          <Link className='button button--primary' href={activeSlide.href}>
            {translate(`slides.${activeSlide.key}.action`)}
            <span aria-hidden='true'>→</span>
          </Link>
        </div>
        <p className='hero-carousel__image-label'>
          [ {translate(`slides.${activeSlide.key}.imageLabel`)} ]
        </p>
      </div>
      <div className='hero-carousel__controls'>
        <div className='hero-carousel__dots'>
          {slides.map((slide, index) => (
            <button
              aria-label={translate('selectSlide', { number: index + 1 })}
              aria-pressed={activeIndex === index}
              key={slide.key}
              onClick={() => setActiveIndex(index)}
              type='button'
            />
          ))}
        </div>
        <span className='hero-carousel__count'>
          {String(activeIndex + 1).padStart(2, '0')} / 03
        </span>
        <div className='hero-carousel__arrows'>
          <button
            aria-label={translate('previousSlide')}
            onClick={showPrevious}
            type='button'
          >
            ←
          </button>
          <button
            aria-label={translate('nextSlide')}
            onClick={showNext}
            type='button'
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroCarousel
