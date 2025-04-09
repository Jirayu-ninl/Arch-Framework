import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json(
    {
      name: 'Arch App',
      env: process.env.NODE_ENV,
      status: 'ok',
      isRunning: true,
    },
    { status: 200 },
  )
}
