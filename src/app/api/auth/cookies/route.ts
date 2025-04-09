// import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { setResponse as setRes } from '@arch/core/utils/server/response.status'
import { serialize } from 'cookie'

const POST = async (request: Request) => {
  const req = await request.json()
  try {
    if (!req.do) {
      return
    }

    if (req.do === 'set') {
      const { res, resCode, cookies, maxAge } = req
      return new NextResponse(res, {
        status: resCode,
        headers: {
          'Set-Cookie': serialize(cookies.key, cookies.value, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: maxAge,
          }),
        },
      })
    }
    setRes.blocked('Invalid Method')
  } catch (_e) {
    setRes.internalError('Authorization failed')
  }
}

export { POST }
