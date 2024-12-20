// import type * as SCHEMA from './schema'
import type { Context } from '@backend/trpc/trpc.context'

export const isValidSession = async ({ ctx }: { ctx: Context }) => {
  if (!ctx.session || !ctx.session.user || !ctx.session.user.email) {
    return {
      isSession: false,
    }
  }

  const user = await ctx.prisma.user.findUnique({
    where: {
      email: ctx.session.user.email,
    },
  })
  if (!user) {
    return {
      isSession: false,
    }
  }
  return {
    isSession: true,
  }
}
