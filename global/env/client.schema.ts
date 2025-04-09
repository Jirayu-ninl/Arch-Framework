import { z } from 'zod'

/** Specify your client-side environment variables schema here, prefix them with `NEXT_PUBLIC_`. **/

export const clientSchema = {
  NEXT_PUBLIC_APP_NAME: z.string(),
  NEXT_PUBLIC_GTM: z.string(),
  NEXT_PUBLIC_BASE_URL: z.preprocess(() => {
    if (typeof window !== 'undefined') return ''
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    if (process.env.RAILWAY_PUBLIC_DOMAIN)
      return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    if (process.env.RENDER_INTERNAL_HOSTNAME)
      return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
    return `http://localhost:${process.env.PORT ?? 8080}`
  }, z.string().url()),
}
