import { auth } from "@/auth";

// * Components
import MarkAsDeliveredButton from "./admin-buttons/mark-as-delivered-button";
import MarkAsPaidButton from "./admin-buttons/mark-as-paid-button";
import PayPalPayment from "@/components/shared/payment/paypal-payment";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// * Types
import { OrderRecord } from "@/types";

// * Lib
import { PAYMENT_METHOD } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default async function PriceSummary({ order }: { order: OrderRecord }) {
  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = order;

  const payPalClientId = process.env.PAYPAL_CLIENT_ID;
  if (!payPalClientId) {
    throw new Error("PayPal client ID is required.");
  }

  const session = await auth();
  const isAdmin = session?.user.role === "admin";
  const showPayPalPayment =
    !order.isPaid && order.paymentMethod === PAYMENT_METHOD.PAYPAL;
  const showMarkAsPaidButton =
    isAdmin &&
    !order.isPaid &&
    order.paymentMethod === PAYMENT_METHOD.CASH_ON_DELIVERY;
  const showMarkAsDeliveredButton =
    isAdmin && order.isPaid && !order.isDelivered;
  const showFooter =
    showPayPalPayment || showMarkAsPaidButton || showMarkAsDeliveredButton;

  return (
    <Card>
      <CardContent>
        <div className="flex-between">
          <div>Items</div>
          <div>{formatCurrency(itemsPrice)}</div>
        </div>
        <div className="flex-between">
          <div>Tax</div>
          <div>{formatCurrency(taxPrice)}</div>
        </div>
        <div className="flex-between">
          <div>Shipping</div>
          <div>
            {shippingPrice === "0.00" ? "Free" : formatCurrency(shippingPrice)}
          </div>
        </div>
        <div className="flex-between font-bold">
          <div>Total Price</div>
          <div>{formatCurrency(totalPrice)}</div>
        </div>
      </CardContent>
      {showFooter && (
        <CardFooter>
          {showPayPalPayment && (
            <PayPalPayment order={order} clientId={payPalClientId} />
          )}
          {showMarkAsPaidButton && <MarkAsPaidButton orderId={order.id} />}
          {showMarkAsDeliveredButton && (
            <MarkAsDeliveredButton orderId={order.id} />
          )}
        </CardFooter>
      )}
    </Card>
  );
}
