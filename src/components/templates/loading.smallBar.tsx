'use client'

import { motion, AnimatePresence } from 'framer-motion'

const LoadingSmallBar = ({ duration = 3 }: { duration?: number }) => {
  return (
    <>
      <div className='relative m-auto w-24'>
        <AnimatePresence>
          <motion.div
            className='w-full'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className='mt-5 mb-3 h-[10px] w-full rounded-md'>
              <motion.div
                className='m-0.5 h-[4px] rounded-md bg-primary-0'
                animate={{ width: '100%' }}
                initial={{ width: 0 }}
                transition={{
                  duration: duration,
                  ease: [0.33, 1, 0.68, 1],
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

export { LoadingSmallBar }
