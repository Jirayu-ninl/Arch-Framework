import type { Adapter } from 'next-auth/adapters'
import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import { authOptions } from '@backend/auth'

const handler = NextAuth(authOptions as NextAuthOptions & { adapter: Adapter })
export { handler as GET, handler as POST }
