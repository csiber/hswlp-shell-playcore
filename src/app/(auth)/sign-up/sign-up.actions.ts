"use server";

import { createServerAction, ZSAError } from "zsa"
import { findUserByEmail, createUser } from "@/db/user"
import { signUpSchema } from "@/schemas/signup.schema";
import { hashPassword } from "@/utils/password-hasher";
import { createSession, generateSessionToken, setSessionTokenCookie, canSignUp } from "@/utils/auth";
import { createId } from "@paralleldrive/cuid2";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getVerificationTokenKey } from "@/utils/auth-utils";
import { sendVerificationEmail } from "@/utils/email";
import { withRateLimit, RATE_LIMITS } from "@/utils/with-rate-limit";
import { EMAIL_VERIFICATION_TOKEN_EXPIRATION_SECONDS } from "@/constants";
import { getIP } from "@/utils/get-IP";
import { validateTurnstileToken } from "@/utils/validate-captcha";
import { isTurnstileEnabled } from "@/flags";

export const signUpAction = createServerAction()
  .input(signUpSchema)
  .handler(async ({ input }) => {
    return withRateLimit(
      async () => {
        const { env } = getCloudflareContext();

        if (await isTurnstileEnabled() && input.captchaToken) {
          const success = await validateTurnstileToken(input.captchaToken)

          if (!success) {
            throw new ZSAError(
              "INPUT_PARSE_ERROR",
              "Kérjük, töltsd ki a captchát"
            )
          }
        }

        // Check if email is disposable
        await canSignUp({ email: input.email });

        // Check if email is already taken
        const existingUser = await findUserByEmail(input.email);

        if (existingUser) {
          throw new ZSAError(
            "CONFLICT",
            "Ez az email cím már foglalt"
          );
        }

        // Hash the password
        const hashedPassword = await hashPassword({ password: input.password });

        // Create the user
        const user = await createUser({
          email: input.email,
          firstName: input.firstName,
          nickname: input.nickname || null,
          lastName: input.lastName,
          passwordHash: hashedPassword,
          signUpIpAddress: await getIP(),
        });

        if (!user || !user.email) {
          throw new ZSAError(
            "INTERNAL_SERVER_ERROR",
            "Nem sikerült létrehozni a felhasználót"
          );
        }

        try {
          // Create a session
          const sessionToken = generateSessionToken();
          const session = await createSession({
            token: sessionToken,
            userId: user.id,
            authenticationType: "password",
          });

          // Set the session cookie
          await setSessionTokenCookie({
            token: sessionToken,
            userId: user.id,
            expiresAt: new Date(session.expiresAt)
          });

          // Generate verification token
          const verificationToken = createId();
          const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRATION_SECONDS * 1000);

          if (!env?.NEXT_INC_CACHE_KV) {
            throw new Error("Nem sikerült csatlakozni a KV tárhoz");
          }

          // Save verification token in KV with expiration
          await env.NEXT_INC_CACHE_KV.put(
            getVerificationTokenKey(verificationToken),
            JSON.stringify({
              userId: user.id,
              expiresAt: expiresAt.toISOString(),
            }),
            {
              expirationTtl: Math.floor((expiresAt.getTime() - Date.now()) / 1000),
            }
          );

          // Send verification email
          await sendVerificationEmail({
            email: user.email,
            verificationToken,
            username: user.nickname || user.firstName || user.email,
          });
        } catch (error) {
          console.error(error)

          throw new ZSAError(
            "INTERNAL_SERVER_ERROR",
            "Nem sikerült létrehozni a munkamenetet a regisztráció után"
          );
        }

        return { success: true };
      },
      RATE_LIMITS.SIGN_UP
    );
  })
