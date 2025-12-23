"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export default function CredentialsSignInForm() {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: ""
  });

  const { pending } = useFormStatus();

  return (
    <form className="flex flex-col gap-4" action={action}>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1.5"
        />
      </div>
      <div>
        <Button className="w-full" disabled={pending}>
          {pending && <Spinner />}
          Sign In
        </Button>
        {!data.success && (
          <p className="text-destructive mt-2">{data.message}</p>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" target="_self" className="link">
          Sign Up
        </Link>{" "}
      </p>
    </form>
  );
}
