'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { Providers, Session } from 'types'
import { SignInEmail, SignInProviders, SignUpEmail } from './components'

const Client = ({
  providers,
  session,
}: {
  providers: Providers | null
  session: Session | null
}) => {
  const credCase = useSearchParams().get('case')

  return (
    <div className='flex h-dvh w-dvw flex-col items-center justify-center bg-gradient-to-br from-slate-400 to-slate-500 dark:from-slate-800 dark:to-slate-600 '>
      <div className='absolute right-0 bottom-0 mb-8 h-full w-full opacity-5'>
        <Image
          alt='logo'
          fill
          src='/logo_white.svg'
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className='rounded-lg bg-white/60 p-6 backdrop-blur-lg dark:bg-black/20'>
        {credCase === 'signup' ? <SignUpEmail /> : <SignInEmail />}
        <SignInProviders providers={providers} session={session} />
        <Link href={credCase === 'signup' ? '/portal' : '/portal?case=signup'}>
          <p className='Anim AnimOpacity-40 mt-1 cursor-pointer text-center text-xs opacity-80 hover:opacity-100'>
            {credCase === 'signup'
              ? 'Already have an Account'
              : 'Not have an Account?'}
          </p>
        </Link>
      </div>
    </div>
  )
}

export { Client }
