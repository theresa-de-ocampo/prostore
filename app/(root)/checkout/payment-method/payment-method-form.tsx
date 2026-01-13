"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

// * Components
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";

// * RHF & Validations
import { useForm, Controller } from "react-hook-form";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";

// * Actions
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";

// * Types
import { PaymentMethod } from "@/types";

// * Constants
import { PAYMENT_METHOD } from "@/lib/constants";

export default function PaymentMethodForm({
  preferredPaymentMethod
}: {
  preferredPaymentMethod: PAYMENT_METHOD | null;
}) {
  const form = useForm<PaymentMethod>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || PAYMENT_METHOD.PAYPAL
    },
    mode: "all"
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(data: PaymentMethod) {
    startTransition(async () => {
      const response = await updateUserPaymentMethod(data);
      console.log(response);

      if (response.success) {
        router.push("/place-order");
      } else {
        toast.error(response.message);
      }
    });
  }

  return (
    <section className="max-w-md mx-auto">
      <h2>Payment Method</h2>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="post"
        className="my-5"
      >
        <FieldGroup>
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend className="sr-only">Payment Method</FieldLegend>
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                >
                  {Object.values(PAYMENT_METHOD).map((paymentMethod) => (
                    <FieldLabel key={paymentMethod} htmlFor={paymentMethod}>
                      <RadioGroupItem
                        id={paymentMethod}
                        value={paymentMethod}
                        aria-invalid={fieldState.invalid}
                      />
                      {paymentMethod}
                    </FieldLabel>
                  ))}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
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
