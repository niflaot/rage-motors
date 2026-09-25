'use client'

import { DynamicIcon, iconNames } from 'lucide-react/dynamic'
import { useTranslations } from 'next-intl'
import { useDeferredValue, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import PartIcon from '@/components/catalog/PartIcon/PartIcon'
import type { CatalogIcon } from '@/features/catalog/catalog-contract'

/** Number of Lucide icons rendered on one selector page. */
const iconsPerPage = 72

/** Properties accepted by the searchable catalog icon selector. */
interface CatalogIconPickerProperties {
  /** Receives a newly selected Lucide icon name. */
  readonly onChange: (icon: CatalogIcon) => void
  /** Currently selected Lucide icon name. */
  readonly value: CatalogIcon
}

/** Makes a Lucide slug easier to read without altering its stored value. */
const formatIconName = (icon: string): string =>
  icon
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')

/** Lets staff search, browse and choose any icon shipped by Lucide. */
const CatalogIconPicker = ({
  onChange,
  value,
}: CatalogIconPickerProperties): ReactNode => {
  const translate = useTranslations('Panel')
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const filteredIcons = useMemo(
    () =>
      deferredQuery
        ? iconNames.filter((icon) => icon.includes(deferredQuery))
        : iconNames,
    [deferredQuery],
  )
  const totalPages = Math.max(1, Math.ceil(filteredIcons.length / iconsPerPage))
  const safePage = Math.min(page, totalPages - 1)
  const visibleIcons = filteredIcons.slice(
    safePage * iconsPerPage,
    (safePage + 1) * iconsPerPage,
  )

  /** Updates the query while returning pagination to its first page. */
  const updateQuery = (nextQuery: string): void => {
    setQuery(nextQuery)
    setPage(0)
  }

  /** Chooses an icon and closes the popover. */
  const chooseIcon = (icon: CatalogIcon): void => {
    onChange(icon)
    setOpen(false)
  }

  return (
    <div className='icon-picker'>
      <span className='form-field__label'>{translate('partIcon')}</span>
      <button
        aria-expanded={open}
        aria-haspopup='dialog'
        className='icon-picker__trigger'
        onClick={() => setOpen((current) => !current)}
        type='button'
      >
        <span className='icon-picker__selection'>
          <PartIcon icon={value} />
          <span>{formatIconName(value)}</span>
        </span>
        <span aria-hidden='true'>{open ? '−' : '+'}</span>
      </button>
      {open ? (
        <div
          className='icon-picker__backdrop'
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <div
            aria-label={translate('iconPickerDialog')}
            className='icon-picker__popover'
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpen(false)
            }}
            role='dialog'
          >
            <div className='icon-picker__toolbar'>
              <label className='icon-picker__search'>
                <span className='sr-only'>{translate('iconSearch')}</span>
                <input
                  autoFocus
                  onChange={(event) => updateQuery(event.target.value)}
                  placeholder={translate('iconSearchPlaceholder')}
                  type='search'
                  value={query}
                />
              </label>
              <span className='icon-picker__results' role='status'>
                {translate('iconResults', { count: filteredIcons.length })}
              </span>
            </div>
            {visibleIcons.length === 0 ? (
              <p className='icon-picker__empty'>{translate('iconEmpty')}</p>
            ) : (
              <div
                aria-label={translate('iconOptions')}
                className='icon-picker__grid'
                role='listbox'
              >
                {visibleIcons.map((icon) => (
                  <button
                    aria-label={translate('chooseIcon', {
                      name: formatIconName(icon),
                    })}
                    aria-selected={icon === value}
                    className='icon-picker__option'
                    key={icon}
                    onClick={() => chooseIcon(icon)}
                    role='option'
                    title={formatIconName(icon)}
                    type='button'
                  >
                    <DynamicIcon aria-hidden='true' name={icon} />
                  </button>
                ))}
              </div>
            )}
            <div className='icon-picker__pagination'>
              <button
                disabled={safePage === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                type='button'
              >
                {translate('previousPage')}
              </button>
              <span>
                {translate('pageCount', {
                  current: safePage + 1,
                  total: totalPages,
                })}
              </span>
              <button
                disabled={safePage >= totalPages - 1}
                onClick={() =>
                  setPage((current) => Math.min(totalPages - 1, current + 1))
                }
                type='button'
              >
                {translate('nextPage')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CatalogIconPicker
