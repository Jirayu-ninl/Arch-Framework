import { Providers } from './providers'
import { Controllers } from './_controllers'
import { GlobalComponent } from './_global'

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Providers>
        {children}
        <GlobalComponent />
        <Controllers />
      </Providers>
    </>
  )
}

export { Wrapper }
