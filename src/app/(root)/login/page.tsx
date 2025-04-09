'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import { signIn } from 'next-auth/react'
import { useUserState } from '@/store'

type FormData = {
  email: string
}

const Page = () => {
  const router = useRouter()
  const setUser = useUserState((st) => st.setUser)

  const [loading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      setUser({
        ...formData,
      })
      await signIn('app-login', {
        email: formData.email.toLowerCase(),
      })
      router.push('/')
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
      toast.error('Error: Failed to register')
    }
  }

  return (
    <>
      <div className='flex h-full w-full items-center justify-center'>
        <form
          className={clsx(
            'flex w-full flex-col items-center justify-between px-2 text-center md:text-2xl',
            // FormCSS,
            loading && 'pointer-events-none opacity-20',
          )}
          onSubmit={handleSubmit}
        >
          <div className='w-full space-y-2'>
            <p>Email</p>
            <input
              className='w-2/3 rounded-lg bg-white px-3 py-1 text-primary'
              type='text'
              title='name'
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <button
            className='mt-4 rounded-xl bg-primary px-3 py-1 text-white md:px-20 md:py-3 md:text-xl'
            type='submit'
            title='submit'
          >
            {loading ? 'loading..' : 'submit'}
          </button>
        </form>
      </div>
    </>
  )
}

export default Page
