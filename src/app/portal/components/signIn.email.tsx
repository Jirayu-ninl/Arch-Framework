'use client'

import { trpc } from '@backend/trpc/client'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast as t } from 'react-toastify'
import type { TForm } from '../functions'
import { formHandler } from '../functions'

const SignInEmail = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { mutateAsync } = trpc.user.portal.signin.useMutation({
    onSuccess(data) {
      if (data && !data.success && data.message) {
        t.error(`Error: ${data.message}`)
        return
      }
      t.success('Sign in complete')
      // router.refresh()
      router.push('/app/dashboard')
    },
    onError: () => {
      t.error('Error: Connection failed')
      setIsLoading(false)
      return
    },
  })

  const { handleChange, executeForm } = formHandler()
  const handleSubmit = async (e: React.FormEvent) =>
    executeForm(e, async (f: TForm) => {
      try {
        setIsLoading(true)
        await mutateAsync(f)
      } catch (_e) {
        t.error("Error: Can't set session")
        throw new Error('AUTH: Set session failed')
      }
    })

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className='relative'
      exit={{ opacity: 0, x: -50 }}
      initial={{ opacity: 0, x: -50 }}
    >
      <h6 className='font-semibold uppercase'>Login</h6>
      <form className='flex flex-col space-y-2 pt-4' onSubmit={handleSubmit}>
        <input
          className={clsx(
            'rounded-sm bg-black/5 px-2 py-1 dark:bg-white/10',
            isLoading && 'opacity-40',
          )}
          disabled={isLoading}
          name='email'
          onChange={handleChange}
          placeholder='Email'
          required={true}
          type='email'
        />
        <input
          className={clsx(
            'rounded-sm bg-black/5 px-2 py-1 dark:bg-white/10',
            isLoading && 'opacity-40',
          )}
          disabled={isLoading}
          name='password'
          onChange={handleChange}
          placeholder='Password'
          required={true}
          type='password'
        />
        <button
          className={clsx(
            'Anim AnimOpacity-60 mt-5 rounded-md bg-white/60 py-1 dark:bg-slate-800/80',
            isLoading
              ? 'opacity-40'
              : 'hover:bg-white/100 dark:hover:bg-slate-600/100',
          )}
          disabled={isLoading}
          type='submit'
        >
          {isLoading ? 'loading...' : 'Login'}
        </button>
        <div className='flex pt-3'>
          <label>
            <input className='Form-white-checkbox mr-2' type='checkbox' />
            <p className='-mt-px text-xs'>Remember me</p>
          </label>
        </div>
      </form>
    </motion.div>
  )
}

export { SignInEmail }
