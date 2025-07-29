import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function ResetPasswordNotFound() {
  return (
    <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Érvénytelen visszaállítási link</CardTitle>
          <CardDescription>
            Ez a jelszó-visszaállítási link érvénytelen vagy lejárt. Kérj új linket.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            asChild
          >
            <Link href="/forgot-password">
              Új visszaállítási link kérése
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
