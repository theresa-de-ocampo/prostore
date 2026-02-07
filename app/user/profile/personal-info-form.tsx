"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { updateUserName } from "@/lib/actions/user.actions";
import { toast } from "sonner";

export default function PersonalInfoForm() {
  const router = useRouter();
  const { data, status, update } = useSession();

  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: data?.user?.email || "",
      name: data?.user?.name || ""
    },
    mode: "all"
  });

  useEffect(() => {
    if (status === "authenticated") {
      form.reset({
        email: data?.user?.email || "",
        name: data?.user?.name || ""
      });
    }
  }, [data?.user?.email, data?.user?.name, form, status]);

  async function onSubmit(values: User) {
    const response = await updateUserName(values.name);

    if (response.success) {
      await update({ user: { ...values, name: values.name } });
      form.reset(values);
      router.refresh();
      toast.success(response.message);
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
