import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { getStaffSession } from '@/lib/auth/auth-server'
import PanelView from '@/view/staff/panel/PanelView/PanelView'

/** Prevents the private staff entry point from being indexed or followed. */
export const metadata: Metadata = {
  robots: { follow: false, index: false },
}

/** Renders the staff route with a server-validated Better Auth session. */
const PanelPage = async (): Promise<ReactNode> => {
  const authConfigured = Boolean(process.env.RAGE_API_URL)
  const result = authConfigured
    ? await getStaffSession()
    : { accessDenied: false, session: null }

  return (
    <PanelView
      accessDenied={result.accessDenied}
      authConfigured={authConfigured}
      session={result.session}
    />
  )
}

export default PanelPage
