/* eslint-disable react-hooks/rules-of-hooks */
import type { MetadataRoute } from 'next'
import { env } from '@env'
import { _staticSitemapUrls } from '@/libs/sitemap'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // TODO: 1.4 -Add Url and dynamic sitemap urls here
  const baseURL = env.BASE_URL || 'https://arch.nexellab.com'
  return [
    ..._staticSitemapUrls.map(({ title, url, ...staticUrl }: any) => ({
      url: baseURL + url,
      ...staticUrl,
    })),
  ]
}
