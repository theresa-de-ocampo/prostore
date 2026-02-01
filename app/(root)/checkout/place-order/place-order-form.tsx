"use client";

import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { type SyntheticEvent } from "react";

// * Components
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// * Actions
import { createOrder } from "@/lib/actions/order.actions";

export default function PlaceOrderForm() {
  const router = useRouter();
  const { pending } = useFormStatus();

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await createOrder();

    if (response.redirectTo) {
      router.push(response.redirectTo);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Button type="submit" disabled={pending} className="w-full">
        {pending && <Spinner />} Place Order
      </Button>
    </form>
  );
}
