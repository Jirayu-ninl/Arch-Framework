'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, animate, AnimatePresence } from 'framer-motion'

const Loading = ({
  duration = 3,
  description = 'Loading your experience',
}: {
  duration?: number
  description?: string
}) => {
  const [progress, setProgress] = useState('0')
  const [_isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: duration,
      ease: [0.33, 1, 0.68, 1],
      onUpdate(value: number) {
        setProgress(value.toFixed(0))
      },
    })
    return () => controls.stop()
  }, [duration])

  setTimeout(() => setIsLoaded(true), duration * 100)

  return (
    <>
      <div className='relative flex h-dvh w-dvw flex-col items-center justify-center bg-slate-800'>
        <div className='relative w-80'>
          <Image src='/logo_white.svg' width={538.8} height={210} alt='Logo' />
          {/* <h1 className='mt-6 font-bold text-white'>Loading</h1> */}
          <ProgressBlock progress={progress} description={description} />
        </div>
      </div>
    </>
  )
}

const ProgressBlock = ({
  progress,
  description,
}: {
  progress: string
  description: string
}) => (
  <>
    <AnimatePresence>
      <motion.div
        className='w-full'
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.1 }}
      >
        <h6 className='mt-6 w-full text-center font-semibold text-2xl'>
          {progress}%
        </h6>
        <div className='mt-5 mb-3 h-[10px] w-full rounded-md'>
          <motion.div
            className='m-0.5 h-[4px] rounded-md bg-primary-0'
            animate={{ width: '100%' }}
            initial={{ width: 0 }}
            transition={{
              duration: 1.5,
              ease: [0.33, 1, 0.68, 1],
            }}
          />
        </div>
        <p className='w-full text-center text-xs'>{description}</p>
      </motion.div>
    </AnimatePresence>
  </>
)

export { Loading }
