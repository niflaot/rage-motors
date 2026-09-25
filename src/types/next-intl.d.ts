import type messages from '../../messages/es.json'
import type { AppLocale } from '@/i18n/locales'

declare module 'next-intl' {
  /** Type-safe locale and message definitions used by next-intl. */
  interface AppConfig {
    Locale: AppLocale
    Messages: typeof messages
  }
}
