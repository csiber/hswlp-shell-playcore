import { NextResponse } from 'next/server'
import { getDB } from '@/db'
import { passKeyCredentialTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import isProd from '@/utils/is-prod'
import { SITE_DOMAIN, SITE_URL } from '@/constants'
import type { AuthenticationResponseJSON } from '@simplewebauthn/types'

const rpID = isProd ? SITE_DOMAIN : 'localhost'
const origin = SITE_URL

interface AuthRequest {
  response: AuthenticationResponseJSON
  challenge: string
}

export async function POST(request: Request) {
  const { response, challenge } = (await request.json()) as AuthRequest

  const { verifyAuthenticationResponse } = await import('@simplewebauthn/server')

  const credentialId = response.id
  const db = getDB()
  const credential = await db.query.passKeyCredentialTable.findFirst({
    where: eq(passKeyCredentialTable.credentialId, credentialId),
  })

  if (!credential) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
    credential: {
      id: credential.credentialId,
      publicKey: Buffer.from(credential.credentialPublicKey, 'base64url'),
      counter: credential.counter,
      transports: credential.transports ? JSON.parse(credential.transports) : undefined,
    },
  })

  if (!verification.verified) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  await db
    .update(passKeyCredentialTable)
    .set({ counter: verification.authenticationInfo.newCounter })
    .where(eq(passKeyCredentialTable.credentialId, credential.credentialId))

  return NextResponse.json({ success: true, userId: credential.userId })
}
