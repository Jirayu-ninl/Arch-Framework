/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaAdapter } from '@auth/prisma-adapter'
import { env } from '@env'
import { headers } from 'next/headers'
import type {
  AuthOptions,
  Awaitable,
  DefaultSession,
  DefaultUser,
  NextAuthOptions,
  User,
} from 'next-auth'
import { getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '#core/database/prisma'
import { TIME } from '#core/utils/time'
import { archSignIn } from './auth.jwt.signIn'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
    plan: 'FREE' | 'PLUS' | 'PRO' | 'ELITE'
    metadata: Record<string, unknown>
  }

  interface Session extends DefaultSession {
    user: {
      id: string
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
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: env.AUTH_FB_APP_ID,
      clientSecret: env.AUTH_FB_APP_SECRET,
    }),
    GithubProvider({
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Email',
      id: 'app-login',
      type: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'text', placeholder: 'E-mail' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      authorize: (
        credentials: Record<'email' | 'password', string> | undefined,
      ): Awaitable<User | null> => {
        return archSignIn(credentials) as Awaitable<User | null>
      },
    }),
  ],
  secret: env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export const getSession = async () => await getServerSession(authOptions)
