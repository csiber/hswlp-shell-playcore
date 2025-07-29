//@ts-expect-error: Will be resolved by wrangler build
import { fetchImage } from "./cloudflare/images.js";
//@ts-expect-error: Will be resolved by wrangler build
import { runWithCloudflareRequestContext } from "./cloudflare/init.js";
// @ts-expect-error: Will be resolved by wrangler build
import { handler as middlewareHandler } from "./middleware/handler.mjs";
//@ts-expect-error: Will be resolved by wrangler build
export { DOQueueHandler } from "./.build/durable-objects/queue.js";
//@ts-expect-error: Will be resolved by wrangler build
export { DOShardedTagCache } from "./.build/durable-objects/sharded-tag-cache.js";
//@ts-expect-error: Will be resolved by wrangler build
export { BucketCachePurge } from "./.build/durable-objects/bucket-cache-purge.js";

import { logSlowRequest } from "./utils/log-slow-request";
import { SESSION_COOKIE_NAME } from "./constants";

async function hashToken(token: string): Promise<string> {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function processSlowRequest(request: Request, duration: number) {
  if (duration <= 100) return;
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  let userId: string | undefined;
  let sessionHash: string | undefined;

  if (match) {
    const [uid, token] = match[1].split(":");
    if (uid && token) {
      userId = uid;
      sessionHash = await hashToken(token);
    }
  }

  await logSlowRequest({
    url: request.url,
    durationMs: duration,
    userId,
    sessionHash,
  });
}

const worker = {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext) {
    const start = performance.now();
    const response = await runWithCloudflareRequestContext(request, env, ctx, async () => {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/cdn-cgi/image/")) {
        const m = url.pathname.match(/\/cdn-cgi\/image\/.+?\/(.+)$/);
        if (m === null) {
          return new Response("Not Found!", { status: 404 });
        }
        const imageUrl = m[1];
        return imageUrl.match(/^https?:\/\//)
          ? fetch(imageUrl, { cf: { cacheEverything: true } })
          : env.ASSETS?.fetch(new URL(`/${imageUrl}`, url));
      }
      // @ts-expect-error - injected by OpenNext at build time
      if (url.pathname === `${globalThis.__NEXT_BASE_PATH__}/_next/image`) {
        const imageUrl = url.searchParams.get("url") ?? "";
        return fetchImage(env.ASSETS, imageUrl);
      }
      const reqOrResp = await middlewareHandler(request, env, ctx);
      if (reqOrResp instanceof Response) {
        return reqOrResp;
      }
      // @ts-expect-error: resolved by wrangler build
      const { handler } = await import("./server-functions/default/handler.mjs");
      return handler(reqOrResp, env, ctx);
    });
    const duration = performance.now() - start;
    ctx.waitUntil(processSlowRequest(request, duration));
    return response;
  },
};

export default worker;
