"use server";

import { z } from "zod";
import { SITE_URL } from "@/constants";
import { getDB } from "@/db";
import { userTable, passKeyCredentialTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createServerAction, ZSAError } from "zsa";
import { requireVerifiedEmail, createAndStoreSession } from "@/utils/auth";
import type { User } from "@/db/schema";
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";
import { headers } from "next/headers";
import { getIP } from "@/utils/get-IP";
import { withRateLimit, RATE_LIMITS } from "@/utils/with-rate-limit";

const generateRegistrationOptionsSchema = z.object({
  email: z.string().email(),
});

export const generateRegistrationOptionsAction = createServerAction()
  .input(generateRegistrationOptionsSchema)
  .handler(async ({ input }) => {
    return withRateLimit(async () => {
      // Check if user is logged in and email is verified
      const session = await requireVerifiedEmail();

      const db = getDB();
      const user = await db.query.userTable.findFirst({
        where: eq(userTable.email, input.email),
      });

      if (!user) {
        throw new ZSAError("NOT_FOUND", "Felhasználó nem található");
      }

      // Verify the email matches the logged-in user
      if (user.id !== session?.user?.id) {
        throw new ZSAError("FORBIDDEN", "Csak a saját fiókodhoz regisztrálhatsz passkeyt");
      }

      // Check if user has reached the passkey limit
      const existingPasskeys = await db
        .select()
        .from(passKeyCredentialTable)
        .where(eq(passKeyCredentialTable.userId, user.id));

      if (existingPasskeys.length >= 5) {
        throw new ZSAError(
          "FORBIDDEN",
          "Elérted a passkeyk maximális, 5 darabos limitjét"
        );
      }

      const optionsRes = await fetch(`${SITE_URL}/api/webauthn/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: input.email }),
      });
      if (!optionsRes.ok) {
        throw new ZSAError(
          "INTERNAL_SERVER_ERROR",
          "Nem sikerült lekérni a passkey opciókat"
        );
      }
      const options = await optionsRes.json();
      return options;
    }, RATE_LIMITS.SETTINGS);
  });

const verifyRegistrationSchema = z.object({
  email: z.string().email(),
  response: z.custom<RegistrationResponseJSON>(),
  challenge: z.string(),
});

export const verifyRegistrationAction = createServerAction()
  .input(verifyRegistrationSchema)
  .handler(async ({ input }) => {
    return withRateLimit(async () => {
      // Check if user is logged in and email is verified
      const session = await requireVerifiedEmail();

      const db = getDB();
      const user = await db.query.userTable.findFirst({
        where: eq(userTable.email, input.email),
      });

      if (!user) {
        throw new ZSAError("NOT_FOUND", "Felhasználó nem található");
      }

      // Verify the email matches the logged-in user
      if (user.id !== session?.user?.id) {
        throw new ZSAError("FORBIDDEN", "Csak a saját fiókodhoz regisztrálhatsz passkeyt");
      }

      const verifyRes = await fetch(`${SITE_URL}/api/webauthn/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          response: input.response,
          challenge: input.challenge,
          userAgent: (await headers()).get("user-agent"),
          ipAddress: await getIP(),
        }),
      });
      if (!verifyRes.ok) {
        throw new ZSAError(
          "PRECONDITION_FAILED",
          "Nem sikerült regisztrálni a passkey-t"
        );
      }
      await verifyRes.json();
      await createAndStoreSession(user.id, "passkey", input.response.id);
      return { success: true };
    }, RATE_LIMITS.SETTINGS);
  });

const deletePasskeySchema = z.object({
  credentialId: z.string(),
});

export const deletePasskeyAction = createServerAction()
  .input(deletePasskeySchema)
  .handler(async ({ input }) => {
    return withRateLimit(async () => {
      const session = await requireVerifiedEmail();

      // Prevent deletion of the current passkey
      if (session?.passkeyCredentialId === input.credentialId) {
        throw new ZSAError(
          "FORBIDDEN",
          "A jelenleg használt passkey nem törölhető"
        );
      }

      const db = getDB();

      // Get all user's passkeys
      const passkeys = await db
        .select()
        .from(passKeyCredentialTable)
        .where(eq(passKeyCredentialTable.userId, session?.user?.id ?? ""));

      // Get full user data to check password
      const user = await db.query.userTable.findFirst({
        where: eq(userTable.id, session?.user?.id ?? ""),
      }) as User;

      // Check if this is the last passkey and if the user has a password
      if (passkeys.length === 1 && !user.passwordHash) {
        throw new ZSAError(
          "FORBIDDEN",
          "Nem törölheted az utolsó passkeyt, ha nincs jelszó beállítva"
        );
      }

      await db
        .delete(passKeyCredentialTable)
        .where(eq(passKeyCredentialTable.credentialId, input.credentialId));

      return { success: true };
    }, RATE_LIMITS.SETTINGS);
  });

export const generateAuthenticationOptionsAction = createServerAction()
  .input(z.object({}))
  .handler(async () => {
    return withRateLimit(async () => {
      const optionsRes = await fetch(`${SITE_URL}/api/webauthn/authenticate/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: (await requireVerifiedEmail())?.user?.id }),
      });
      if (!optionsRes.ok) {
        throw new ZSAError(
          "INTERNAL_SERVER_ERROR",
          "Nem sikerült lekérni a hitelesítési opciókat"
        );
      }
      const options: PublicKeyCredentialRequestOptionsJSON = await optionsRes.json();
      return { optionsJSON: options };
    }, RATE_LIMITS.SIGN_IN);
  });

const verifyAuthenticationSchema = z.object({
  response: z.custom<AuthenticationResponseJSON>((val): val is AuthenticationResponseJSON => {
    return typeof val === "object" && val !== null && "id" in val && "rawId" in val;
  }, "Érvénytelen hitelesítési válasz"),
  challenge: z.string(),
});

export const verifyAuthenticationAction = createServerAction()
  .input(verifyAuthenticationSchema)
  .handler(async ({ input }) => {
    return withRateLimit(async () => {
      const verifyRes = await fetch(`${SITE_URL}/api/webauthn/authenticate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: input.response,
          challenge: input.challenge,
        }),
      });
      if (!verifyRes.ok) {
        throw new ZSAError("FORBIDDEN", "A passkey hitelesítés sikertelen");
      }
      const { credential } = (await verifyRes.json()) as { credential: { userId: string } };
      await createAndStoreSession(credential.userId, "passkey", input.response.id);
      return { success: true };
    }, RATE_LIMITS.SIGN_IN);
  });
