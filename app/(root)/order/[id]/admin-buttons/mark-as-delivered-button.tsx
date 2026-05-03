"use client";

import { useTransition } from "react";
import { toast } from "sonner";

// * Components
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// * Actions
import { markOrderAsDelivered } from "@/lib/actions/admin/order.actions";

export default function MarkAsDeliveredButton({
  orderId
}: {
  orderId: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleOnClick() {
    startTransition(async () => {
      const response = await markOrderAsDelivered(orderId);

      if (!response.success) {
        toast.error(response.message);
      }
    });
  }

  return (
    <Button onClick={handleOnClick} className="w-full">
      {isPending && <Spinner />}
      Mark as Delivered
    </Button>
  );
}
