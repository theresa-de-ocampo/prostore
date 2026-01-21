"use client";

import { toast } from "sonner";

// * Components
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalLoading from "./paypal-loading";

// * Actions
import {
  createPayPalOrder,
  approvePayPalOrder
} from "@/lib/actions/order.actions";

// * Types
import { OrderRecord } from "@/types";

export default function PayPalPayment({
  order,
  clientId
}: {
  order: OrderRecord;
  clientId: string;
}) {
  async function handleCreatePayPalOrder() {
    const response = await createPayPalOrder(order.id);

    if (response.success) {
      return response.data;
    } else {
      toast.error(response.message);
    }
  }

  async function handleApprovePayPalOrder() {
    const response = await approvePayPalOrder(order.id);

    if (response.success) {
      toast.message(response.message);
    } else {
      toast.error(response.message);
    }
  }

  return (
    <div className="w-full">
      <PayPalScriptProvider options={{ clientId }}>
        <PayPalLoading />
        <PayPalButtons
          createOrder={handleCreatePayPalOrder}
          onApprove={handleApprovePayPalOrder}
        />
      </PayPalScriptProvider>
    </div>
  );
}
