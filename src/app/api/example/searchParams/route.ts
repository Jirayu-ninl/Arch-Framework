import { NextResponse } from 'next/server'

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const title = searchParams.get('title')

  return NextResponse.json({ id, title })
}
