"use client";

import { Spinner } from "@/components/ui/spinner";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";

export default function PayPalLoading() {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <p className="text-center text-muted-foreground">
        <Spinner className="inline-block mr-1" />
        <span className="text-sm">Loading PayPal</span>
      </p>
    );
  }

  if (isRejected) {
    return <p className="text-center text-destructive">Error Loading PayPal</p>;
  }
}
