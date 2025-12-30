import { z } from "zod";
import {
  productSchema,
  cartItemSchema,
  cartSchema,
  cartCookieSchema
} from "@/lib/validators";

export type Product = z.infer<typeof productSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type CartCookie = z.infer<typeof cartCookieSchema>;

interface DbRow {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export type CartRecord = Cart & DbRow;
