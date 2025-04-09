'use client'

import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'
import { useUiState } from '@/store'

export const ThemeController = () => {
  const [_dark, _setDark] = useUiState(
    useShallow((st) => [st.dark, st.setDark]),
  )

  useEffect(() => {
    function InitState() {
      if (
        !('theme' in localStorage)
        // && window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        _setDark(true)
      } else {
        _setDark(false)
      }
    }
    InitState()
  }, [_setDark])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', _dark)
  }, [_dark])

  return null
}
