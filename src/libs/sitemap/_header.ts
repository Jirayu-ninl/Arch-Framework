import type { Languages } from 'next/dist/lib/metadata/types/alternative-urls-types'
import type { Videos } from 'next/dist/lib/metadata/types/metadata-types'

export interface ISitemap {
  url: string
  lastModified?: string | Date | undefined
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
    | undefined
  priority?: number | undefined
  alternates?:
    | {
        languages?: Languages<string> | undefined
      }
    | undefined
  images?: string[] | undefined
  videos?: Videos[] | undefined
}
