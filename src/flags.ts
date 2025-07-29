import "server-only"

import { cache } from "react"

export async function isTurnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY)
}

export const getConfig = cache(async () => {
  return {
    isTurnstileEnabled: await isTurnstileEnabled(),
  }
})
