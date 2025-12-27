"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

// * Components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// * Actions
import { signUp } from "@/lib/actions/user.actions";

export default function SignUpForm() {
  const [data, action] = useActionState(signUp, {
    success: false,
    message: ""
  });

  const { pending } = useFormStatus();

  return (
    <form className="flex flex-col gap-4" action={action}>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" className="mt-1.5" />
      </div>
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
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          required
          className="mt-1.5"
        />
      </div>
      <div>
        <Button className="w-full" disabled={pending}>
          {pending && <Spinner />}
          Sign Up
        </Button>
        {!data.success && (
          <p className="text-destructive mt-2">{data.message}</p>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" target="_self" className="link">
          Sign In
        </Link>
      </p>
    </form>
  );
}
