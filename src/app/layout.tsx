/* eslint-disable prettier/prettier */
import type { AppProps } from 'next/app'
import { Inter, Prompt } from 'next/font/google'
import { GoogleTagManager } from '@next/third-parties/google'
import { cn } from '@/libs/styles'

import { env } from '@env'
import { getSession } from '@backend/auth'
import { Wrapper } from '@/layouts/wrapper'
import { App } from './layout.app'

import 'react-toastify/dist/ReactToastify.css'
import './global.scss'

export { viewport, metadata } from '@config'

const fInter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const fPrompt = Prompt({
  subsets: ['thai'],
  weight: ['100', '200', '300', '400', '600'],
  display: 'swap',
  variable: '--font-prompt',
})

type AppPropsWithLayout = AppProps & {
  children: React.ReactNode
  app: React.ReactNode
}

const Layout = async ({ children, app }: AppPropsWithLayout) => {
  const session = await getSession()
  return (
    <html
      lang='en'
      className={cn(fInter.className, `${fInter.variable} ${fPrompt.variable}`)}
    >
      <body suppressHydrationWarning={true}>
        <Wrapper>
          <App session={session} app={app}>
            {children}
          </App>
        </Wrapper>
        <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM} />
      </body>
    </html>
  )
}

export default Layout
