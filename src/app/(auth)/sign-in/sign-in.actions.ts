"use server";

import { createServerAction, ZSAError } from "zsa";
import { findUserByEmail } from "@/db/user";
import { signInSchema } from "@/schemas/signin.schema";
import { verifyPassword } from "@/utils/password-hasher";
import { createAndStoreSession } from "@/utils/auth";
import { RATE_LIMITS, withRateLimit } from "@/utils/with-rate-limit";

export const signInAction = createServerAction()
  .input(signInSchema)
  .handler(async ({ input }) => {
    return withRateLimit(
      async () => {

        try {
          // Find user by email
          const user = await findUserByEmail(input.email);

          if (!user) {
            throw new ZSAError(
              "NOT_AUTHORIZED",
              "Invalid email or password"
            );
          }

          if (!user.passwordHash) {
            throw new ZSAError(
              "NOT_AUTHORIZED",
              "Invalid email or password"
            );
          }

          // Verify password
          const isValid = await verifyPassword({
            storedHash: user.passwordHash,
            passwordAttempt: input.password
          });

          if (!isValid) {
            throw new ZSAError(
              "NOT_AUTHORIZED",
              "Invalid email or password"
            );
          }

          // Create session
          await createAndStoreSession(user.id, "password")

          return { success: true };
        } catch (error) {
          console.error(error)

          if (error instanceof ZSAError) {
            throw error;
          }

          throw new ZSAError(
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred"
          );
        }
      },
      RATE_LIMITS.SIGN_IN
    );
  });

