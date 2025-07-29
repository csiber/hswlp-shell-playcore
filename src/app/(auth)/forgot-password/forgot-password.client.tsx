"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { forgotPasswordAction } from "./forgot-password.action";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useSessionStore } from "@/state/session";
import { Captcha } from "@/components/captcha";
import { forgotPasswordSchema } from "@/schemas/forgot-password.schema";
import { useConfigStore } from "@/state/config";

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordClientComponent() {
  const { session } = useSessionStore()
  const { isTurnstileEnabled } = useConfigStore()
  const router = useRouter();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const captchaToken = useWatch({ control: form.control, name: 'captchaToken' })

  const { execute: sendResetLink, isSuccess } = useServerAction(forgotPasswordAction, {
    onError: (error) => {
      toast.dismiss();
      toast.error(error.err?.message);
    },
    onStart: () => {
      toast.loading("Új jelszó kérése folyamatban...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("A visszaállítási útmutató elküldve");
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    sendResetLink(data);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
          <CardTitle>Ellenőrizd az emailed</CardTitle>
            <CardDescription>
            Ha létezik fiók ezzel az email címmel, elküldtük a jelszó-visszaállítási lépéseket.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/sign-in")}
            >
              Vissza a belépéshez
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {session ? "Jelszó módosítása" : "Elfelejtett jelszó"}
          </CardTitle>
          <CardDescription>
            Add meg az email címed, és elküldjük a jelszó-visszaállítási útmutatót.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                disabled={Boolean(session?.user?.email)}
                defaultValue={session?.user?.email || undefined}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="w-full px-3 py-2"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col justify-center items-center">
                <Captcha
                  onSuccess={(token) => form.setValue('captchaToken', token)}
                  validationError={form.formState.errors.captchaToken?.message}
                />

                <Button
                  type="submit"
                  className="mt-8 mb-2"
                  disabled={Boolean(isTurnstileEnabled && !captchaToken)}
                >
                  Visszaállítási link küldése
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-4 w-full">
        {session ? (
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => router.push("/settings")}
          >
            Vissza a beállításokhoz
          </Button>
        ) : (
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => router.push("/sign-in")}
          >
            Vissza a belépéshez
          </Button>
        )}
      </div>

    </div>
  );
}
