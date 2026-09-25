import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed, JetBrains_Mono } from 'next/font/google'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import BaseLayout from '@/layout/base/BaseLayout/BaseLayout'

import './globals.css'

/** Body typeface used for long-form copy and interface labels. */
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

/** Condensed display typeface used for Rage Motors headings. */
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

/** Monospace typeface used for prices and operational details. */
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

/** Builds localized metadata for the application shell. */
export const generateMetadata = async (): Promise<Metadata> => {
  const translate = await getTranslations('Metadata')

  return {
    title: translate('title'),
    description: translate('description'),
  }
}

/** Provides the required document tags and delegates provider composition. */
const RootLayout = async ({
  children,
}: LayoutProps<'/'>): Promise<ReactNode> => {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      className={`${barlow.variable} ${barlowCondensed.variable} ${jetBrainsMono.variable}`}
      lang={locale}
    >
      <body>
        <BaseLayout locale={locale} messages={messages}>
          {children}
        </BaseLayout>
      </body>
    </html>
  )
}

export default RootLayout
