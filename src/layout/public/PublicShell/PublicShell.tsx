import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import Footer from '@/components/navigation/Footer/Footer'
import Header from '@/components/navigation/Header/Header'

/** Properties accepted by the public site shell. */
interface PublicShellProperties {
  /** Route content rendered between the persistent header and footer. */
  readonly children: ReactNode
}

/** Provides the shared Rage Motors chrome around every route. */
const PublicShell = ({ children }: PublicShellProperties): ReactNode => {
  const translate = useTranslations('Navigation')

  return (
    <div className='site-shell'>
      <a className='site-shell__skip-link' href='#main-content'>
        {translate('skip')}
      </a>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default PublicShell
