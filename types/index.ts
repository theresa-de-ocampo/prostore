import { z } from "zod";
import {
  productSchema,
  cartItemSchema,
  cartSchema,
  cartCookieSchema,
  cartRecord,
  productRecord,
  shippingAddressSchema,
  paymentMethodSchema
} from "@/lib/validators";

export type Product = z.infer<typeof productSchema>;
export type ProductRecord = z.infer<typeof productRecord>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type CartRecord = z.infer<typeof cartRecord>;
export type CartCookie = z.infer<typeof cartCookieSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
