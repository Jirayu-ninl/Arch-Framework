'use client'

import { FileIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import { useUiState } from '@/store'

interface CodeComparisonProps {
  beforeCode: string
  afterCode: string
  language: string
  filename: string
  lightTheme: string
  darkTheme: string
}

export default function CodeComparison({
  beforeCode,
  afterCode,
  language,
  filename,
  lightTheme,
  darkTheme,
}: CodeComparisonProps) {
  const isDark = useUiState((st) => st.isDark)
  const [highlightedBefore, setHighlightedBefore] = useState('')
  const [highlightedAfter, setHighlightedAfter] = useState('')

  useEffect(() => {
    const selectedTheme = isDark ? darkTheme : lightTheme

    async function highlightCode() {
      const before = await codeToHtml(beforeCode, {
        lang: language,
        theme: selectedTheme,
      })
      const after = await codeToHtml(afterCode, {
        lang: language,
        theme: selectedTheme,
      })
      setHighlightedBefore(before)
      setHighlightedAfter(after)
    }

    highlightCode()
  }, [isDark, beforeCode, afterCode, language, lightTheme, darkTheme])

  const renderCode = (code: string, highlighted: string) => {
    if (highlighted) {
      return (
        <div
          className='font-mono h-full overflow-auto bg-background text-xs [&>pre]:h-full [&>pre]:!bg-transparent [&>pre]:p-4 [&_code]:break-all'
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      )
    }
    return (
      <pre className='font-mono h-full overflow-auto break-all bg-background p-4 text-xs text-foreground'>
        {code}
      </pre>
    )
  }
  return (
    <div className='mx-auto w-full max-w-5xl'>
      <div className='relative w-full overflow-hidden rounded-xl border border-border'>
        <div className='relative grid md:grid-cols-2 md:divide-x md:divide-border'>
          <div>
            <div className='flex items-center bg-accent p-2 text-sm text-foreground'>
              <FileIcon className='mr-2 h-4 w-4' />
              {filename}
              <span className='ml-auto'>before</span>
            </div>
            {renderCode(beforeCode, highlightedBefore)}
          </div>
          <div>
            <div className='flex items-center bg-accent p-2 text-sm text-foreground'>
              <FileIcon className='mr-2 h-4 w-4' />
              {filename}
              <span className='ml-auto'>after</span>
            </div>
            {renderCode(afterCode, highlightedAfter)}
          </div>
        </div>
        <div className='absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-accent text-xs text-foreground'>
          VS
        </div>
      </div>
    </div>
  )
}
