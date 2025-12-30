import { z } from "zod";
import {
  productSchema,
  cartItemSchema,
  cartSchema,
  cartCookieSchema,
  cartRecord
} from "@/lib/validators";

export type Product = z.infer<typeof productSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type CartRecord = z.infer<typeof cartRecord>;
export type CartCookie = z.infer<typeof cartCookieSchema>;
