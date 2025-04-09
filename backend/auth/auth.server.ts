/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AuthOptions,
  DefaultSession,
  DefaultUser,
  NextAuthOptions,
} from 'next-auth'
import { getServerSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { headers } from 'next/headers'

// import GoogleProvider from 'next-auth/providers/google'
// import FacebookProvider from 'next-auth/providers/facebook'
// import GithubProvider from 'next-auth/providers/github'
import { env } from '@env'
import { prisma } from '@arch/core/database/prisma'
import { TIME } from '@arch/core/utils/time'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string
    username: string
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
    plan: 'FREE' | 'PLUS' | 'PRO' | 'ELITE'
    metadata: Record<string, unknown>
  }

  interface Session extends DefaultSession {
    user: {
      id: string
      username: string
      name: string
      role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
      plan: 'FREE' | 'PLUS' | 'PRO' | 'ELITE'
      metadata: Record<string, unknown>
    } & DefaultSession['user']
  }
}

/** Next-Auth Configs here **/
export const authOptions:
  | NextAuthOptions
  | { adapter: AuthOptions['adapter'] } = {
  // pages: {
  //   signIn: '/',
  //   signOut: '/',
  //   error: '/',
  //   newUser: '/',
  // },
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
          plan: user.plan,
        },
      }
    },
  },
  adapter: PrismaAdapter(prisma) as AuthOptions['adapter'],
  events: {
    signIn: async ({ user }) => {
      const activeSession = await prisma.session.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          expires: 'desc',
        },
      })
      if (activeSession) {
        const headersList = await headers()
        const ip = (headersList.get('x-forwarded-for') ?? '').split(',')[0]
        const userAgent = headersList.get('user-agent') || 'Unknown user-agent'

        await prisma.session.update({
          where: { id: activeSession.id },
          data: {
            ipAddress: ip,
            userAgent: userAgent,
          },
        })
      }
    },
  },
  session: {
    strategy: 'database',
    maxAge: TIME.MONTH,
  },
  // providers: [
  //   GoogleProvider({
  //     clientId: env.AUTH_GOOGLE_CLIENT_ID,
  //     clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
  //   }),
  //   FacebookProvider({
  //     clientId: env.AUTH_FB_APP_ID,
  //     clientSecret: env.AUTH_FB_APP_SECRET,
  //   }),
  //   GithubProvider({
  //     clientId: env.AUTH_GITHUB_CLIENT_ID,
  //     clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
  //   }),
  // ],
  secret: env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export const getSession = async () => await getServerSession(authOptions)
