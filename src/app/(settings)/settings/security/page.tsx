import "server-only";

import { getSessionFromCookie } from "@/utils/auth";
import { redirect } from "next/navigation";
import { getDB } from "@/db";
import { passKeyCredentialTable } from "@/db/schema";
import { SITE_URL } from "@/constants";
import { eq } from "drizzle-orm";
import { PasskeysList } from "./passkey.client";
import type { PassKeyCredential } from "@/db/schema";
import type { ParsedUserAgent } from "@/types";
import type { IResult } from "ua-parser-js";

interface ParsedPasskey extends Omit<PassKeyCredential, 'userAgent'> {
  userAgent: string | null;
  parsedUserAgent: ParsedUserAgent;
}

export default async function SecurityPage() {
  const session = await getSessionFromCookie();

  if (!session) {
    return redirect("/sign-in");
  }

  const db = getDB();
  const passkeys = await db
    .select()
    .from(passKeyCredentialTable)
    .where(eq(passKeyCredentialTable.userId, session.user.id));

  // Parse user agent for each passkey
  const passkeysWithParsedUA = await Promise.all(
    passkeys.map(async (passkey: PassKeyCredential): Promise<ParsedPasskey> => {
      const userAgent = passkey.userAgent ?? null;
      const uaRes = await fetch(`${SITE_URL}/api/parse-ua`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ua: userAgent }),
      });
      const result: IResult | null = uaRes.ok ? ((await uaRes.json()) as IResult) : null;
      return {
        ...passkey,
        userAgent: userAgent ?? null,
        parsedUserAgent: result
          ? {
              ua: userAgent ?? '',
              browser: {
                name: result.browser.name,
                version: result.browser.version,
                major: result.browser.major,
              },
              device: {
                model: result.device.model,
                type: result.device.type,
                vendor: result.device.vendor,
              },
              engine: {
                name: result.engine.name,
                version: result.engine.version,
              },
              os: {
                name: result.os.name,
                version: result.os.version,
              },
            }
          : {
              ua: userAgent ?? '',
              browser: { name: '', version: '', major: '' },
              device: { model: '', type: '', vendor: '' },
              engine: { name: '', version: '' },
              os: { name: '', version: '' },
            },
      };
    })
  );

  return (
    <div className="container max-w-4xl space-y-8">
      <PasskeysList
        passkeys={passkeysWithParsedUA}
        currentPasskeyId={session.passkeyCredentialId ?? null}
        email={session.user.email}
      />
    </div>
  );
}

