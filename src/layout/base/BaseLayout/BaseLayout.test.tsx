import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import messages from '../../../../messages/es.json'
import BaseLayout from '@/layout/base/BaseLayout/BaseLayout'

describe('BaseLayout', () => {
  it('renders route content inside the shared providers', () => {
    render(
      <BaseLayout locale='es' messages={messages}>
        Route content
      </BaseLayout>,
    )

    expect(screen.getByText('Route content')).toBeInTheDocument()
  })
})
