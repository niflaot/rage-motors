/** Locales supported by the application message catalogs. */
export const locales = ['es'] as const

/** Union of every locale supported by the application. */
export type AppLocale = (typeof locales)[number]

/** Locale used when the request has no supported preference. */
export const defaultLocale: AppLocale = 'es'

/** Cookie used to persist a locale without changing the URL. */
export const localeCookieName = 'locale'

/** Checks whether an unknown value is a supported application locale. */
export const isAppLocale = (value: unknown): value is AppLocale =>
  typeof value === 'string' && locales.some((locale) => locale === value)
