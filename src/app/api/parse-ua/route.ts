import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { ua } = (await request.json()) as { ua: string | null | undefined }
  const { UAParser } = await import('ua-parser-js')
  const result = new UAParser(ua ?? '').getResult()
  return NextResponse.json(result)
}
