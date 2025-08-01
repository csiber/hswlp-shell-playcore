import type { Route } from "next"

export const SITE_NAME = "HSWLP:PlayCore"
export const SITE_DESCRIPTION =
  "Hybrid Service Workflow Launch Platform"
export const SITE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://hswlp-next.promnet.workers.dev/"
export const GITHUB_REPO_URL = "https://github.com/csiber/hswlp-next"

export const SITE_DOMAIN = new URL(SITE_URL).hostname
export const PASSWORD_RESET_TOKEN_EXPIRATION_SECONDS = 24 * 60 * 60 // 24 hours
export const EMAIL_VERIFICATION_TOKEN_EXPIRATION_SECONDS = 24 * 60 * 60 // 24 hours
export const MAX_SESSIONS_PER_USER = 5;
export const SESSION_COOKIE_NAME = "session";

export const CREDIT_PACKAGES = [
  { id: "package-1", credits: 500, price: 5 },
  { id: "package-2", credits: 1200, price: 10 },
  { id: "package-3", credits: 3000, price: 20 },
] as const;

export const CREDITS_EXPIRATION_YEARS = 2;

export const FREE_MONTHLY_CREDITS = CREDIT_PACKAGES[0].credits * 0.1;
export const MAX_TRANSACTIONS_PER_PAGE = 10;
export const REDIRECT_AFTER_SIGN_IN = "/dashboard" as Route;
