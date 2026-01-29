import { z } from "zod";
import {
  productSchema,
  cartItemSchema,
  cartSchema,
  cartCookieSchema,
  cartRecord,
  productRecord,
  shippingAddressSchema,
  paymentMethodSchema,
  orderSchema,
  orderItemSchema,
  orderRecord,
  paymentResultSchema,
  knowledgeDocSchema,
  knowledgeDocRecord
} from "@/lib/validators";

export type Product = z.infer<typeof productSchema>;
export type ProductRecord = z.infer<typeof productRecord>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type CartRecord = z.infer<typeof cartRecord>;
export type CartCookie = z.infer<typeof cartCookieSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderRecord = z.infer<typeof orderRecord>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type KnowledgeDoc = z.infer<typeof knowledgeDocSchema>;
export type KnowledgeDocRecord = z.infer<typeof knowledgeDocRecord>;
