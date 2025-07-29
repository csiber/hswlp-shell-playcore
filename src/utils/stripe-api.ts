import "server-only";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

function getSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }
  return key;
}

export async function stripeGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${STRIPE_API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Stripe API GET ${endpoint} failed with ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function stripePost<T>(endpoint: string, body: URLSearchParams): Promise<T> {
  const res = await fetch(`${STRIPE_API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Stripe API POST ${endpoint} failed with ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export interface StripePaymentIntent {
  id: string;
  client_secret?: string;
  status: string;
  metadata: Record<string, string>;
}
