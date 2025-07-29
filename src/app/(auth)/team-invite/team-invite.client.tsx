"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useServerAction } from "zsa-react";
import { acceptTeamInviteAction } from "./team-invite.action";
import { teamInviteSchema } from "@/schemas/team-invite.schema";
import { Spinner } from "@/components/ui/spinner";

export default function TeamInviteClientComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const hasCalledAcceptInvite = useRef(false);

  const { execute: handleAcceptInvite, isPending, error } = useServerAction(acceptTeamInviteAction, {
    onError: ({ err }) => {
      toast.dismiss();
      toast.error(err.message || "Nem sikerült elfogadni a csapatmeghívást");
    },
    onStart: () => {
      toast.loading("Meghívó feldolgozása...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Sikeresen csatlakoztál a csapathoz!");

      router.refresh();

      // Redirect to the team dashboard, with fallback to general dashboard
      setTimeout(() => {
        if (data && typeof data === 'object' && 'teamId' in data) {
          router.push(`/dashboard/teams/${data.teamId}`);
        } else if (data && typeof data === 'object' && data.data && 'teamId' in data.data) {
          router.push(`/dashboard/teams/${data.data.teamId}`);
        } else {
          // Fallback to dashboard if teamId is not found
          router.push('/dashboard');
        }
      }, 500);
    },
  });

  useEffect(() => {
    if (token && !hasCalledAcceptInvite.current) {
      const result = teamInviteSchema.safeParse({ token });
      if (result.success) {
        hasCalledAcceptInvite.current = true;
        handleAcceptInvite(result.data);
      } else {
        toast.error("Érvénytelen meghívó token");
        router.push("/sign-in");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (isPending) {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <Spinner size="large" />
              <CardTitle>Meghívó elfogadása</CardTitle>
              <CardDescription>
                Kérjük, várj amíg feldolgozzuk a csapatmeghívót...
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Meghívó hiba</CardTitle>
            <CardDescription>
              {error?.message || "Nem sikerült feldolgozni a meghívót"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {error?.code === "CONFLICT"
                ? "Már tagja vagy ennek a csapatnak."
                : error?.code === "FORBIDDEN" && error?.message.includes("limit")
                ? "Elérted a csatlakozható csapatok maximális számát."
                : "A meghívó lejárt vagy visszavonták."}
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              Ugrás a vezérlőpulthoz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Érvénytelen meghívó link</CardTitle>
            <CardDescription>
              A meghívó link érvénytelen vagy lejárt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              Ugrás a vezérlőpulthoz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
