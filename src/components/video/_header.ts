export enum STATUS {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    PLAY = 'PLAY',
  }
  
  export interface VideoProps {
    url: string
    className?: string
    autoPlay?: boolean
    noControl?: boolean
    noPause?: boolean
    onPlaying?: ({
      isPlaying,
      status,
    }: {
      isPlaying: boolean
      status: STATUS
    }) => void
  }