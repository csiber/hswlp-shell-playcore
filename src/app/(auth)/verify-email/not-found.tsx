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
          <CardTitle>Invalid verification link</CardTitle>
          <CardDescription>
            The verification link you opened is invalid or expired. This might happen if:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>The link expired (verification links are valid for 24 hours)</li>
            <li>You have already verified your email address</li>
            <li>The link was modified or is incomplete</li>
          </ul>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href="/sign-in">
                Sign in
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href="/">
                    Back to home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
