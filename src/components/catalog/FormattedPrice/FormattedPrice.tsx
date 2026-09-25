'use client'

import { useFormatter } from 'next-intl'
import type { ReactNode } from 'react'

/** Properties accepted by the shared monetary amount renderer. */
interface FormattedPriceProperties {
  /** Numeric value rendered as a whole-dollar amount. */
  readonly value: number
}

/** Renders Rage Motors prices consistently with Spanish digit grouping. */
const FormattedPrice = ({ value }: FormattedPriceProperties): ReactNode => {
  const format = useFormatter()

  return (
    <>
      $
      {format.number(value, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        useGrouping: true,
      })}
    </>
  )
}

export default FormattedPrice
