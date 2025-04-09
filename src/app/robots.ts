import type { MetadataRoute } from 'next'
import { env } from '@env'

export default function robots(): MetadataRoute.Robots {
  const baseURL = env.BASE_URL || 'https://arch.nexellab.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/test/',
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
  }
}
