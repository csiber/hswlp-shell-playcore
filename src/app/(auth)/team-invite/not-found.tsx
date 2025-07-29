import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>A meghívó nem található</CardTitle>
          <CardDescription>
            A keresett meghívó nem létezik, vagy lejárt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground">
              Ennek oka lehet:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>A meghívó URL-je hibás</li>
              <li>A csapat adminja visszavonta a meghívót</li>
              <li>A meghívó lejárt</li>
            </ul>
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  Ugrás a vezérlőpulthoz
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
