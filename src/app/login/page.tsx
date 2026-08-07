import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Part A: visual-only login. Part B wires real single-user auth.
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft">
            <Flame className="h-6 w-6 text-brand" />
          </span>
          <h1 className="text-lg font-bold tracking-tight">
            ragebait<span className="text-brand">x</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Mission control for one account that hits hard.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sign in</CardTitle>
            <CardDescription>
              Single-operator dashboard. Your keys stay server-side.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button render={<Link href="/" />} className="w-full">
              Enter mission control
            </Button>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          Training mode keeps a human on every post until the benchmark is hit.
        </p>
      </div>
    </div>
  );
}
