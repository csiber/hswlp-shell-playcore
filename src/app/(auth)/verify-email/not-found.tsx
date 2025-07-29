import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Érvénytelen megerősítő link</CardTitle>
          <CardDescription>
            A megnyitott megerősítő link érvénytelen vagy lejárt. Ez történhet, ha:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>A link lejárt (a megerősítő linkek 24 óráig érvényesek)</li>
            <li>Már megerősítetted az e-mail címed</li>
            <li>A link módosítva lett vagy hiányos</li>
          </ul>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href="/sign-in">
                Bejelentkezés
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href="/">
                  Vissza a kezdőlapra
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
