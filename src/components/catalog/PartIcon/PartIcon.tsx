'use client'

import { DynamicIcon } from 'lucide-react/dynamic'
import type { ReactNode } from 'react'

import type { CatalogIcon } from '@/features/catalog/catalog-contract'

/** Properties accepted by the reusable catalog icon. */
interface PartIconProperties {
  /** Vehicle-part concept represented by the icon. */
  readonly icon: CatalogIcon
}

/** Renders any configured Lucide icon consistently across catalog surfaces. */
const PartIcon = ({ icon }: PartIconProperties): ReactNode => (
  <DynamicIcon
    aria-hidden='true'
    className='part-icon'
    name={icon}
    strokeWidth={1.7}
  />
)

export default PartIcon
