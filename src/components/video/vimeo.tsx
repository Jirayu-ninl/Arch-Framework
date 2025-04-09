'use client'

import type { VideoProps } from './_header'
import { STATUS } from './_header'
import { useRef, useState, useEffect } from 'react'
import { FaPlay } from 'react-icons/fa6'
import { cn } from '@/libs/styles'
import { vimeoUrlToId } from './vimeo.urlToId'

const Vimeo: React.FC<VideoProps> = ({
  url,
  className,
  autoPlay = true,
  noControl = true,
  noPause = true,
}) => {
  const { id } = vimeoUrlToId(url)
  if (!noControl) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${id}?title=0&amp;muted=1&amp;autoplay=1&amp;autopause=0&amp;controls=0&amp;loop=1&amp;background=1&amp;app_id=58479`}
        className='h-full w-full'
        width='1080'
        height='608'
        allow='autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media'
        data-ready='false'
        title='27June Studio'
      />
    )
  }
  const [isPlaying, setIsPlaying] = useState(false)
  const [status, setStatus] = useState<STATUS>(
    autoPlay ? STATUS.LOADING : STATUS.IDLE,
  )

  const iframeRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://player.vimeo.com/api/player.js'
    script.async = true
    document.body.appendChild(script)
    if (status === STATUS.LOADING) {
      script.onload = () => {
        playerRef.current = new window.Vimeo.Player(iframeRef.current, {
          id,
          background: true,
          transparent: false,
          controls: false,
          responsive: true,
        })

        // if (playerRef.current) {
        //   playerRef.current.on('play', () => {
        //     setIsPlaying(true)
        //     setStatus(STATUS.PLAY)
        //   })
        //   //   playerRef.current.on('pause', () => setIsPlaying(false))
        //   //   playerRef.current.on('ended', () => setIsPlaying(false))
        // }
      }
    }

    if (status === STATUS.PLAY && playerRef.current) {
      playerRef.current.on('play', () => setIsPlaying(true))
      playerRef.current.on('pause', () => setIsPlaying(false))
      playerRef.current.on('ended', () => setIsPlaying(false))
    }

    return () => {
      document.body.removeChild(script)
      if (playerRef.current) {
        playerRef.current.unload()
      }
    }
  }, [id, status])

  // useEffect(() => {
  //   console.log({ status, isPlaying })
  // }, [status, isPlaying])

  const togglePlay = () => {
    if (noPause) return
    if (status === STATUS.IDLE) return
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause()
      } else {
        playerRef.current.play()
      }
    }
  }
  return (
    <div
      className={cn(
        className,
        'relative h-full w-full overflow-hidden bg-foreground/5',
      )}
    >
      {status === STATUS.LOADING && (
        <div className='absolute inset-0 top-0 left-0 flex h-full w-full items-center justify-center bg-opacity-40 transition-opacity hover:bg-opacity-50'>
          <Loading />
        </div>
      )}
      <div ref={iframeRef} className='absolute inset-0 h-full w-full' />
      {(status === STATUS.IDLE || (status === STATUS.PLAY && !isPlaying)) && (
        <button
          onClick={() => setStatus(STATUS.LOADING)}
          className='absolute inset-0 top-0 left-0 flex h-full w-full items-center justify-center bg-opacity-40 transition-opacity hover:bg-opacity-50'
        >
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-foreground/20 bg-opacity-80 p-4'>
            <FaPlay className='h-full w-full' />
          </div>
        </button>
      )}
      {status === STATUS.PLAY && (
        <button
          onClick={togglePlay}
          className='absolute inset-0 top-0 left-0 flex h-full w-full items-center justify-center bg-opacity-40 transition-opacity hover:bg-opacity-50'
        />
      )}
    </div>
  )
}

const Loading = () => {
  return (
    <div className='flex h-24 w-24 items-center justify-center rounded-full bg-opacity-80 p-4'>
      <svg
        aria-hidden='true'
        className='h-8 w-8 animate-spin fill-foreground text-foreground/20'
        viewBox='0 0 100 101'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
          fill='currentColor'
        />
        <path
          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
          fill='currentFill'
        />
      </svg>
    </div>
  )
}

export { Vimeo }
