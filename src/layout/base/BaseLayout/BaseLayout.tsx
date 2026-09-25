import { NextIntlClientProvider } from 'next-intl'
import type { Messages } from 'next-intl'
import type { ReactNode } from 'react'

import type { AppLocale } from '@/i18n/locales'
import PublicShell from '@/layout/public/PublicShell/PublicShell'

/** Properties accepted by the shared application layout. */
interface BaseLayoutProperties {
  /** Route content rendered inside the global providers. */
  readonly children: ReactNode
  /** Validated locale resolved for the current request. */
  readonly locale: AppLocale
  /** Translation messages resolved for the current request. */
  readonly messages: Messages
}

/** Composes providers shared by every application route. */
const BaseLayout = ({
  children,
  locale,
  messages,
}: BaseLayoutProperties): ReactNode => (
  <NextIntlClientProvider locale={locale} messages={messages}>
    <PublicShell>{children}</PublicShell>
  </NextIntlClientProvider>
)

export default BaseLayout
