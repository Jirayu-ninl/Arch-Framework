// cspell: disable
import type { User } from '@prisma/client'
import { NextResponse } from 'next/server'
import { Parser } from '@json2csv/plainjs'
import { prisma } from '@arch/core/database'
import { env } from '@env'
export const GET = async (req: Request) => {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || authHeader !== env.AUTH_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({})

    if (!users) {
      return new Response(
        JSON.stringify({ message: `Prisma error, can't find users` }),
        {
          status: 400,
        },
      )
    }

    const transformedData = users.map((user: User) => {
      const localDate = `${new Date(user.createdAt).toLocaleTimeString(
        'en-GB',
        {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        },
      )} ${new Date(user.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
      })}`

      return {
        email: user.email,
        formatCreatedAt: localDate,
        createdAt: user.createdAt,
      }
    })

    const parser = new Parser()
    const csv = parser.parse(transformedData)

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=users.csv',
      },
    })
  } catch (e) {
    return new Response(JSON.stringify({ message: `error: ${e}` }), {
      status: 500,
    })
  }
}
