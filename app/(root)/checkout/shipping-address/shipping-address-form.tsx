"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

// * Components
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

// * RHF & Validations
import { shippingAddressSchema } from "@/lib/validators";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// * Actions
import { updateUserAddress } from "@/lib/actions/user.actions";

// * Types
import { ShippingAddress } from "@/types";

export default function ShippingAddressForm({
  userId,
  address
}: {
  userId: string;
  address?: ShippingAddress;
}) {
  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || {
      fullName: "",
      street: "",
      city: "",
      postalCode: "",
      country: ""
    },
    mode: "all"
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(data: ShippingAddress) {
    startTransition(async () => {
      const response = await updateUserAddress(userId, data);

      if (response.success) {
        router.push("/checkout/payment-method");
      } else {
        toast.error(response.message);
      }
    });
  }

  return (
    <section className="max-w-md mx-auto">
      <h2 className="text-center">Shipping Address</h2>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="post"
        className="my-5"
      >
        <FieldGroup>
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
                <Input
                  {...field}
                  id="full-name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="street"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="street">Street</FieldLabel>
                <Input
                  {...field}
                  id="street"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="city"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input {...field} id="city" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="postalCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="postal-code">Postal Code</FieldLabel>
                <Input
                  {...field}
                  id="postal-code"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="country"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Input
                  {...field}
                  id="country"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : <ArrowRight />}
            Continue
          </Button>
        </FieldGroup>
      </form>
    </section>
  );
}
