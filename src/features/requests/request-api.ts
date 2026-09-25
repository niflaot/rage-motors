import { z } from 'zod'

import {
  type WorkshopRequest,
  type WorkshopRequestInput,
  workshopRequestSchema,
} from '@/features/requests/request-contract'

/** Creates a public offer in PostgreSQL through the backend service. */
export const addWorkshopRequest = async (
  input: WorkshopRequestInput,
): Promise<WorkshopRequest> => {
  const response = await fetch('/api/requests', {
    body: JSON.stringify(input),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  if (!response.ok) throw new Error('REQUEST_CREATE_FAILED')
  return workshopRequestSchema.parse(await response.json())
}

/** Reads every workshop offer available to the authorized staff account. */
export const getWorkshopRequests = async (): Promise<
  readonly WorkshopRequest[]
> => {
  const response = await fetch('/api/requests', { cache: 'no-store' })
  if (!response.ok) throw new Error('REQUESTS_LOAD_FAILED')
  return z.array(workshopRequestSchema).parse(await response.json())
}

/** Persists one request completion state in PostgreSQL. */
export const updateWorkshopRequest = async (
  identifier: string,
  completed: boolean,
): Promise<void> => {
  const response = await fetch(
    `/api/requests/${encodeURIComponent(identifier)}`,
    {
      body: JSON.stringify({ completed }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    },
  )
  if (!response.ok) throw new Error('REQUEST_UPDATE_FAILED')
}

/** Removes one request from PostgreSQL. */
export const deleteWorkshopRequest = async (
  identifier: string,
): Promise<void> => {
  const response = await fetch(
    `/api/requests/${encodeURIComponent(identifier)}`,
    {
      method: 'DELETE',
    },
  )
  if (!response.ok) throw new Error('REQUEST_DELETE_FAILED')
}
