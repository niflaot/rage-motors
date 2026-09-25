'use client'

import { useFormatter, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import PartIcon from '@/components/catalog/PartIcon/PartIcon'
import {
  deleteWorkshopRequest,
  getWorkshopRequests,
  updateWorkshopRequest,
} from '@/features/requests/request-api'
import type { WorkshopRequest } from '@/features/requests/request-contract'

/** Renders and updates PostgreSQL-backed incoming parts requests. */
const RequestQueue = (): ReactNode => {
  const translate = useTranslations('Panel')
  const format = useFormatter()
  const [requests, setRequests] = useState<readonly WorkshopRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceError, setServiceError] = useState(false)

  useEffect(() => {
    let active = true

    /** Loads the operational queue from the protected API. */
    const loadRequests = async (): Promise<void> => {
      try {
        const loadedRequests = await getWorkshopRequests()
        if (active) setRequests(loadedRequests)
      } catch {
        if (active) setServiceError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadRequests()
    return () => {
      active = false
    }
  }, [])

  /** Toggles the operational completion state for one request. */
  const toggleRequest = async (id: string): Promise<void> => {
    const selected = requests.find((request) => request.id === id)
    if (!selected) return
    setServiceError(false)
    try {
      await updateWorkshopRequest(id, !selected.completed)
      setRequests((current) =>
        current.map((request) =>
          request.id === id
            ? { ...request, completed: !request.completed }
            : request,
        ),
      )
    } catch {
      setServiceError(true)
    }
  }

  /** Removes one request from the PostgreSQL operational queue. */
  const removeRequest = async (id: string): Promise<void> => {
    setServiceError(false)
    try {
      await deleteWorkshopRequest(id)
      setRequests((current) => current.filter((request) => request.id !== id))
    } catch {
      setServiceError(true)
    }
  }

  return (
    <section className='panel-section'>
      <div className='panel-section__heading'>
        <h2>{translate('requestsTitle')}</h2>
        <span className='panel-section__count'>
          {requests.filter((request) => !request.completed).length}
        </span>
      </div>
      {serviceError && (
        <p aria-live='polite' className='panel-section__error'>
          {translate('serviceError')}
        </p>
      )}
      {loading ? (
        <p className='panel-section__empty'>{translate('loading')}</p>
      ) : requests.length === 0 ? (
        <p className='panel-section__empty'>{translate('requestsEmpty')}</p>
      ) : (
        <div className='request-list'>
          {requests.map((request) => (
            <article
              className={[
                'request-card',
                request.completed && 'request-card--done',
              ]
                .filter(Boolean)
                .join(' ')}
              key={request.id}
            >
              <div className='request-card__meta'>
                <span>{translate('partsRequest')}</span>
                <time dateTime={request.createdAt}>
                  {format.dateTime(new Date(request.createdAt), {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </time>
              </div>
              <h3 className='request-card__title'>
                {request.name || request.phone}
              </h3>
              <a className='request-card__phone' href={`tel:${request.phone}`}>
                {request.phone}
              </a>
              <ul className='request-card__parts'>
                {request.parts.map((part) => (
                  <li key={part.partId}>
                    <PartIcon icon={part.icon} />
                    <span>
                      {part.quantity} × {part.name}
                    </span>
                  </li>
                ))}
              </ul>
              <p className='request-card__details'>{request.details}</p>
              <div className='request-card__actions'>
                <button
                  onClick={() => void toggleRequest(request.id)}
                  type='button'
                >
                  {translate(request.completed ? 'markPending' : 'markDone')}
                </button>
                <button
                  onClick={() => void removeRequest(request.id)}
                  type='button'
                >
                  {translate('remove')}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default RequestQueue
