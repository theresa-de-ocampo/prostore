"use client";

import Link from "next/link";
import { useTransition, useState } from "react";

// * Components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// * Actions
import { signUpV2 } from "@/lib/actions/user.actions";

// * Utils
import { sleep } from "@/lib/utils";

/**
 * SignUpFormV2 - A demonstration component for using useTransition without a form tag.
 *
 * This component showcases how to handle form submissions using React's useTransition hook
 * in scenarios where a traditional HTML form element is not used. Hence, form server actions
 * with the 'action' prop on the form elements can't be used.
 *
 * The formData here would typically come from libraries like React Hook Form's getValues() method
 * or state management solutions like Recoil.
 *
 * This demo is intended for educational purposes to illustrate alternative approaches to form
 * handling.
 */
export default function SignUpFormV2() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function submit() {
    startTransition(async () => {
      await sleep(5_000);
      await signUpV2(formData);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
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
          value={formData.password}
          onChange={handleInputChange}
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
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="mt-1.5"
        />
      </div>
      <div>
        <Button className="w-full" disabled={isPending} onClick={submit}>
          {isPending && <Spinner />}
          Sign Up
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" target="_self" className="link">
          Sign In
        </Link>
      </p>
    </div>
  );
}
