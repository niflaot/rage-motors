import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import ContactForm from '@/view/public/contact/ContactView/parts/ContactForm'

/** Renders the public part-sale request surface. */
const ContactView = (): ReactNode => {
  const translate = useTranslations('Contact')

  return (
    <main className='contact-page viewport-page' id='main-content'>
      <header className='contact-page__heading'>
        <p className='eyebrow'>{translate('eyebrow')}</p>
        <div className='contact-page__title-row'>
          <h1>{translate('title')}</h1>
          <p>{translate('description')}</p>
        </div>
      </header>
      <ContactForm />
    </main>
  )
}

export default ContactView
