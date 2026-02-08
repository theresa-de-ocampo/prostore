"use client";

import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// * RHF & Validations
import { useForm, Controller } from "react-hook-form";
import { userSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";

// * Components
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// * Actions
import { updateUserName } from "@/lib/actions/user.actions";

// * Types
import type { User } from "@/types";

/**
 * This component demonstrates how to update the user session in NextAuth.js.
 * It allows the user to change their name, which triggers a session update.
 * The session update is handled in the auth.ts configuration, specifically in the
 * JWT callback where the 'update' trigger is processed to refresh the token.
 *
 * Key features:
 * - Uses NextAuth's useSession hook to access and update session data.
 * - Calls the updateUserName server action to persist the name change in the database.
 * - Invokes update() to refresh the client-side session, which communicates with
 *   the auth.ts callbacks to update the JWT and session.
 */
export default function PersonalInfoForm() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: session?.user?.email || "",
      name: session?.user?.name || ""
    },
    mode: "all"
  });

  async function onSubmit(data: User) {
    const response = await updateUserName(data.name);

    if (response.success) {
      await update({ user: { ...data, name: data.name } });
      form.reset(data);
      toast.success(response.message);
      router.refresh();
    } else {
      toast.error(response.message);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} method="post">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                disabled
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input {...field} id="name" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          Save
        </Button>
      </FieldGroup>
    </form>
  );
}
