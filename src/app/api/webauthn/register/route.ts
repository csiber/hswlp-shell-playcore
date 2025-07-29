import { NextResponse } from 'next/server'
import { getDB } from '@/db'
import { passKeyCredentialTable } from '@/db/schema'
import isProd from '@/utils/is-prod'
import { SITE_DOMAIN, SITE_URL } from '@/constants'
import { requireVerifiedEmail } from '@/utils/auth'
import type { RegistrationResponseJSON } from '@simplewebauthn/types'

const rpID = isProd ? SITE_DOMAIN : 'localhost'
const origin = SITE_URL

interface VerifyRequest {
  response: RegistrationResponseJSON
  challenge: string
  userAgent?: string | null
  ipAddress?: string | null
}

export async function POST(request: Request) {
  const session = await requireVerifiedEmail()

  if (!session) {
    throw new Error('Not authenticated')
  }
  const body = (await request.json()) as VerifyRequest

  const { verifyRegistrationResponse } = await import('@simplewebauthn/server')
  const { UAParser } = await import('ua-parser-js')

  const verification = await verifyRegistrationResponse({
    response: body.response,
    expectedChallenge: body.challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  })

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const { credential, aaguid } = verification.registrationInfo
  const db = getDB()
  await db.insert(passKeyCredentialTable).values({
    userId: session.user.id,
    credentialId: credential.id,
    credentialPublicKey: Buffer.from(credential.publicKey).toString('base64url'),
    counter: 0,
    transports: body.response.response.transports
      ? JSON.stringify(body.response.response.transports)
      : null,
    aaguid: aaguid || null,
    userAgent: body.userAgent,
    ipAddress: body.ipAddress,
  })

  const parsedUserAgent = new UAParser(body.userAgent ?? '').getResult()

  return NextResponse.json({ success: true, parsedUserAgent })
}
