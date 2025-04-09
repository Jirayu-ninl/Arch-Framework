'use client'

import { useUiState } from '@/store'
import { Sun, Moon } from '@arch/core/assets/icons'
import { useShallow } from 'zustand/shallow'

const Nav = () => {
  const [_dark, _setDark] = useUiState(
    useShallow((st) => [st.dark, st.setDark]),
  )
  return (
    <>
      <div
        className='Anim fixed top-4 right-4 z-100 h-10 w-10 cursor-pointer rounded-md p-2 shadow-sm hover:scale-110'
        onClick={() => _setDark(!_dark)}
      >
        {_dark ? (
          <Sun className='h-full w-full' />
        ) : (
          <Moon className='h-full w-full' />
        )}
      </div>
    </>
  )
}

export { Nav }
