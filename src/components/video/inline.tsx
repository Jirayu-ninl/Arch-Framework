'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/libs/styles'

interface VideoInlineProps {
  videoUrl: string
  posterUrl?: string
  noPause?: boolean
  loop?: boolean
  muted?: boolean
  autoPlay?: boolean
  className?: string
}

const VideoInline: React.FC<VideoInlineProps> = ({
  videoUrl,
  posterUrl,
  className,
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  noPause = true,
  loop = true,
  muted = true,
  autoPlay = true,
}) => {
  const $videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if ($videoRef.current) {
      const ref = $videoRef.current
      ref.setAttribute('download', '')
      const timeoutId = setTimeout(() => {
        ref.play()
      }, 20)

      return () => {
        clearTimeout(timeoutId)
        if (ref) {
          ref.pause()
          ref.currentTime = 0 // Reset the video position
        }
      }
    }
  }, [])

  return (
    <>
      <div className='pointer-events-none h-dvh w-dvw'>
        <video
          ref={$videoRef}
          playsInline
          autoPlay={autoPlay}
          preload='auto'
          loop={loop}
          muted={muted}
          className={cn('h-full w-full', className)}
          style={{ objectFit: 'cover' }}
          poster={posterUrl}
        >
          <source src={videoUrl} type='video/mp4' />
          {posterUrl && <img src={posterUrl} alt='Video thumbnail' />}
        </video>
      </div>
    </>
  )
}

export { VideoInline }
