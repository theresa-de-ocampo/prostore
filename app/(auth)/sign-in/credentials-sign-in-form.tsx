"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
// import { useSearchParams } from "next/navigation";

// * Components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// * Actions
import { signInWithCredentials } from "@/lib/actions/user.actions";

export default function CredentialsSignInForm() {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: ""
  });

  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl") || "/";

  const { pending } = useFormStatus();

  return (
    <form className="flex flex-col gap-4" action={action}>
      {/* <input type="hidden" name="callbackUrl" value={callbackUrl} /> */}
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
