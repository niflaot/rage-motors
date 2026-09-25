'use client'

import type { ReactNode } from 'react'

import FormattedPrice from '@/components/catalog/FormattedPrice/FormattedPrice'
import PartIcon from '@/components/catalog/PartIcon/PartIcon'
import type { CatalogPart } from '@/features/catalog/catalog-contract'

/** Properties accepted by the compact catalog quantity list. */
interface PartQuantityListProperties {
  /** Localized accessible label for increasing a quantity. */
  readonly addLabel: string
  /** Pieces available for selection. */
  readonly catalog: readonly CatalogPart[]
  /** Localized message shown when no catalog has been configured. */
  readonly emptyMessage: string
  /** Updates one selected quantity, removing the item at zero. */
  readonly onQuantityChange: (partId: string, quantity: number) => void
  /** Quantity selected for each catalog identifier. */
  readonly quantities: Readonly<Record<string, number>>
  /** Localized accessible label for decreasing a quantity. */
  readonly removeLabel: string
  /** Localized accessible label for selecting a list row. */
  readonly selectLabel: string
}

/** Displays catalog pieces as compact rows with persistent quantity controls. */
const PartQuantityList = ({
  addLabel,
  catalog,
  emptyMessage,
  onQuantityChange,
  quantities,
  removeLabel,
  selectLabel,
}: PartQuantityListProperties): ReactNode => {
  if (catalog.length === 0) {
    return <p className='parts-picker__empty'>{emptyMessage}</p>
  }

  return (
    <div className='parts-picker__grid'>
      {catalog.map((part) => {
        const quantity = quantities[part.id] ?? 0

        return (
          <article
            className={[
              'parts-picker__item',
              quantity > 0 && 'parts-picker__item--selected',
            ]
              .filter(Boolean)
              .join(' ')}
            key={part.id}
          >
            <button
              aria-label={`${selectLabel} ${part.name}`}
              aria-pressed={quantity > 0}
              className='parts-picker__select'
              onClick={() => onQuantityChange(part.id, quantity + 1)}
              type='button'
            >
              <span className='parts-picker__icon'>
                <PartIcon icon={part.icon} />
              </span>
              <span className='parts-picker__name'>{part.name}</span>
              <span className='parts-picker__price'>
                <FormattedPrice value={part.salePrice * 0.5} />
              </span>
            </button>
            <div className='parts-picker__quantity'>
              <button
                aria-label={`${removeLabel} ${part.name}`}
                disabled={quantity === 0}
                onClick={() => onQuantityChange(part.id, quantity - 1)}
                type='button'
              >
                −
              </button>
              <output aria-label={`${part.name}: ${quantity}`}>
                {quantity}
              </output>
              <button
                aria-label={`${addLabel} ${part.name}`}
                onClick={() => onQuantityChange(part.id, quantity + 1)}
                type='button'
              >
                +
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default PartQuantityList
