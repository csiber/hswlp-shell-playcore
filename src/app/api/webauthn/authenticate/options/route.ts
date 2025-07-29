import { NextResponse } from 'next/server'
import { getDB } from '@/db'
import { passKeyCredentialTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import isProd from '@/utils/is-prod'
import { SITE_DOMAIN } from '@/constants'
import { requireVerifiedEmail } from '@/utils/auth'
import type { AuthenticatorTransport } from '@simplewebauthn/types'

const rpID = isProd ? SITE_DOMAIN : 'localhost'

export async function POST() {
  const session = await requireVerifiedEmail()

  if (!session) {
    throw new Error('Not authenticated')
  }
  const { generateAuthenticationOptions } = await import('@simplewebauthn/server')

  const db = getDB()
  const credentials = await db.query.passKeyCredentialTable.findMany({
    where: eq(passKeyCredentialTable.userId, session.user.id),
  })

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: credentials.map((cred) => ({
      id: cred.credentialId,
      type: 'public-key',
      transports: cred.transports
        ? (JSON.parse(cred.transports) as AuthenticatorTransport[])
        : undefined,
    })),
  })

  return NextResponse.json(options)
}
