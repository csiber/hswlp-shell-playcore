import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import ResetPasswordClientComponent from "./reset-password.client";
import { getResetTokenKey } from "@/utils/auth-utils";

export const metadata: Metadata = {
  title: "Jelszó visszaállítása",
  description: "Új jelszó megadása a fiókhoz",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const token = (await searchParams).token;

  if (!token) {
    return notFound();
  }

  const { env } = getCloudflareContext();

  if (!env?.NEXT_INC_CACHE_KV) {
    throw new Error("Nem sikerült csatlakozni a KV tárhoz");
  }

  const resetTokenStr = await env.NEXT_INC_CACHE_KV.get(getResetTokenKey(token));

  if (!resetTokenStr) {
    return notFound();
  }

  return <ResetPasswordClientComponent />;
}
