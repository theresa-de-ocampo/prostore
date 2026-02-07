"use client";

import { useSession } from "next-auth/react";
import type { User } from "@/types";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError
} from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import { userSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PersonalInfoForm() {
  const { data, status, update } = useSession();

  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: data?.user?.email || "",
      name: data?.user?.name || ""
    },
    mode: "all"
  });

  return (
    <form>
      {status === "authenticated" && (
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
      )}
    </form>
  );
}
