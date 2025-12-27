/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaAdapter } from '@auth/prisma-adapter'
import { env } from '@env'
import type {
  AuthOptions,
  Awaitable,
  DefaultSession,
  DefaultUser,
  NextAuthOptions,
  User,
} from 'next-auth'
import { getServerSession } from 'next-auth'
import type { AdapterUser } from 'next-auth/adapters'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '#core/database/prisma'
import { TIME } from '#core/utils/time'
import { archSignIn } from './auth.jwt.signIn'

/** Next-Auth Configs here **/

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

export const authOptions:
  | NextAuthOptions
  | { adapter: AuthOptions['adapter'] } = {
  //   pages: {
  //     signIn: '/',
  //     signOut: '/',
  //     error: '/',
  //     newUser: '/',
  //   },
  callbacks: {
    jwt: ({ token, user }: { token: JWT; user: User | AdapterUser }) => {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    session: ({ session, token }) => {
      session.user.id = token.id as string
      return session
    },
  },
  adapter: PrismaAdapter(prisma) as AuthOptions['adapter'],
  session: {
    strategy: 'jwt',
    maxAge: 2 * TIME.DAY, // 2 days
  },
  theme: {
    colorScheme: 'dark',
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

export const getSession = () => getServerSession(authOptions)
