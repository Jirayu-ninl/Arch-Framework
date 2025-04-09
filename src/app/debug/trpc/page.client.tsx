'use client'

import type { Session } from 'next-auth'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { trpc } from '@trpc'

function Client(p: { session: Session | null }) {
  const clientQuery = trpc.debugger.testQuery.useQuery({ text: 'COSMOS' })
  const clientMutation = trpc.debugger.testMutation.useMutation({
    onSuccess: (data) => {
      if (data?.success && data.message) {
        toast.success(`Success: ${data.message}`)
        return
      }
      toast.warn('No data recieved')
    },
    onError: () => {
      toast.error('Error occurred during mutation')
    },
  })
  const { data: secretMessage } = trpc.debugger.session.useQuery(
    undefined, // no input
    { enabled: p.session?.user !== undefined },
  )
  const [trpcServerData, setTrpcServerData] = useState<string | null>(null)

  useEffect(() => {
    const testTrpcServer = () => {
      fetch('/api/debug/trpc')
        .then((res) => {
          console.log({ res })
          setTrpcServerData('Server caller is working')
        })
        .catch((_e) => setTrpcServerData('Failed to fetch api'))
    }
    if (!trpcServerData) {
      testTrpcServer()
    }
  }, [trpcServerData])

  const onTestMutation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clientMutation.mutate({ text: e.currentTarget.text.value })
  }

  return (
    <>
      <h6 className='mb-2 text-xl'>Client:</h6>
      <div className='w-full space-y-1 rounded-md bg-foreground/5 p-4 text-center'>
        <p>
          {clientQuery.isLoading
            ? 'Loading..'
            : clientQuery.data
              ? clientQuery.data.message
              : 'Client query not working'}
        </p>
        <form onSubmit={onTestMutation}>
          <input
            type='text'
            name='text'
            placeholder='Test mutation'
            className='rounded-md bg-foreground/5 px-2 py-1 text-center'
          />
        </form>
        {secretMessage ? <p>{secretMessage}</p> : <p>No session</p>}
      </div>
      <h6 className='mt-6 mb-2 text-xl'>Server:</h6>
      <div className='w-full space-y-1 rounded-md bg-foreground/5 p-4 text-center'>
        <p>{trpcServerData ? trpcServerData : 'Loading..'}</p>
      </div>
    </>
  )
}

export { Client }
