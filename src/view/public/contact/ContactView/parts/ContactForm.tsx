'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

import FormattedPrice from '@/components/catalog/FormattedPrice/FormattedPrice'
import PartQuantityList from '@/components/catalog/PartQuantityList/PartQuantityList'
import TextAreaField from '@/components/forms/TextAreaField/TextAreaField'
import TextInputField from '@/components/forms/TextInputField/TextInputField'
import { getCatalog } from '@/features/catalog/catalog-api'
import type { CatalogPart } from '@/features/catalog/catalog-contract'
import { addWorkshopRequest } from '@/features/requests/request-api'
import {
  type WorkshopRequestInput,
  workshopRequestInputSchema,
} from '@/features/requests/request-contract'

/** Form fields that can surface an accessible validation message. */
type ContactField = 'phone' | 'details' | 'parts'

/** Local validation messages keyed by form field. */
type ContactErrors = Partial<Readonly<Record<ContactField, string>>>

/** Initial text values for a fresh public parts request. */
const initialValues = { details: '', name: '', phone: '' } as const

/** Validates and persists part-sale requests through the PostgreSQL API. */
const ContactForm = (): ReactNode => {
  const translate = useTranslations('Contact')
  const [catalog, setCatalog] = useState<readonly CatalogPart[]>([])
  const [values, setValues] = useState(initialValues)
  const [quantities, setQuantities] = useState<
    Readonly<Record<string, number>>
  >({})
  const [errors, setErrors] = useState<ContactErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [serviceError, setServiceError] = useState(false)

  /** Total number of individual pieces included in the current offer. */
  const selectedPartCount = Object.values(quantities).reduce(
    (total, quantity) => total + quantity,
    0,
  )

  /** Estimated payout using the server's 50 percent catalog rule. */
  const estimatedSubtotal = catalog.reduce((total, part) => {
    const quantity = quantities[part.id] ?? 0
    return total + Math.round(part.salePrice * 0.5) * quantity
  }, 0)

  useEffect(() => {
    let active = true

    /** Loads the current public catalog from PostgreSQL through the API. */
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

  /** Updates one text value and clears the previous success state. */
  const updateValue = (
    key: keyof typeof initialValues,
    value: string,
  ): void => {
    setValues((current) => ({ ...current, [key]: value }))
    setSubmitted(false)
  }

  /** Adds, changes, or removes a selected catalog quantity. */
  const updateQuantity = (partId: string, quantity: number): void => {
    setQuantities((current) => {
      const next = { ...current }
      if (quantity <= 0) delete next[partId]
      else next[partId] = Math.min(quantity, 99)
      return next
    })
    setErrors((current) => {
      const next = { ...current }
      delete next.parts
      return next
    })
    setSubmitted(false)
  }

  /** Builds a validated request snapshot from current catalog selections. */
  const buildRequest = (): WorkshopRequestInput => ({
    ...values,
    parts: catalog.flatMap((part) => {
      const quantity = quantities[part.id] ?? 0
      return quantity > 0 ? [{ partId: part.id, quantity }] : []
    }),
  })

  /** Validates the parts request, persists it, and resets the form. */
  const submitRequest = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault()
    const result = workshopRequestInputSchema.safeParse(buildRequest())

    if (!result.success) {
      const fields = result.error.flatten().fieldErrors
      setErrors({
        ...(fields.phone ? { phone: translate('errors.phone') } : {}),
        ...(fields.details ? { details: translate('errors.details') } : {}),
        ...(fields.parts ? { parts: translate('errors.parts') } : {}),
      })
      return
    }

    setPending(true)
    setServiceError(false)
    try {
      await addWorkshopRequest(result.data)
      setValues(initialValues)
      setQuantities({})
      setErrors({})
      setSubmitted(true)
    } catch {
      setServiceError(true)
    } finally {
      setPending(false)
    }
  }

  return (
    <form className='parts-form' noValidate onSubmit={submitRequest}>
      <fieldset className='parts-form__catalog'>
        <legend>{translate('partsLabel')}</legend>
        <PartQuantityList
          addLabel={translate('addPart')}
          catalog={catalog}
          emptyMessage={translate(loading ? 'catalogLoading' : 'catalogEmpty')}
          onQuantityChange={updateQuantity}
          quantities={quantities}
          removeLabel={translate('removePart')}
          selectLabel={translate('selectPart')}
        />
        <p aria-live='polite' className='form-field__error'>
          {errors.parts}
        </p>
        <div aria-live='polite' className='parts-form__catalog-summary'>
          <div>
            <span>{translate('estimatedSubtotal')}</span>
            <small>
              {translate('selectedParts', { count: selectedPartCount })}
            </small>
          </div>
          <strong>
            <FormattedPrice value={estimatedSubtotal} />
          </strong>
        </div>
      </fieldset>
      <div className='parts-form__fields'>
        <TextInputField
          autoComplete='name'
          id='request-name'
          label={translate('nameLabel')}
          labelHint={translate('nameHint')}
          maxLength={80}
          onChange={(event) => updateValue('name', event.target.value)}
          placeholder={translate('namePlaceholder')}
          value={values.name}
        />
        <TextInputField
          autoComplete='tel'
          error={errors.phone}
          id='request-phone'
          label={translate('phoneLabel')}
          onChange={(event) => updateValue('phone', event.target.value)}
          placeholder={translate('phonePlaceholder')}
          value={values.phone}
        />
        <TextAreaField
          containerClassName='form-field--wide'
          error={errors.details}
          id='request-details'
          label={translate('detailsLabel')}
          maxLength={600}
          onChange={(event) => updateValue('details', event.target.value)}
          placeholder={translate('detailsPlaceholder')}
          rows={2}
          value={values.details}
        />
        <div className='parts-form__actions'>
          <button
            className='button button--primary parts-form__submit'
            disabled={
              catalog.length === 0 ||
              selectedPartCount === 0 ||
              loading ||
              pending
            }
            type='submit'
          >
            {translate(pending ? 'submitting' : 'submit')}{' '}
            <span aria-hidden='true'>→</span>
          </button>
        </div>
        <p aria-live='polite' className='parts-form__success'>
          {submitted ? translate('success') : ''}
        </p>
        <p aria-live='polite' className='form-field__error'>
          {serviceError ? translate('serviceError') : ''}
        </p>
      </div>
    </form>
  )
}

export default ContactForm
