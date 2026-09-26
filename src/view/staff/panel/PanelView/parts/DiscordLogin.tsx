'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { authClient } from '@/lib/auth/auth-client'

/** Properties accepted by the Discord login card. */
interface DiscordLoginProperties {
  /** Whether the authenticated Discord ID is absent from the server allowlist. */
  readonly accessDenied: boolean
  /** Whether all server-side Discord credentials are available. */
  readonly authConfigured: boolean
  /** Discord account ID detected for the rejected authenticated account. */
  readonly deniedDiscordId: string | null
}

/** Starts the Better Auth Discord OAuth flow or explains missing setup. */
const DiscordLogin = ({
  accessDenied,
  authConfigured,
  deniedDiscordId,
}: DiscordLoginProperties): ReactNode => {
  const translate = useTranslations('Panel')
  const [pending, setPending] = useState(false)

  /** Redirects the visitor into the Better Auth Discord OAuth flow. */
  const signIn = async (): Promise<void> => {
    if (!authConfigured) return
    setPending(true)
    if (accessDenied) await authClient.signOut()
    await authClient.signIn.social({
      callbackURL: '/panel',
      provider: 'discord',
    })
    setPending(false)
  }

  return (
    <section className='discord-login'>
      <div aria-hidden='true' className='discord-login__mark'>
        ◈
      </div>
      <p className='eyebrow'>{translate('eyebrow')}</p>
      <h2>{translate('loginTitle')}</h2>
      <p>{translate('loginDescription')}</p>
      {!authConfigured && (
        <div className='discord-login__notice' role='status'>
          <strong>{translate('configurationTitle')}</strong>
          <p>{translate('configurationBody')}</p>
        </div>
      )}
      {accessDenied && (
        <div className='discord-login__notice' role='alert'>
          <strong>{translate('accessDeniedTitle')}</strong>
          <p>{translate('accessDeniedBody')}</p>
          {deniedDiscordId && (
            <p className='discord-login__detected-id'>
              {translate('detectedDiscordId', { id: deniedDiscordId })}
            </p>
          )}
        </div>
      )}
      <button
        className='button button--discord'
        disabled={!authConfigured || pending}
        onClick={signIn}
        type='button'
      >
        {translate(pending ? 'loginPending' : 'loginAction')}
      </button>
    </section>
  )
}

export default DiscordLogin
