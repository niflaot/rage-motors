'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import CatalogManager from '@/view/staff/panel/PanelView/parts/CatalogManager'
import RequestQueue from '@/view/staff/panel/PanelView/parts/RequestQueue'

/** Staff workspace sections exposed as accessible tabs. */
type PanelTab = 'requests' | 'catalog'

/** Composes the authenticated workshop tools behind accessible tabs. */
const PanelDashboard = (): ReactNode => {
  const translate = useTranslations('Panel')
  const [activeTab, setActiveTab] = useState<PanelTab>('requests')

  /** Moves between the two tabs with horizontal arrow keys. */
  const navigateTabs = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const nextTab: PanelTab = activeTab === 'requests' ? 'catalog' : 'requests'
    setActiveTab(nextTab)
    document.querySelector<HTMLButtonElement>(`#panel-tab-${nextTab}`)?.focus()
  }

  return (
    <div className='panel-dashboard'>
      <div
        aria-label={translate('tabsLabel')}
        className='panel-tabs'
        role='tablist'
      >
        <button
          aria-controls='panel-requests'
          aria-selected={activeTab === 'requests'}
          className='panel-tabs__button'
          id='panel-tab-requests'
          onClick={() => setActiveTab('requests')}
          onKeyDown={navigateTabs}
          role='tab'
          tabIndex={activeTab === 'requests' ? 0 : -1}
          type='button'
        >
          <span>01</span>
          {translate('requestsTab')}
        </button>
        <button
          aria-controls='panel-catalog'
          aria-selected={activeTab === 'catalog'}
          className='panel-tabs__button'
          id='panel-tab-catalog'
          onClick={() => setActiveTab('catalog')}
          onKeyDown={navigateTabs}
          role='tab'
          tabIndex={activeTab === 'catalog' ? 0 : -1}
          type='button'
        >
          <span>02</span>
          {translate('catalogTab')}
        </button>
      </div>
      <div
        aria-labelledby={`panel-tab-${activeTab}`}
        className='panel-dashboard__content'
        id={`panel-${activeTab}`}
        role='tabpanel'
      >
        {activeTab === 'requests' ? <RequestQueue /> : <CatalogManager />}
      </div>
    </div>
  )
}

export default PanelDashboard
