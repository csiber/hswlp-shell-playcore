import "server-only";

import { getDB } from "@/db";
import { slowRequestLogTable } from "@/db/schema";

export interface LogSlowRequestParams {
  url: string;
  durationMs: number;
  userId?: string;
  sessionHash?: string;
}

export async function logSlowRequest({
  url,
  durationMs,
  userId,
  sessionHash,
}: LogSlowRequestParams) {
  const db = getDB();
  await db.insert(slowRequestLogTable).values({
    url,
    durationMs: Math.round(durationMs),
    userId,
    sessionHash,
  });
}
