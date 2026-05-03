import { auth } from "@/auth";

// * Components
import MarkAsDeliveredButton from "./admin-buttons/mark-as-delivered-button";
import MarkAsPaidButton from "./admin-buttons/mark-as-paid-button";
import PayPalPayment from "@/components/shared/payment/paypal-payment";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// * Types
import { OrderRecord } from "@/types";

// * Constants
import { PAYMENT_METHOD } from "@/lib/constants";

export default async function PriceSummary({ order }: { order: OrderRecord }) {
  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = order;
  const payPalClientId = process.env.PAYPAL_CLIENT_ID;
  const session = await auth();
  const isAdmin = session?.user.role === "admin";

  if (!payPalClientId) {
    throw new Error("PayPal client ID is required.");
  }

  return (
    <Card>
      <CardContent>
        <div className="flex-between">
          <div>Items</div>
          <div>${itemsPrice}</div>
        </div>
        <div className="flex-between">
          <div>Tax</div>
          <div>${taxPrice}</div>
        </div>
        <div className="flex-between">
          <div>Shipping</div>
          <div>{shippingPrice === "0.00" ? "Free" : shippingPrice}</div>
        </div>
        <div className="flex-between font-bold">
          <div>Total Price</div>
          <div>${totalPrice}</div>
        </div>
      </CardContent>

      <CardFooter>
        {!order.isPaid && order.paymentMethod === PAYMENT_METHOD.PAYPAL && (
          <PayPalPayment order={order} clientId={payPalClientId} />
        )}
        {isAdmin &&
          !order.isPaid &&
          order.paymentMethod === PAYMENT_METHOD.CASH_ON_DELIVERY && (
            <MarkAsPaidButton orderId={order.id} />
          )}
        {isAdmin && order.isPaid && !order.isDelivered && (
          <MarkAsDeliveredButton orderId={order.id} />
        )}
      </CardFooter>
    </Card>
  );
}
