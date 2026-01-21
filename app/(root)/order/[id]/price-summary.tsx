// * Components
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import PayPalPayment from "@/components/shared/payment/paypal-payment";

// * Types
import { OrderRecord } from "@/types";

export default async function PriceSummary({ order }: { order: OrderRecord }) {
  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = order;
  const payPalClientId = process.env.PAYPAL_CLIENT_ID;

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
      {!order.isPaid && order.paymentMethod && (
        <CardFooter>
          <PayPalPayment order={order} clientId={payPalClientId} />
        </CardFooter>
      )}
    </Card>
  );
}
