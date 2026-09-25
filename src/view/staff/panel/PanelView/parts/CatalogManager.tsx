'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

import CatalogIconPicker from '@/components/catalog/CatalogIconPicker/CatalogIconPicker'
import FormattedPrice from '@/components/catalog/FormattedPrice/FormattedPrice'
import PartIcon from '@/components/catalog/PartIcon/PartIcon'
import TextInputField from '@/components/forms/TextInputField/TextInputField'
import {
  addCatalogPart,
  deleteCatalogPart,
  getCatalog,
} from '@/features/catalog/catalog-api'
import {
  catalogPartInputSchema,
  type CatalogIcon,
  type CatalogPart,
} from '@/features/catalog/catalog-contract'

/** Maximum pieces shown in the no-scroll desktop selector. */
const maximumCatalogParts = 8

/** Local errors surfaced by the catalog form. */
interface CatalogErrors {
  /** Validation message for a missing part name. */
  readonly name?: string
  /** Validation message for an invalid sale price. */
  readonly salePrice?: string
}

/** Validates and maintains the PostgreSQL-backed staff buying catalog. */
const CatalogManager = (): ReactNode => {
  const translate = useTranslations('Panel')
  const [catalog, setCatalog] = useState<readonly CatalogPart[]>([])
  const [partName, setPartName] = useState('')
  const [partPrice, setPartPrice] = useState('')
  const [partIcon, setPartIcon] = useState<CatalogIcon>('cog')
  const [errors, setErrors] = useState<CatalogErrors>({})
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [serviceError, setServiceError] = useState(false)

  useEffect(() => {
    let active = true

    /** Loads the canonical catalog without reading browser persistence. */
    const loadCatalog = async (): Promise<void> => {
      try {
        const parts = await getCatalog()
        if (active) setCatalog(parts)
      } catch {
        if (active) setServiceError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadCatalog()
    return () => {
      active = false
    }
  }, [])

  /** Validates and adds one part to the PostgreSQL buying catalog. */
  const addPart = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (catalog.length >= maximumCatalogParts || pending) return

    const result = catalogPartInputSchema.safeParse({
      icon: partIcon,
      name: partName,
      salePrice: partPrice,
    })

    if (!result.success) {
      const fields = result.error.flatten().fieldErrors
      setErrors({
        ...(fields.name ? { name: translate('errors.partName') } : {}),
        ...(fields.salePrice
          ? { salePrice: translate('errors.partPrice') }
          : {}),
      })
      return
    }

    setPending(true)
    setServiceError(false)
    try {
      const created = await addCatalogPart(result.data)
      setCatalog((current) => [...current, created])
      setPartName('')
      setPartPrice('')
      setErrors({})
    } catch {
      setServiceError(true)
    } finally {
      setPending(false)
    }
  }

  /** Removes one part from the PostgreSQL buying catalog. */
  const removePart = async (id: string): Promise<void> => {
    setServiceError(false)
    try {
      await deleteCatalogPart(id)
      setCatalog((current) => current.filter((part) => part.id !== id))
    } catch {
      setServiceError(true)
    }
  }

  return (
    <section className='panel-section'>
      <div className='panel-section__heading'>
        <div>
          <h2>{translate('catalogTitle')}</h2>
          <p>{translate('catalogDescription')}</p>
        </div>
        <span className='panel-section__count'>
          {catalog.length}/{maximumCatalogParts}
        </span>
      </div>
      <form className='catalog-editor' noValidate onSubmit={addPart}>
        <CatalogIconPicker onChange={setPartIcon} value={partIcon} />
        <TextInputField
          error={errors.name}
          id='part-name'
          label={translate('partName')}
          onChange={(event) => setPartName(event.target.value)}
          placeholder={translate('partNamePlaceholder')}
          value={partName}
        />
        <TextInputField
          error={errors.salePrice}
          id='part-price'
          inputMode='numeric'
          label={translate('partPrice')}
          onChange={(event) => setPartPrice(event.target.value)}
          placeholder={translate('partPricePlaceholder')}
          value={partPrice}
        />
        <button
          className='button button--primary catalog-editor__submit'
          disabled={catalog.length >= maximumCatalogParts || pending}
          type='submit'
        >
          {translate(
            catalog.length >= maximumCatalogParts ? 'catalogFull' : 'addPart',
          )}
        </button>
      </form>
      {serviceError && (
        <p aria-live='polite' className='panel-section__error'>
          {translate('serviceError')}
        </p>
      )}
      {loading ? (
        <p className='panel-section__empty'>{translate('loading')}</p>
      ) : catalog.length === 0 ? (
        <p className='panel-section__empty'>{translate('catalogEmpty')}</p>
      ) : (
        <div className='catalog-list'>
          {catalog.map((part) => (
            <article className='catalog-list__item' key={part.id}>
              <span className='catalog-list__icon'>
                <PartIcon icon={part.icon} />
              </span>
              <div className='catalog-list__copy'>
                <h3>{part.name}</h3>
                <span>
                  <FormattedPrice value={part.salePrice} />
                </span>
              </div>
              <strong className='catalog-list__offer'>
                {translate('offer')}:{' '}
                <FormattedPrice value={part.salePrice * 0.5} />
              </strong>
              <button
                aria-label={`${translate('remove')} ${part.name}`}
                className='catalog-list__remove'
                onClick={() => void removePart(part.id)}
                type='button'
              >
                ×
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default CatalogManager
