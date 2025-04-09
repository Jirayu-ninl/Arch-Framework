import { NextResponse } from 'next/server'
import { trpcCaller } from '@backend/trpc'

export const dynamic = 'force-dynamic'

export const GET = async (request: Request, response: Response) => {
  // const req = await request.json()
  const caller = await trpcCaller(request, response)
  const testTrpc = await caller.debugger.server({ text: 'tRPC' })
  if (testTrpc?.success) {
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ success: false })
}
