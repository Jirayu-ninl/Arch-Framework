'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import superjson from 'superjson'
import { useState } from 'react'
import { trpc } from '@trpc'
import { invalidationRules } from '@config/server'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.RAILWAY_PUBLIC_DOMAIN)
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  return `http://localhost:${process.env.PORT ?? 8080}`
}

export const TrpcProvider = (p: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            onSuccess: async () => {
              try {
                await queryClient.invalidateQueries({
                  predicate: (query) => {
                    const [root, procedure] = query.queryKey as [string, string]
                    const rules = invalidationRules[root]
                    if (!rules) return false
                    if (rules.invalidateAll) return true
                    if (rules.exclude?.includes(procedure)) return false
                    if (rules.includeOnly?.length) {
                      return rules.includeOnly.includes(procedure)
                    }
                    return true
                  },
                })

                if (process.env.NODE_ENV === 'development') {
                  const currentQueries = queryClient.getQueryCache().getAll()
                  // Log queries that are being refetch
                  const refetching = currentQueries
                    .filter((q) => q.state.fetchStatus === 'fetching')
                    .map((q) => ({
                      key: q.queryKey,
                      status: q.state.status,
                      fetchStatus: q.state.fetchStatus,
                    }))
                  console.log('Queries being refetch:', refetching)
                  // Log all affected queries
                  const allAffected = currentQueries
                    .filter((q) => q.state.fetchStatus !== 'idle')
                    .map((q) => ({
                      key: q.queryKey,
                      status: q.state.status,
                      fetchStatus: q.state.fetchStatus,
                    }))
                  console.log('All affected queries:', allAffected)
                }
              } catch (error) {
                console.error('Error during cache invalidation:', error)
              }
            },
            // Optional: Add global mutation error handling
            onError: (error) => {
              console.error('Mutation error:', error)
            },
          },
        },
      }),
  )

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc/`,
          transformer: superjson,
          headers: () => {
            return {
              framework: 'arch',
            }
          },
          fetch: (url, options) => {
            return fetch(url, {
              ...options,
              credentials: 'include',
              headers: {
                ...options?.headers,
              },
            })
          },
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {p.children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
