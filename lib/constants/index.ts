export const APP_NAME = "ProStore";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const CHECKOUT_PAGES = [
  "Shipping Address",
  "Payment Method",
  "Place Order"
];

export enum PAYMENT_METHOD {
  PAYPAL = "PayPal",
  STRIPE = "Stripe",
  CASH_ON_DELIVERY = "CashOnDelivery"
}

export const KNOWLEDGE_DOC_TYPES = [
  "generic",
  "shipping_delivery",
  "returns_refunds",
  "order_tracking"
] as const;
